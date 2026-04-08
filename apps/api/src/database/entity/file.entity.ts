import UserEntity from "@api/database/entity/user.entity";
import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import { StringToBytesTransformer } from "@api/database/transformer/string-to-bytes.transformer";
import { NullableStringColumn } from "@api/decorator/nullable-string-column.decorator";
import {
  type Bytes,
  type FileBackend,
  type FileId,
  FileStatus,
  FileVisibility,
} from "@repo/common/entity/file.entity.type";
import type { UserId } from "@repo/common/entity/user.entity.type";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity("file")
export default class FileEntity
  extends BaseUUIDEntity<FileId>
  implements FileBackend
{
  @Column()
  objectKey: string;

  @Column({
    type: "bigint",
    default: 0,
    transformer: new StringToBytesTransformer(),
  })
  size: Bytes;

  @Column()
  mimeType: string;

  @Column({ type: "enum", enum: FileStatus, default: FileStatus.PROCESSING })
  status: FileStatus;

  @Column({ default: "untitled" })
  originalName: string;

  @NullableStringColumn()
  thumbnailSmall?: string | null;

  @NullableStringColumn()
  thumbnailMedium?: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date;

  @Column({
    type: "enum",
    enum: FileVisibility,
    default: FileVisibility.PRIVATE,
  })
  visibility: FileVisibility;

  @Column({ name: "ownerId" })
  ownerId: UserId;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "ownerId" })
  user: UserEntity;
}
