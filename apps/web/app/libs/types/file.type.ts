import { FileId } from "@repo/common/entity/file.entity.type";

export type UploadStatus =
  | "idle"
  | "preparing"
  | "uploading"
  | "completing"
  | "done"
  | "error";
export type UploadErrorStage = "prepare" | "upload" | "complete";
export type ResumeFrom = "prepare" | "upload" | "complete";

export interface UploadItem {
  id: string;
  file: File;
  preview?: string;

  stage: UploadStatus;
  errorStage?: UploadErrorStage;
  errorMessage?: string;
  resumeFrom?: ResumeFrom;

  progress: number;
  retryCount: number;

  prepared?: {
    uploadUrl: string;
    fileId: FileId;
    objectKey: string;
  };
}
