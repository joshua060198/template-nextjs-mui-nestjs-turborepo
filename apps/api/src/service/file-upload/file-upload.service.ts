import FileEntity from "@api/database/entity/file.entity";
import { FileShareService } from "@api/database/service/file-share.service";
import { FileService } from "@api/database/service/file.service";
import { TransactionService } from "@api/database/service/transaction.service";
import { UserService } from "@api/database/service/user.service";
import {
  CompleteUploadDto,
  GetFileDto,
  PrepareUploadDto,
} from "@api/service/file-upload/file-upload.dto";
import type { S3StorageManagerType } from "@api/storage-manager/aws-s3/s3.storage.manager";
import { LocalStorageManagerType } from "@api/storage-manager/local/local.storage.manager";
import { STORAGE_MANAGER_PROVIDER } from "@api/storage-manager/storage-manager.constant";
import isDatabaseUpdateSuccess from "@api/util/is-update-success.util";
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ResponseFailed, ResponseSuccess } from "@repo/common/common.type";
import {
  Bytes,
  FileId,
  FileStatus,
  FileVisibility,
  GetFileResponse,
  PrepareUploadResponse,
} from "@repo/common/entity/file.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import { FILE_UPLOAD_ERROR } from "@repo/common/file-upload.service.type";
import { EntityManager } from "typeorm";

@Injectable()
export class FileUploadService {
  private readonly fileExpiration: number;
  private readonly storageType: "local" | "s3";

