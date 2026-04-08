import UserEntity from "@api/database/entity/user.entity";
import { BaseTransactionalService } from "@api/database/service/transactional-base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterUser } from "@repo/common/auth.service.type";
import { Bytes } from "@repo/common/entity/file.entity.type";
import {
  UpdateUserProfile,
  UserId,
} from "@repo/common/entity/user.entity.type";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { EntityManager, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class UserService extends BaseTransactionalService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) userRepository: Repository<UserEntity>,
  ) {
    super(UserEntity, userRepository);
  }

  queryUser(data: PaginateQuery) {
    return paginate(data, this.repo(), {
      sortableColumns: [
        "username",
        "fullName",
        "email",
        "updatedAt",
        "createdAt",
      ],
      nullSort: "last",
      defaultSortBy: [["createdAt", "DESC"]],
      allowWithDeletedInQuery: true,
      relations: ["role", "role.permissions"],
      filterableColumns: {
        username: true,
        fullName: true,
        email: true,
        "role.displayName": true,
        "role.id": true,
      },
      searchableColumns: ["username", "fullName", "email", "role.displayName"],
    });
  }

  findUserByUsername(username: string, manager?: EntityManager) {
    return this.getFullUserBy({ username }, manager);
  }

  getUserById(id: UserId, manager?: EntityManager) {
    return this.getFullUserBy({ id }, manager);
  }

  getUserByEmail(email: string, manager?: EntityManager) {
    return this.getFullUserBy({ email }, manager);
  }

  createUser(data: RegisterUser, manager?: EntityManager) {
    return this.repo(manager).save(
      this.repo(manager).create({
        ...data,
        role: { id: data.roleId },
      }),
    );
  }

  updateUserPassword(id: UserId, newPassword: string, manager?: EntityManager) {
    return this.repo(manager).update({ id }, { password: newPassword });
  }

  updateUserProfile(
    id: UserId,
    data: UpdateUserProfile,
    manager?: EntityManager,
  ) {
    return this.repo(manager).update(
      { id },
      {
        email: data.email,
        fullName: data.fullName,
      },
    );
  }

  consumeUserQuota(id: UserId, size: Bytes, manager?: EntityManager) {
    return this.repo(manager)
      .createQueryBuilder("u")
      .update()
      .set({
        usedStorageBytes: () => `"usedStorageBytes" + :fileSize`,
      })
      .where(`"id" = :id`)
      .setParameters({ id, fileSize: size })
      .execute();
  }

  private getFullUserBy(
    where?: FindOptionsWhere<UserEntity>,
    manager?: EntityManager,
  ) {
    return this.repo(manager).findOne({
      where,
      relations: ["role"],
    });
  }
}
