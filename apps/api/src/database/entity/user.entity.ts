import { RoleEntity } from "@api/database/entity/role.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import { StringToBytesTransformer } from "@api/database/transformer/string-to-bytes.transformer";
import { NullableStringColumn } from "@api/decorator/nullable-string-column.decorator";
import type { Bytes } from "@repo/common/entity/file.entity.type";
import {
  type UserBackend,
  type UserId,
} from "@repo/common/entity/user.entity.type";
import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

@Entity("user")
export default class UserEntity
  extends BaseUUIDEntity<UserId>
  implements UserBackend
{
  @Column({ unique: true })
  @Index()
  username: string;

  @NullableStringColumn({ unique: true })
  email?: string | null;

  @Column()
  @Exclude()
  password: string;

  @Column()
  fullName: string;

  @Column({ default: true })
  resetPassword: boolean;

  @Column({
    type: "bigint",
    default: 0,
    transformer: new StringToBytesTransformer(),
  })
  usedStorageBytes: Bytes;

  @Column({
    type: "bigint",
    default: 1024 * 1024 * 1024,
    transformer: new StringToBytesTransformer(),
  })
  storageLimitBytes: Bytes;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt?: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne(() => RoleEntity)
  @JoinColumn()
  role: RoleEntity;
}
