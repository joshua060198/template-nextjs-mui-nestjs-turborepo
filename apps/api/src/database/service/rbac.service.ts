import { PermissionEntity } from "@api/database/entity/permission.entity";
import { RoleEntity } from "@api/database/entity/role.entity";
import { UserPermissionEntity } from "@api/database/entity/user-permission.entity";
import UserEntity from "@api/database/entity/user.entity";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AUTH_ERROR } from "@repo/common/auth.service.type";
import { ResponseFailed } from "@repo/common/common.type";
import {
  CreateRole,
  RoleId,
  UpdateRole,
} from "@repo/common/entity/role.entity.type";
import { UserPermissionEffect } from "@repo/common/entity/user-permission.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import {
  getActionResourceFromPermissionString,
  getNameFromPermission,
} from "@repo/common/util/permission";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { Repository } from "typeorm";

@Injectable()
export class RBACService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserPermissionEntity)
    private userPermissionRepository: Repository<UserPermissionEntity>,
  ) {}

  queryPermission(data: PaginateQuery) {
    return paginate(data, this.permissionRepository, {
      sortableColumns: [
        "resource",
        "action",
        "displayName",
        "updatedAt",
        "createdAt",
      ],
      defaultSortBy: [
        ["resource", "ASC"],
        ["action", "ASC"],
      ],
      filterableColumns: {
        resource: true,
        action: true,
        displayName: true,
      },
      withDeleted: true,
      allowWithDeletedInQuery: true,
      searchableColumns: ["resource", "action", "description", "displayName"],
    });
  }

  queryRole(data: PaginateQuery) {
    return paginate(data, this.roleRepository, {
      sortableColumns: [
        "name",
        "displayName",
        "isSystem",
        "updatedAt",
        "createdAt",
      ],
      defaultSortBy: [["name", "ASC"]],
      allowWithDeletedInQuery: true,
      relations: ["permissions"],
      filterableColumns: {
        id: true,
        name: true,
        displayName: true,
        isSystem: true,
        deletedAt: true,
      },
      withDeleted: true,
      searchableColumns: ["name", "description", "displayName"],
    });
  }

  queryUserPermissions(data: PaginateQuery) {
    return paginate(data, this.userPermissionRepository, {
      sortableColumns: ["effect"],
      defaultSortBy: [["effect", "ASC"]],
      filterableColumns: {
        "user.id": true,
        "user.fullName": true,
        "permission.id": true,
        "permission.displayName": true,
        effect: true,
      },
      relations: ["user", "permission"],
      searchableColumns: [
        "user.id",
        "permission.id",
        "user.fullName",
        "permission.displayName",
      ],
    });
  }

  async createRole(data: CreateRole) {
    const newData = this.roleRepository.create({
      ...data,
      permissions: data.permissions.map((permissionId) => ({
        id: permissionId,
      })),
    });
    const newRole = await this.roleRepository.save(newData);
    return this.findRoleByIdWithPermissions(newRole.id);
  }

  async updateRole(id: RoleId, data: UpdateRole) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) return null;

    await this.roleRepository.update(id, {
      name: data.name,
      description: data.description,
      displayName: data.displayName,
    });

    if (data.permissions) {
      await this.roleRepository.save({
        id,
        permissions: data.permissions.map((permissionId) => ({
          id: permissionId,
        })),
      });
    }

    return this.findRoleByIdWithPermissions(id);
  }

  async deactivateRole(id: RoleId) {
    await this.roleRepository.softDelete(id);
    return this.findRoleByIdWithPermissions(id);
  }

  async activateRole(id: RoleId) {
    await this.roleRepository.restore(id);
    return this.findRoleByIdWithPermissions(id);
  }

  async getUserPermissions(id: UserId) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["role", "role.permissions"],
    });

    if (!user) {
      return [];
    }

    // Get permissions from role
    const rolePermissions =
      user.role?.permissions?.map((p) => getNameFromPermission(p)) || [];

    // Get user-specific permission overrides
    const userPermissions = await this.userPermissionRepository.find({
      where: { user: { id } },
      relations: ["permission"],
    });

    // Apply overrides
    const permissions = new Set(rolePermissions);
    userPermissions.forEach((up) => {
      if (up.effect === UserPermissionEffect.ALLOW) {
        permissions.add(getNameFromPermission(up.permission));
      } else {
        permissions.delete(getNameFromPermission(up.permission));
      }
    });

    return Array.from(permissions);
  }

  async hasPermission(id: UserId, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(id);
    return permissions.includes(permission);
  }

  async grantPermission(id: UserId, permissionString: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    const { action, resource } =
      getActionResourceFromPermissionString(permissionString);

    if (!action || !resource) {
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.PERMISSION_STRING_INVALID),
      );
    }

    const permission = await this.permissionRepository.findOne({
      where: { action, resource },
    });

    if (!user)
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.USER_NOT_FOUND),
      );

    if (!permission)
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.PERMISSION_NOT_FOUND),
      );

    const existing = await this.userPermissionRepository.findOne({
      where: { user: { id }, permission: { id: permission.id } },
    });

    if (existing) {
      existing.effect = UserPermissionEffect.ALLOW;
      await this.userPermissionRepository.save(existing);
    } else {
      const userPermission = this.userPermissionRepository.create({
        user,
        permission,
        effect: UserPermissionEffect.ALLOW,
      });
      await this.userPermissionRepository.save(userPermission);
    }

    return this.userPermissionRepository.findOne({
      where: {
        user: { id },
        permission: { action, resource },
      },
      relations: ["user", "permission"],
    });
  }

  async revokePermission(id: UserId, permissionString: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    const { action, resource } =
      getActionResourceFromPermissionString(permissionString);

    if (!action || !resource) {
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.PERMISSION_STRING_INVALID),
      );
    }

    const permission = await this.permissionRepository.findOne({
      where: { action, resource },
    });

    if (!user)
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.USER_NOT_FOUND),
      );

    if (!permission)
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.PERMISSION_NOT_FOUND),
      );

    const existing = await this.userPermissionRepository.findOne({
      where: { user: { id: id }, permission: { id: permission.id } },
    });

    if (existing) {
      existing.effect = UserPermissionEffect.DENY;
      await this.userPermissionRepository.save(existing);
    } else {
      const userPermission = this.userPermissionRepository.create({
        user,
        permission,
        effect: UserPermissionEffect.DENY,
      });
      await this.userPermissionRepository.save(userPermission);
    }

    return this.userPermissionRepository.findOne({
      where: {
        user: { id },
        permission: { action, resource },
      },
      relations: ["user", "permission"],
    });
  }

  async assignRole(id: UserId, roleId: RoleId) {
    const user = await this.userRepository.findOne({ where: { id } });
    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!user)
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.USER_NOT_FOUND),
      );

    if (!role)
      throw new InternalServerErrorException(
        new ResponseFailed(AUTH_ERROR.ROLE_NOT_FOUND),
      );

    user.role = role;
    await this.userRepository.save(user);
    return this.userRepository.findOne({
      where: { id },
      relations: ["role"],
    });
  }

  async resetPassword(id: UserId, password: string) {
    await this.userRepository.update({ id }, { password, resetPassword: true });
  }

  async changePassword(id: UserId, password: string) {
    await this.userRepository.update(
      { id },
      { password, resetPassword: false },
    );
  }

  getPermissionActions() {
    return this.permissionRepository
      .createQueryBuilder("p")
      .select("action")
      .getRawMany<{ action: string }>();
  }

  getPermissionResources() {
    return this.permissionRepository
      .createQueryBuilder("p")
      .select("resource")
      .getRawMany<{ resource: string }>();
  }

  getAvailablePermissions() {
    return this.permissionRepository.find();
  }

  private findRoleByIdWithPermissions(id: RoleId) {
    return this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
      withDeleted: true,
    });
  }
}
