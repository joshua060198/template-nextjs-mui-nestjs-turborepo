import { FileShareEntity } from "@api/database/entity/file-shares.entity";
import { BaseTransactionalService } from "@api/database/service/transactional-base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileId } from "@repo/common/entity/file.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class FileShareService extends BaseTransactionalService<FileShareEntity> {
  constructor(
    @InjectRepository(FileShareEntity)
    fileShareRepository: Repository<FileShareEntity>,
  ) {
    super(FileShareEntity, fileShareRepository);
  }

  async checkFileSharedWithUser(
    fileId: FileId,
    userId: UserId,
    manager?: EntityManager,
  ) {
    return this.repo(manager).exists({
      where: {
        fileId,
        sharedWithUserId: userId,
      },
    });
  }

  async checkIsUsed(fileId: FileId, manager?: EntityManager) {
    return this.repo(manager).exists({
      where: {
        fileId,
      },
    });
  }
}
