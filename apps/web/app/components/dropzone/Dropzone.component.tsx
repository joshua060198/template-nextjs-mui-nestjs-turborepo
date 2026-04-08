"use client";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DropzoneFileDownloadComponent from "@web/components/dropzone/DropzoneFileDownload.component";
import {
  CloseIcon,
  CloudUploadOutlinedIcon,
  InsertDriveFileOutlinedIcon,
  RefreshIcon,
} from "@web/components/IconCollection";
import CircularProgressWithLabel from "@web/components/native/CircularProgressWithLabel";
import { UploadItem } from "@web/libs/types/file.type";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import {
  Accept,
  DropzoneOptions,
  FileRejection,
  useDropzone,
} from "react-dropzone";

export interface DropzoneUIFile extends File {
  id: string;

  status: "idle" | "uploading" | "error" | "done";
  progress?: number;
  errorMessage?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getColorFromStatus(status: UploadItem["stage"]) {
  switch (status) {
    case "idle":
      return "default";
    case "error":
      return "error";
    case "done":
      return "success";
    case "preparing":
    case "completing":
      return "info";
  }
}

export function mapDropzoneError(
  t: ReturnType<typeof useTranslations>,
  rejections: FileRejection[],
  config: {
    maxFiles?: number;
    maxSize: number;
    minSize: number;
    accept?: Accept;
  },
): string | null {
  const error = rejections[0]?.errors[0];
  if (!error) return null;

  switch (error.code) {
    case "too-many-files":
      return t("TooManyFile", { total: config.maxFiles ?? 0 });
    case "file-invalid-type":
      return t("FileInvalid", {
        type: Object.values(config.accept ?? {})
          .flat()
          .join(", "),
      });
    case "file-too-large":
      return t("FileTooLarge", { size: config.maxSize });
    case "file-too-small":
      return t("FileTooSmall", { size: config.minSize });
    default:
      return "Invalid file";
  }
}

export interface DropzoneComponentProps extends Omit<
  DropzoneOptions,
  "onDrop"
> {
  files: UploadItem[];
  error?: string;

  onAddFiles: (files: File[]) => void;
  onReject: (rejections: FileRejection[]) => void;
  onRemoveFile: (index: number) => void;

  helperText?: React.ReactNode;
  acceptInText?: string;
  handleRetry: (id: string) => void;
}

export function DropzoneComponent({
  files,
  error,
  onAddFiles,
  onReject,
  onRemoveFile,
  helperText,
  acceptInText,
  accept,
  maxSize = 10 * 1024 * 1024,
  minSize = 1024,
  maxFiles,
  disabled,
  handleRetry,
  ...options
}: DropzoneComponentProps) {
  const t = useTranslations("Global.Component.Dropzone");
  const handleDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onAddFiles(acceptedFiles);
      }
      if (rejections.length > 0) {
        onReject(rejections);
      }
    },
    [onAddFiles, onReject],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    minSize,
    disabled: disabled || (maxFiles !== undefined && files.length >= maxFiles),
    ...options,
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        {...getRootProps()}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 4,
          borderRadius: 2,
          border: "2px dashed",
          borderColor: "divider",
          bgcolor: "background.paper",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease-in-out",
          outline: "none",
          ...(isFocused && {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          }),
          ...(isDragActive && {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          }),
          ...(isDragAccept && {
            borderColor: "success.main",
            bgcolor: "success.softBg",
          }),
          ...((isDragReject || error) && {
            borderColor: "error.main",
            bgcolor: "error.softBg",
          }),
          "@media (hover: hover)": {
            "&:hover": {
              borderColor: disabled ? "divider" : "primary.main",
              bgcolor: disabled ? "background.paper" : "action.hover",
            },
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadOutlinedIcon fontSize="large" />
        <Typography>{t("Title")}</Typography>
        <Typography variant="body2" color="text.disabled">
          {helperText}
          {helperText && <br />}
          {t("Subtitle", {
            text: acceptInText ?? t("AcceptInText"),
            size: formatFileSize(maxSize),
          })}
        </Typography>
      </Box>

      {files.length > 0 && (
        <List dense sx={{ mt: 1, width: "100%" }}>
          {files.map((item, index) => (
            <ListItem
              key={`${item.file.name}-${index}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onRemoveFile(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                bgcolor: "action.hover",
                border: item.errorStage !== undefined ? "1px solid" : "none",
                borderColor: (theme) =>
                  item.errorStage === undefined
                    ? "transparent"
                    : theme.palette.error.main,
                borderRadius: 1,
                mb: 0.5,
                "&:last-child": { mb: 0 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.preview ? (
                  <Box
                    component="img"
                    src={item.preview}
                    alt={item.file.name}
                    sx={{
                      objectFit: "cover",
                      width: 24,
                      height: 24,
                      borderRadius: 0.5,
                    }}
                  />
                ) : (
                  <InsertDriveFileOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: 500,
                      textWrap: "auto",
                      overflowWrap: "anywhere",
                    },
                  },
                  secondary: {
                    sx: { fontSize: "0.75rem" },
                  },
                }}
                primary={
                  item.stage === "done" && item.prepared?.fileId ? (
                    <DropzoneFileDownloadComponent
                      id={item.prepared.fileId}
                      text={item.file.name}
                    />
                  ) : (
                    item.file.name
                  )
                }
                secondary={formatFileSize(item.file.size)}
              />
              <Box
                ml={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {item.stage !== "uploading" ? (
                  <Typography
                    sx={{
                      textWrap: "auto",
                      width: "fit-content",
                      mx: 1,
                    }}
                    variant="caption"
                  >
                    <Chip
                      label={item.stage}
                      size="small"
                      color={getColorFromStatus(item.stage)}
                    />
                  </Typography>
                ) : (
                  <CircularProgressWithLabel value={item.progress} />
                )}
                {item.errorStage !== undefined && (
                  <IconButton size="small" onClick={() => handleRetry(item.id)}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {error && (
        <Typography color="error" variant="subtitle2">
          {error}
        </Typography>
      )}
    </Box>
  );
}
