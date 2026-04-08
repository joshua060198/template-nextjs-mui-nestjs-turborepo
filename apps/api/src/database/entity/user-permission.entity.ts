import { PermissionEntity } from "@api/database/entity/permission.entity";
import UserEntity from "@api/database/entity/user.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import {
  BackendUserPermission,
  UserPermissionEffect,
  UserPermissionId,
} from "@repo/common/entity/user-permission.entity.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm";

@Unique(["user", "permission"])
@Entity("user_permissions")
export class UserPermissionEntity
  extends BaseUUIDEntity<UserPermissionId>
  implements BackendUserPermission
{
  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PermissionEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  permission: PermissionEntity;

  @Column({
    type: "enum",
    enum: UserPermissionEffect,
    default: UserPermissionEffect.DENY,
  })
  effect: UserPermissionEffect;

  @CreateDateColumn()
  createdAt: Date;
}
