export const STORAGE_MANAGER_PROVIDER = Symbol("STORAGE_MANAGER");
export const S3_INTERNAL_CLIENT_PROVIDER = Symbol("S3_INTERNAL_CLIENT");
export const S3_PUBLIC_CLIENT_PROVIDER = Symbol("S3_PUBLIC_CLIENT");

export interface LocalFileMetadata {
  size: number;
  mimeType?: string;
  lastModified: Date;
  path: string;
}

export interface LocalUploadResult {
  path: string;
  size: number;
}
