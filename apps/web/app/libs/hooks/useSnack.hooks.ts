"use client";

import { OptionsWithExtraProps, useSnackbar, VariantType } from "notistack";

export function useSnack() {
  const { enqueueSnackbar } = useSnackbar();

  return {
    success: (message: string) =>
      enqueueSnackbar(message, { variant: "success" }),

    error: (message: string) => enqueueSnackbar(message, { variant: "error" }),

    warning: (message: string) =>
      enqueueSnackbar(message, { variant: "warning" }),

    info: (message: string) => enqueueSnackbar(message, { variant: "info" }),

    custom: (message: string, options: OptionsWithExtraProps<VariantType>) =>
      enqueueSnackbar(message, options),
  };
}
