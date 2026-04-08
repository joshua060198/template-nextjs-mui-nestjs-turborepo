"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ReactNode } from "react";

type Props = {
  loading?: boolean;
  open: boolean;
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GlobalDialog({
  loading,
  open,
  title,
  message,
  content,
  confirmText = "Confirm",
  cancelText,
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!loading) onCancel();
      }}
      maxWidth="xs"
      fullWidth
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent>
        {message && <DialogContentText>{message}</DialogContentText>}
        {content}
      </DialogContent>

      <DialogActions>
        {cancelText && (
          <Button loading={loading} onClick={onCancel}>
            {cancelText}
          </Button>
        )}

        <Button
          loading={loading}
          onClick={onConfirm}
          color={destructive ? "error" : "primary"}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
