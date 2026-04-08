"use client";

import { FileId } from "@repo/common/entity/file.entity.type";
import {
  useCompleteUploadFile,
  usePrepareUploadFile,
  useUploadFile,
} from "@web/libs/hooks/api/file.api.hooks";
import { UploadErrorStage, UploadItem } from "@web/libs/types/file.type";
import pLimit from "p-limit";
import { useEffect, useMemo } from "react";

const clearErrorState = {
  errorStage: undefined,
  errorMessage: undefined,
};
export function useAutoFileUploader(
  files: UploadItem[],
  setFiles: React.Dispatch<React.SetStateAction<UploadItem[]>>,
) {
  const prepare = usePrepareUploadFile();
  const upload = useUploadFile();
  const complete = useCompleteUploadFile();
  const limit = useMemo(() => pLimit(3), []);
  const updateFile = (id: string, patch: Partial<UploadItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const _fail = (item: UploadItem, stage: UploadErrorStage, error: Error) => {
    updateFile(item.id, {
      stage: "error",
      errorStage: stage,
      errorMessage: error?.message ?? "Upload failed",
      retryCount: item.retryCount + 1,
    });
  };

  const startUpload = async (item: UploadItem) => {
    limit(async () => {
      try {
        let uploadUrl: string | undefined = item.prepared?.uploadUrl;
        let fileId: FileId | undefined = item.prepared?.fileId;
        let objectKey: string | undefined = item.prepared?.objectKey;
        const resumeFrom = item.resumeFrom;

        // PREPARE
        if (!item.prepared || resumeFrom === "prepare") {
          updateFile(item.id, { stage: "preparing" });

          const prepared = await prepare.mutateAsync(item.file);
          uploadUrl = prepared.uploadUrl;
          fileId = prepared.id;
          objectKey = prepared.objectKey;
          updateFile(item.id, {
            prepared: {
              uploadUrl: prepared.uploadUrl,
              objectKey: prepared.objectKey,
              fileId: prepared.id,
            },
          });
        }

        // UPLOAD
        if (
          resumeFrom === undefined ||
          resumeFrom === "prepare" ||
          resumeFrom === "upload"
        ) {
          updateFile(item.id, { stage: "uploading" });

          await upload.mutateAsync({
            presignedUrl: uploadUrl!,
            file: item.file,
            onProgress: ({ loaded, total }) => {
              updateFile(item.id, {
                progress: Math.floor((loaded * 100) / (total ?? 1)),
              });
            },
          });
        }

        // COMPLETE
        if (
          resumeFrom === undefined ||
          resumeFrom === "prepare" ||
          resumeFrom === "upload" ||
          resumeFrom === "complete"
        ) {
          updateFile(item.id, { stage: "completing" });

          await complete.mutateAsync({
            fileId: fileId!,
            objectKey: objectKey!,
          });
        }

        updateFile(item.id, { stage: "done", progress: 100 });
      } catch (err) {
        const failedStage: UploadErrorStage =
          item.stage === "preparing"
            ? "prepare"
            : item.stage === "uploading"
              ? "upload"
              : "complete";

        updateFile(item.id, {
          stage: "error",
          errorStage: failedStage,
          errorMessage: (err as Error)?.message ?? "Upload failed",
          retryCount: item.retryCount + 1,
        });
      }
    });
  };

  // AUTO START
  useEffect(() => {
    files.filter((f) => f.stage === "idle").forEach(startUpload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // ---------- RETRY APIs ----------
  const retryUpload = (id: string) => {
    updateFile(id, {
      stage: "idle",
      ...clearErrorState,
    });
  };

  const retryFromPrepare = (id: string) => {
    updateFile(id, {
      prepared: undefined,
      resumeFrom: "prepare",
      stage: "idle",
      ...clearErrorState,
    });
  };

  const retryFromUpload = (id: string) => {
    updateFile(id, {
      resumeFrom: "upload",
      stage: "idle",
      ...clearErrorState,
    });
  };

  const retryFromComplete = (id: string) => {
    updateFile(id, {
      resumeFrom: "complete",
      stage: "idle",
      ...clearErrorState,
    });
  };

  return {
    retryUpload,
    retryFromPrepare,
    retryFromUpload,
    retryFromComplete,
  };
}
