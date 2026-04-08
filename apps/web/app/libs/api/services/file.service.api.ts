import { ResponseSuccess } from "@repo/common/common.type";
import {
  CompleteUploadResponse,
  FileId,
  GetFileResponse,
  PrepareUploadResponse,
} from "@repo/common/entity/file.entity.type";
import { api } from "@web/libs/api/axios";

import axios, { AxiosProgressEvent } from "axios";

const FILE_API_VERSION = "v1";
const FILE_PREFIX = "file-upload";

export const prepareFileUpload = async (
  file: File,
): Promise<PrepareUploadResponse> => {
  const res = await api.post<ResponseSuccess<PrepareUploadResponse>>(
    `${FILE_API_VERSION}/${FILE_PREFIX}/prepare`,
    {
      size: file.size,
      fileName: file.name,
      mimeType: file.type,
    },
  );

  return res.data.data;
};

export interface UploadFilePayload {
  presignedUrl: string;
  file: File;
  onProgress: (progressEvent: AxiosProgressEvent) => void;
}

export const uploadFile = ({
  presignedUrl,
  file,
  onProgress,
}: UploadFilePayload) => {
  return axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: onProgress,
  });
};

export const completeFileUpload = async ({
  fileId,
  objectKey,
}: {
  fileId: FileId;
  objectKey: string;
}): Promise<CompleteUploadResponse> => {
  const res = await api.post<ResponseSuccess<CompleteUploadResponse>>(
    `${FILE_API_VERSION}/${FILE_PREFIX}/complete`,
    { id: fileId, objectKey },
  );

  return res.data.data;
};

export const getFileDownloadUrl = async ({ fileId }: { fileId: FileId }) => {
  const res = await api.get<ResponseSuccess<GetFileResponse>>(
    `${FILE_API_VERSION}/${FILE_PREFIX}/download/${fileId}`,
  );
  return res.data.data;
};
