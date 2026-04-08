export abstract class BaseStorageManager<
  FileMetadataType,
  DirectDownloadType,
  DirectUploadType,
> {
  abstract createUploadUrl(
    key: string,
    mimeType: string,
    expiresInSeconds: number,
  ): Promise<string>;

  abstract getDownloadUrl(
    key: string,
    expiresInSeconds: number,
    filename?: string,
    contentType?: string,
  ): Promise<string>;

  abstract deleteFile(key: string): Promise<void>;

  abstract directUpload(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<DirectUploadType>;

  abstract directDownload(key: string): Promise<DirectDownloadType>;

  abstract getFileMetadata(key: string): Promise<FileMetadataType>;
}
