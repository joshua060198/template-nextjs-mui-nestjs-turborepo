import { UploadItem } from "@web/libs/types/file.type";
import { useMemo } from "react";

export function useCompletedFileIds(files: UploadItem[]) {
  return useMemo(
    () =>
      files
        .filter(
          (f) => f.stage === "done" && typeof f.prepared?.fileId === "string",
        )
        .map((f) => f.prepared!.fileId),
    [files],
  );
}
