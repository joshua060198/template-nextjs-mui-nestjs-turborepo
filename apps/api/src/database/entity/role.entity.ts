import { PermissionEntity } from "@api/database/entity/permission.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import { BackendRole, RoleId } from "@repo/common/entity/role.entity.type";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
} from "typeorm";

@Entity("role")
export class RoleEntity extends BaseUUIDEntity<RoleId> implements BackendRole {
  @Column({ unique: true })
  name: string;

  @Column()
  displayName: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ default: false })
  isSystem: boolean; // System roles cannot be deleted

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable()
  permissions: PermissionEntity[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
