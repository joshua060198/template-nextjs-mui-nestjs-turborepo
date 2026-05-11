import { RoleEntity } from "@api/database/entity/role.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import {
  BackendPermission,
  PermissionId,
} from "@repo/common/entity/permission.entity.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("permission")
@Unique(["action", "resource"])
export class PermissionEntity
  extends BaseUUIDEntity<PermissionId>
  implements BackendPermission
{
  @Column()
  resource: string;

  @Column()
  action: string;

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
