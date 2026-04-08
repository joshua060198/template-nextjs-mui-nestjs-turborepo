import UserEntity from "@api/database/entity/user.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import { NullableStringColumn } from "@api/decorator/nullable-string-column.decorator";
import type {
  LoginActivityBackend,
  LoginActivityId,
} from "@repo/common/entity/login-activity.entity.type";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity("login-activity")
export default class LoginActivityEntity
  extends BaseUUIDEntity<LoginActivityId>
  implements LoginActivityBackend
{
  @Column({
    type: "inet",
  })
  ip: string;

  @Column()
  userAgent: string;

  @NullableStringColumn()
  browser?: string | null;

  @NullableStringColumn()
  browserVersion?: string | null;

  @NullableStringColumn()
  os?: string | null;

  @NullableStringColumn()
  device?: string | null;

  @NullableStringColumn()
  continent?: string | null;

  @NullableStringColumn()
  country?: string | null;

  @NullableStringColumn()
  city?: string | null;

  @Column()
  isSuccess: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
