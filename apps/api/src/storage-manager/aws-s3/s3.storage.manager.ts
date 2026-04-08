import { BaseStorageManager } from "@api/storage-manager/storage-manager.base";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3StorageManager extends BaseStorageManager<
  HeadObjectCommandOutput,
  GetObjectCommandOutput,
  PutObjectCommandOutput
> {
  constructor(
    private readonly s3Public: S3Client,
    private readonly s3Internal: S3Client,
    private readonly bucket: string,
  ) {
    super();
  }

  createUploadUrl(
    key: string,
    mimeType: string,
    expiresInSeconds: number,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });

    return getSignedUrl(this.s3Public, command, {
      expiresIn: expiresInSeconds,
    });
  }

  getDownloadUrl(
    key: string,
    expiresInSeconds: number,
    filename?: string,
    contentType?: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: `inline; filename="${filename}"`,
      ResponseContentType: contentType,
    });

    return getSignedUrl(this.s3Public, command, {
      expiresIn: expiresInSeconds,
    });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Internal.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  directDownload(key: string) {
    return this.s3Internal.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  directUpload(key: string, body: Buffer, contentType: string) {
    return this.s3Internal.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  getFileMetadata(key: string) {
    return this.s3Internal.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}

export type S3StorageManagerType = BaseStorageManager<
  HeadObjectCommandOutput,
  GetObjectCommandOutput,
  PutObjectCommandOutput
>;
