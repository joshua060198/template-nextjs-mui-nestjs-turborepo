import { BaseUUIDEntity } from "@api/database/entity/uuid-pk.base";
import type {
  FileShareBackend,
  FileShareId,
} from "@repo/common/entity/file-share.entity.type";
import type { FileId } from "@repo/common/entity/file.entity.type";
import type { UserId } from "@repo/common/entity/user.entity.type";
import { Column, CreateDateColumn, Entity, Unique } from "typeorm";

@Entity("file_share")
@Unique(["fileId", "sharedWithUserId"])
export class FileShareEntity
  extends BaseUUIDEntity<FileShareId>
  implements FileShareBackend
{
  @Column({ type: "uuid" })
  fileId: FileId;

  @Column({ type: "uuid" })
  sharedWithUserId: UserId;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
}
