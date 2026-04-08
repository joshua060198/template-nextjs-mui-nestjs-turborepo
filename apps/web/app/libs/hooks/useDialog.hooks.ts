"use client";

import { useDialogContext } from "@web/libs/providers/global-dialog/dialog.context";

export const useDialog = () => {
  return useDialogContext();
};
