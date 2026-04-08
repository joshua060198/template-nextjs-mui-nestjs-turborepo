import { RBACService } from "@api/database/service/rbac.service";
import { TransactionService } from "@api/database/service/transaction.service";
import { UserService } from "@api/database/service/user.service";
import { LoginDto, RegisterUserDto } from "@api/service/auth/auth.dto";
import throwIfNull from "@api/util/throw-if-null.util";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  AUTH_ERROR,
  JwtPayload,
  LoginResponse,
  MeResponseBackend,
  UnauthorizedError,
} from "@repo/common/auth.service.type";
import { ResponseFailed, ResponseSuccess } from "@repo/common/common.type";
import {
  AllPermissions,
  PermissionAction,
  PermissionName,
  PermissionResource,
} from "@repo/common/entity/permission.entity.type";
import {
  CreateRole,
  RoleId,
  UpdateRole,
} from "@repo/common/entity/role.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import { tokenGenerationUtil } from "@repo/common/util/hash";
import * as bcrypt from "bcrypt";
import { PaginateQuery } from "nestjs-paginate";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly rbacService: RBACService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username);
    if (!user)
      throw new BadRequestException(
        new ResponseFailed(AUTH_ERROR.USER_NOT_FOUND),
      );
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        new ResponseFailed(new UnauthorizedError(user.id)),
      );
    }
    return user;
  }

  async register(data: RegisterUserDto) {
    return this.transactionService.run(async (manager) => {
      const user = await this.userService.findUserByUsername(
        data.username,
        manager,
      );

      if (user) {
        throw new BadRequestException(
          new ResponseFailed(AUTH_ERROR.DUPLICATE_USER_ERROR),
        );
      }

      const newPassword = data.password
        ? data.password
        : tokenGenerationUtil(8).token;

      const hashedPassword = await this.hashedPassword(newPassword);

      await this.userService.createUser(
        {
          ...data,
          password: hashedPassword,
        },
        manager,
      );

      return new ResponseSuccess(newPassword);
    });
  }

  async login({ username, password }: LoginDto) {
    const user = await this.validateUser(username, password);
    const permissions = await this.rbacService.getUserPermissions(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "1d" });

    return new ResponseSuccess<LoginResponse>({
      accessToken,
      sub: user.id,
    });
  }

  async me(id: UserId) {
    const result = await this.userService.getUserById(id);
    const permissions = await this.rbacService.getUserPermissions(id);

    if (!result)
      throw new UnauthorizedException(
        new ResponseFailed(new UnauthorizedError(id)),
      );

    return new ResponseSuccess<MeResponseBackend>({ ...result, permissions });
  }

  async queryUser(data: PaginateQuery) {
    const result = await this.userService.queryUser(data);

    return new ResponseSuccess(result);
  }
  async assignRole(id: UserId, role: RoleId) {
    const result = await this.rbacService.assignRole(id, role);

    return new ResponseSuccess(result);
  }

  async revokePermissionFromUser(id: UserId, permission: PermissionName) {
    const result = await this.rbacService.revokePermission(id, permission);

    return new ResponseSuccess(result);
  }

  async grantPermissionToUser(id: UserId, permission: PermissionName) {
    const result = await this.rbacService.grantPermission(id, permission);

    return new ResponseSuccess(result);
  }

  async queryPermission(data: PaginateQuery) {
    const result = await this.rbacService.queryPermission(data);

    return new ResponseSuccess(result);
  }

  async queryRole(data: PaginateQuery) {
    const result = await this.rbacService.queryRole(data);

    return new ResponseSuccess(result);
  }

  async addRole(data: CreateRole) {
    const result = await this.rbacService.createRole(data);
    throwIfNull(result, AUTH_ERROR.CREATE_ROLE_FAILED);
    return new ResponseSuccess(result);
  }

  async updateRole(id: RoleId, data: UpdateRole) {
    const result = await this.rbacService.updateRole(id, data);
    throwIfNull(result, AUTH_ERROR.ROLE_NOT_FOUND);
    return new ResponseSuccess(result);
  }

  async deleteRole(id: RoleId) {
    const result = await this.rbacService.deactivateRole(id);
    throwIfNull(result, AUTH_ERROR.ROLE_NOT_FOUND);
    return new ResponseSuccess(result);
  }

  async restoreRole(id: RoleId) {
    const result = await this.rbacService.activateRole(id);
    throwIfNull(result, AUTH_ERROR.ROLE_NOT_FOUND);
    return new ResponseSuccess(result);
  }

  getPermissionActions() {
    const result = Object.values(PermissionAction);
    return new ResponseSuccess(result);
  }

  getPermissionResources() {
    const result = Object.values(PermissionResource);
    return new ResponseSuccess(result);
  }

  getAvailablePermissions() {
    return new ResponseSuccess(AllPermissions);
  }

  async resetPassword(id: UserId) {
    const randomPass = tokenGenerationUtil(12);
    const hashedPass = await this.hashedPassword(randomPass.token);
    await this.rbacService.resetPassword(id, hashedPass);

    return new ResponseSuccess(randomPass.token);
  }

  async changePassword(id: UserId, password: string) {
    const hashedPass = await this.hashedPassword(password);
    await this.rbacService.changePassword(id, hashedPass);
    return new ResponseSuccess(true);
  }

  async getUserPermissions(id: UserId) {
    const result = await this.rbacService.getUserPermissions(id);
    return new ResponseSuccess(result);
  }

  private hashedPassword(password: string) {
    return bcrypt.hash(password, 12);
  }
}
