import { RoleEntity } from "@api/database/entity/role.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import {
  BackendPermission,
  PermissionId,
  type PermissionName,
} from "@repo/common/entity/permission.entity.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  UpdateDateColumn,
} from "typeorm";

@Entity("permission")
export class PermissionEntity
  extends BaseUUIDEntity<PermissionId>
  implements BackendPermission
{
  @Column({ unique: true })
  name: PermissionName;

  @Column()
  displayName: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
