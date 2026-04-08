"use client";

import { DialogOptions } from "@web/libs/providers/global-dialog/dialog.type";
import { createContext, useContext } from "react";

export type DialogContextValue = {
  dialogConfirm: (options: DialogOptions) => Promise<boolean>;
  dialogAlert: (options: Omit<DialogOptions, "cancelText">) => Promise<boolean>;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return ctx;
};