  constructor(
    private readonly config: ConfigService,
    @Inject(STORAGE_MANAGER_PROVIDER)
    private readonly storage: S3StorageManagerType | LocalStorageManagerType,
    private readonly fileService: FileService,
    private readonly fileShareService: FileShareService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {
    this.fileExpiration = this.config.getOrThrow<number>("AWS_FILE_EXPIRATION");
    this.storageType = this.config.getOrThrow<"local" | "s3">(
      "STORAGE_TYPE",
      "local",
    );
  }

  /* ───────────────────────── PUBLIC API ───────────────────────── */

  async prepareUpload(
    { fileName, size, mimeType }: PrepareUploadDto,
    userId: UserId,
  ) {
    return this.transactionService.run(async (manager) => {
      await this.checkQuota(userId, size);

      const preparedFile = await this.fileService.createFile(
        {
          mimeType,
          size,
          status: FileStatus.PROCESSING,
          userId,
          objectKey: "",
          originalName: fileName,
        },
        manager,
      );

      const objectKey = this.buildObjectKey(userId, preparedFile.id);

      const updateFile = await this.fileService.updateFileMetadata(
        {
          id: preparedFile.id,
          objectKey,
        },
        manager,
      );

      if (!updateFile)
        throw new BadRequestException(
          new ResponseFailed(FILE_UPLOAD_ERROR.UPLOADED_FILE_NOT_FOUND),
        );

      const uploadUrl = await this.storage.createUploadUrl(
        objectKey,
        mimeType,
        this.fileExpiration,
      );

      return new ResponseSuccess<PrepareUploadResponse>({
        id: preparedFile.id,
        objectKey,
        uploadUrl,
        expiresInSeconds: this.fileExpiration,
      });
    });
  }

  async completeUpload(
    { objectKey, id: fileId }: CompleteUploadDto,
    userId: UserId,
  ) {
    return this.transactionService.run(async (manager) => {
      const head = await this.storage.getFileMetadata(objectKey);
      console.log(head);
      const fileSize =
        this.storageType === "s3"
          ? (((
              head as Awaited<
                ReturnType<S3StorageManagerType["getFileMetadata"]>
              >
            ).ContentLength ?? 0) as Bytes)
          : (((
              head as Awaited<
                ReturnType<LocalStorageManagerType["getFileMetadata"]>
              >
            ).size ?? 0) as Bytes);

      if (fileSize <= 0) {
        throw new BadRequestException(
          new ResponseFailed(FILE_UPLOAD_ERROR.UPLOADED_FILE_NOT_FOUND),
        );
      }

      await this.consumeQuota(userId, fileSize, manager);

      const result = await this.fileService.updateFileMetadata(
        {
          id: fileId,
          size: fileSize,
          status: FileStatus.IDLE,
          objectKey: objectKey,
        },
        manager,
      );

      if (!result)
        throw new BadRequestException(
          new ResponseFailed(FILE_UPLOAD_ERROR.UPLOADED_FILE_NOT_FOUND),
        );

      return new ResponseSuccess<FileEntity>(result);
    });
  }

  async getFileDownloadUrl(
    fileId: FileId,
    { isThumbnail, isThumbnailMedium }: GetFileDto,
    userId?: UserId,
  ) {
    const file = await this.checkUserToFilePermission(fileId, userId);

    let objectKey = file.objectKey;

    if (isThumbnail) {
      if (isThumbnailMedium) {
        if (file.thumbnailMedium) objectKey = file.thumbnailMedium;
        else if (file.thumbnailSmall) objectKey = file.thumbnailSmall;
      } else {
        if (file.thumbnailSmall) objectKey = file.thumbnailSmall;
        else if (file.thumbnailMedium) objectKey = file.thumbnailMedium;
      }
    }

    const url = await this.storage.getDownloadUrl(
      objectKey,
      this.fileExpiration,
      file.originalName,
      file.mimeType,
    );

    return new ResponseSuccess<GetFileResponse>({
      url,
      expiresInSeconds: this.fileExpiration,
    });
  }

  // async deleteFile({ data: { filesId } }: TCPDeleteFileDto) {
  //   const files = await this.fileService.getFiles(filesId);
  //   await this.fileService.deleteFiles(files);
  // }

  // async createMultipartUpload(
  //   auth: AuthContext,
  //   dto: CreateMultipartUploadRequest,
  // ): Promise<CreateMultipartUploadResponse> {
  //   this.assertPermission(auth, Permission.FILE_UPLOAD);
  //
  //   const objectKey = this.buildObjectKey(
  //     auth.userId,
  //     asUUID(uuidv4()),
  //     dto.filename,
  //   );
  //
  //   const res = await this.aws-s3.send(
  //     new CreateMultipartUploadCommand({
  //       Bucket: this.bucket,
  //       Key: objectKey,
  //       ContentType: dto.mimeType,
  //     }),
  //   );
  //
  //   if (!res.UploadId) {
  //     throw new Error('Failed to create multipart upload');
  //   }
  //
  //   return {
  //     uploadId: res.UploadId,
  //     objectKey,
  //   };
  // }
  //
  // async getMultipartPartUrl(
  //   auth: AuthContext,
  //   dto: UploadPartRequest,
  // ): Promise<UploadPartResponse> {
  //   this.assertPermission(auth, Permission.FILE_UPLOAD);
  //
  //   const command = new UploadPartCommand({
  //     Bucket: this.bucket,
  //     Key: dto.objectKey,
  //     UploadId: dto.uploadId,
  //     PartNumber: dto.partNumber,
  //   });
  //
  //   const uploadUrl = await getSignedUrl(this.aws-s3, command, { expiresIn: this.fileExpiration });
  //
  //   return {
  //     uploadUrl,
  //     expiresInSeconds: this.fileExpiration,
  //   };
  // }
  //
  // async completeMultipartUpload(
  //   auth: AuthContext,
  //   dto: CompleteMultipartUploadRequest,
  // ): Promise<void> {
  //   this.assertPermission(auth, Permission.FILE_UPLOAD);
  //
  //   await this.aws-s3.send(
  //     new CompleteMultipartUploadCommand({
  //       Bucket: this.bucket,
  //       Key: dto.objectKey,
  //       UploadId: dto.uploadId,
  //       MultipartUpload: {
  //         Parts: dto.parts.map((p) => ({
  //           ETag: p.ETag,
  //           PartNumber: p.PartNumber,
  //         })),
  //       },
  //     }),
  //   );
  // }

  // async deleteFile(auth: AuthContext, fileId: UUID): Promise<void> {
  //   this.assertPermission(auth, Permission.FILE_DELETE);
  //
  //   const file = await this.fileRepo.findOne({
  //     where: { id: fileId, userId: auth.userId },
  //   });
  //
  //   if (!file) {
  //     throw new NotFoundException();
  //   }
  //
  //   await this.aws-s3.send(
  //     new DeleteObjectCommand({
  //       Bucket: this.bucket,
  //       Key: file.objectKey,
  //     }),
  //   );
  //
  //   await this.fileRepo.update(file.id, {
  //     status: FileStatus.DELETED,
  //   });
  //
  //   await this.releaseQuota(auth.userId, asBytes(Number(file.size)));
  // }

  /* ───────────────────────── PRIVATE HELPERS ───────────────────────── */
  private buildObjectKey(userId: UserId, fileId: FileId): string {
    return `users/${userId}/${fileId}`;
  }

  // private async createSignedPutUrl(objectKey: string, mimeType: string) {
  //   const command = new PutObjectCommand({
  //     Bucket: this.bucket,
  //     Key: objectKey,
  //     ContentType: mimeType,
  //   });
  //
  //   return getSignedUrl(this.s3Public, command, {
  //     expiresIn: this.fileExpiration * 60,
  //   });
  // }
  //
  // private async headObject(objectKey: string) {
  //   return this.s3Internal.send(
  //     new HeadObjectCommand({
  //       Bucket: this.bucket,
  //       Key: objectKey,
  //     }),
  //   );
  // }

  private async checkQuota(
    userId: UserId,
    fileSize: Bytes,
    manager?: EntityManager,
  ) {
    const user = await this.userService.getUserById(userId, manager);

    if (!user)
      throw new BadRequestException(
        new ResponseFailed(FILE_UPLOAD_ERROR.USER_NOT_FOUND),
      );

    if (user.usedStorageBytes + fileSize > user.storageLimitBytes)
      throw new InternalServerErrorException(
        new ResponseFailed(FILE_UPLOAD_ERROR.EXCEED_QUOTA_ERROR),
      );
  }

  // private async releaseQuota(userId: UUID, fileSize: Bytes): Promise<void> {
  //   await this.userRepo
  //     .createQueryBuilder()
  //     .update(UserEntity)
  //     .set({
  //       usedStorageBytes: () => `"usedStorageBytes" - ${fileSize}`,
  //     })
  //     .where('id = :id', { id: userId })
  //     .execute();
  // }

  private async consumeQuota(
    userId: UserId,
    fileSize: Bytes,
    manager?: EntityManager,
  ) {
    const updateResult = await this.userService.consumeUserQuota(
      userId,
      fileSize,
      manager,
    );

    if (!isDatabaseUpdateSuccess(updateResult))
      throw new InternalServerErrorException(
        new ResponseFailed(FILE_UPLOAD_ERROR.EXCEED_QUOTA_ERROR),
      );
  }

  private async checkUserToFilePermission(
    fileId: FileId,
    userId?: UserId,
    manager?: EntityManager,
  ) {
    const file = await this.fileService.getFile(fileId, manager);

    // file not found
    if (!file)
      throw new InternalServerErrorException(
        new ResponseFailed(FILE_UPLOAD_ERROR.UPLOADED_FILE_NOT_FOUND),
      );

    // file is public just pass
    if (file.visibility === FileVisibility.PUBLIC) return file;

    // file is not public, user at least must authenticate
    if (!userId)
      throw new InternalServerErrorException(
        new ResponseFailed(FILE_UPLOAD_ERROR.FILE_INVALID_ACCESS),
      );

    // user is the owner
    if (file.ownerId === userId) return file;

    // user must be shared explicitly
    if (file.visibility === FileVisibility.SHARED) {
      const passed = await this.fileShareService.checkFileSharedWithUser(
        fileId,
        userId,
        manager,
      );
      if (passed) return file;
    }

    throw new InternalServerErrorException(
      new ResponseFailed(FILE_UPLOAD_ERROR.FILE_INVALID_ACCESS),
    );
  }
}
