"use client";

import {
  DropzoneComponent,
  mapDropzoneError,
} from "@web/components/dropzone/Dropzone.component";
import { useAutoFileUploader } from "@web/libs/hooks/useUploadFiles.hooks";
import { UploadItem } from "@web/libs/types/file.type";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { Accept, DropzoneProps, FileRejection } from "react-dropzone";

interface ProfilePictureContainerProps {
  files: UploadItem[];
  setFiles: Dispatch<SetStateAction<UploadItem[]>>;
  maxFiles?: number;
  maxSize: number;
  minSize?: number;
  accept: Accept;
  dropzoneProps?: DropzoneProps;
}

export function DropzoneContainer({
  files,
  setFiles,
  maxFiles,
  maxSize,
  minSize,
  accept,
  dropzoneProps,
}: ProfilePictureContainerProps) {
  const t = useTranslations("Global.Component.Dropzone");
  const [selectionError, setSelectionError] = useState<string | null>(null);

  const { retryFromUpload, retryFromComplete, retryUpload, retryFromPrepare } =
    useAutoFileUploader(files, setFiles);

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => {
      if (maxFiles) {
        if (prev.length + newFiles.length > maxFiles) {
          setSelectionError(`Maximum ${maxFiles} file(s) allowed`);
          return prev;
        }
      }

      setSelectionError(null);

      return [
        ...prev,
        ...newFiles.map((file) => ({
          file,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
          progress: 0,
          stage: "idle" as UploadItem["stage"],
          id: new Date().valueOf() + file.name,
          retryCount: 0,
        })),
      ];
    });
  };

  const handleReject = (rejections: FileRejection[]) => {
    const msg = mapDropzoneError(t, rejections, {
      maxFiles: maxFiles,
      maxSize: maxSize,
      minSize: minSize ?? 0,
      accept: accept,
    });
    if (msg) {
      setSelectionError(msg);
    }
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      if (removed && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <DropzoneComponent
      files={files}
      error={selectionError ?? undefined}
      accept={accept}
      maxFiles={maxFiles}
      maxSize={maxSize}
      minSize={minSize}
      acceptInText="PNG, JPG"
      onAddFiles={handleAddFiles}
      onReject={handleReject}
      onRemoveFile={handleRemove}
      handleRetry={(id) => {
        const file = files.find((f) => f.id === id);
        if (!file) return;

        switch (file.errorStage) {
          case "prepare":
            retryFromPrepare(id);
            break;

          case "upload":
            retryFromUpload(id);
            break;

          case "complete":
            retryFromComplete(id);
            break;

          default:
            retryUpload(id);
        }
      }}
      {...dropzoneProps}
    />
  );
}
