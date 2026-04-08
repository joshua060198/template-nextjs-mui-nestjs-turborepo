import {
  completeFileUpload,
  getFileDownloadUrl,
  prepareFileUpload,
  uploadFile,
} from "@web/libs/api/services/file.service.api";
import use401ErrorHandler from "@web/libs/hooks/api/with401ErrorHandler";
import { useSnack } from "@web/libs/hooks/useSnack.hooks";
import { FileId } from "@repo/common/entity/file.entity.type";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function usePrepareUploadFile() {
  const t = useTranslations("Service.File");
  const snack = useSnack();

  return useMutation({
    mutationFn: prepareFileUpload,
    onError: use401ErrorHandler(() => {
      snack.error(t("Errors.PrepareUploadError"));
    }),
  });
}

export function useUploadFile() {
  const t = useTranslations("Service.File");
  const snack = useSnack();
  return useMutation({
    mutationKey: ["prepare-file"],
    mutationFn: uploadFile,
    onError: use401ErrorHandler(() => {
      snack.error(t("Errors.UploadError"));
    }),
  });
}

export function useCompleteUploadFile() {
  const t = useTranslations("Service.File");
  const snack = useSnack();

  return useMutation({
    mutationKey: ["complete-file"],
    mutationFn: completeFileUpload,
    onError: use401ErrorHandler(() => {
      snack.error(t("Errors.CompleteUploadError"));
    }),
  });
}
const SAFETY_BUFFER_MS = 5_000;

export function useDownloadFile(fileId?: FileId) {
  return useQuery({
    queryKey: ["file", fileId, "download"],
    queryFn: fileId ? () => getFileDownloadUrl({ fileId }) : skipToken,
    staleTime: (data) =>
      data.state.data
        ? Math.max(
            data.state.data.expiresInSeconds * 1000 - SAFETY_BUFFER_MS,
            0,
          )
        : 0,
    gcTime: 10 * 60 * 1000,
  });
}
