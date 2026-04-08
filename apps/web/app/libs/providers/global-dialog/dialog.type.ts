import { ReactNode } from "react";

export type DialogAction = {
  label: string;
  color?: "primary" | "error" | "inherit";
};

export type DialogOptions = {
  title?: string;
  message?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onPositive?: () => void | Promise<void>;
  onNegative?: () => void;
};
