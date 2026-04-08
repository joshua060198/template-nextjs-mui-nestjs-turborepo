import { FileShareService } from "@api/database/service/file-share.service";
import { FileService } from "@api/database/service/file.service";
import { UserService } from "@api/database/service/user.service";
import type { S3StorageManagerType } from "@api/storage-manager/aws-s3/s3.storage.manager";
import { LocalStorageManagerType } from "@api/storage-manager/local/local.storage.manager";
import { STORAGE_MANAGER_PROVIDER } from "@api/storage-manager/storage-manager.constant";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  FILE_PROCESSING_QUEUE,
  FileProcessingJob,
  FileProcessingJobName,
} from "@repo/common/common.type";
import { Job } from "bullmq";
import { Readable } from "node:stream";

@Processor(FILE_PROCESSING_QUEUE)
export class FileWorkerProcessor extends WorkerHost {
  private log: Logger = new Logger(FileWorkerProcessor.name);
  private readonly bucket: string;
  constructor(
    private readonly config: ConfigService,
    @Inject(STORAGE_MANAGER_PROVIDER)
    private readonly storage: S3StorageManagerType | LocalStorageManagerType,
    private readonly fileService: FileService,
    private readonly fileShareService: FileShareService,
    private readonly userService: UserService,
  ) {
    super();
    this.bucket = this.config.getOrThrow<string>("AWS_BUCKET");
  }
  async process(
    job: Job<
      FileProcessingJob[keyof FileProcessingJob],
      void,
      FileProcessingJobName
    >,
  ): Promise<void> {
    this.log.log(
      `Processing job (${job.name}) with id [${job.id}]... ${JSON.stringify(job.data)}`,
    );
    try {
      switch (job.name) {
        case FileProcessingJobName.GENERATE_THUMBNAIL:
          await this.generateThumbnail(job.data);
          break;
        case FileProcessingJobName.IDLING_FILE:
          await this.idlingFile(job.data);
          break;
        case FileProcessingJobName.REMOVE_FILE:
          await this.removeFile(job.data);
          break;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private async generateThumbnail({
    fileId,
  }: FileProcessingJob[FileProcessingJobName.GENERATE_THUMBNAIL]): Promise<void> {
    // const file = await this.fileService.getFile(fileId);
    //
    // if (!file) {
    //   throw new UnrecoverableError();
    // }
    //
    // const original = await this.storage.directDownload(file.objectKey);
    //
    // const buffer = await this.streamToBuffer(original.Body as Readable);
    //
    // const small = await sharp(buffer)
    //   .resize(200)
    //   .jpeg({ quality: 80 })
    //   .toBuffer();
    //
    // const medium = await sharp(buffer)
    //   .resize(600)
    //   .jpeg({ quality: 85 })
    //   .toBuffer();
    //
    // const smallKey = await this.uploadThumbnail(
    //   file.objectKey,
    //   'thumb_sm.jpg',
    //   small,
    // );
    //
    // const mediumKey = await this.uploadThumbnail(
    //   file.objectKey,
    //   'thumb_md.jpg',
    //   medium,
    // );
    //
    // await this.fileService.updateFileMetadata({
    //   id: fileId,
    //   thumbnailMedium: mediumKey,
    //   thumbnailSmall: smallKey,
    // });
    // TODO
  }

  private async uploadThumbnail(
    originalKey: string,
    name: string,
    buffer: Buffer,
  ) {
    const thumbKey = originalKey.replace("/original", `/${name}`);

    await this.storage.directUpload(thumbKey, buffer, "image/jpeg");

    return thumbKey;
  }

  private async idlingFile({
    fileId,
    userId,
  }: FileProcessingJob[FileProcessingJobName.IDLING_FILE]) {
    // const isFileShared = await this.fileShareService.checkIsUsed(fileId);
    //
    // if (isFileShared) return;
    //
    // // check if used in profile entity
    // const isUsedInProfile = await this.userService.checkIsFileUsed(
    //   fileId,
    //   userId,
    // );
    //
    // if (isUsedInProfile) {
    //   return;
    // }
    //
    // // all check has passed means no entity used this anymore, applying idle status
    // await this.fileService.updateFileStatus({
    //   id: fileId,
    //   status: FileStatus.IDLE,
    // });
    //TODO
  }

  private async removeFile({
    fileId,
  }: FileProcessingJob[FileProcessingJobName.IDLING_FILE]) {}

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
  }
}
