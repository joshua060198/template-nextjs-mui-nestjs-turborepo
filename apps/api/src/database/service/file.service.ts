import FileEntity from "@api/database/entity/file.entity";
import { BaseTransactionalService } from "@api/database/service/transactional-base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CreateFile,
  FileId,
  UpdateFileMetadata,
  UpdateFileStatus,
} from "@repo/common/entity/file.entity.type";
import { EntityManager, In, Repository } from "typeorm";

@Injectable()
export class FileService extends BaseTransactionalService<FileEntity> {
  constructor(
    @InjectRepository(FileEntity)
    fileRepository: Repository<FileEntity>,
  ) {
    super(FileEntity, fileRepository);
  }

  getFiles(ids: FileId[], manager?: EntityManager) {
    return this.repo(manager).find({
      where: {
        id: In(ids),
      },
    });
  }

  getFile(id: FileId, manager?: EntityManager) {
    return this.repo(manager).findOneBy({ id });
  }

  getFileByObjectKey(key: string, manager?: EntityManager) {
    return this.repo(manager).findOneBy({ objectKey: key });
  }

  async updateFileStatus(data: UpdateFileStatus, manager?: EntityManager) {
    const { affected } = await this.repo(manager).update(
      { id: data.id },
      { status: data.status },
    );
    return affected !== 0;
  }

  createFile(data: CreateFile, manager?: EntityManager) {
    return this.repo(manager).save(
      this.repo(manager).create({
        ...data,
        user: { id: data.userId },
      }),
    );
  }

  async updateFileMetadata(data: UpdateFileMetadata, manager?: EntityManager) {
    const repo = this.repo(manager);
    const file = await repo.findOneBy({ id: data.id });
    if (!file) return null;

    if (data.objectKey) file.objectKey = data.objectKey;
    if (data.status) file.status = data.status;
    file.thumbnailSmall = data.thumbnailSmall;
    file.thumbnailMedium = data.thumbnailMedium;
    if (data.size) file.size = data.size;
    if (data.mimeType) file.mimeType = data.mimeType;

    return repo.save(file);
  }

  async deleteFiles(
    files: FileEntity[],
    isPermanent = false,
    manager?: EntityManager,
  ) {
    const repo = this.repo(manager);
    if (isPermanent) {
      // this is permanent delete (should come from worker only)
      await repo.remove(files);
    } else {
      await repo.softRemove(files);
    }
  }
}
