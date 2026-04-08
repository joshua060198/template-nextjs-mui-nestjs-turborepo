"use client";
import { IconButton } from "@mui/material";
import { CloseIcon } from "@web/components/IconCollection";
import { SnackbarProvider } from "notistack";
import { ReactNode, useRef } from "react";

export default function SnackProvider({ children }: { children: ReactNode }) {
  const notistackRef = useRef<SnackbarProvider>(null);

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      action={(key) => (
        <IconButton
          sx={{
            position: { sm: "absolute", md: "relative" },
            right: { sm: 2, md: 0 },
          }}
          size="small"
          color="inherit"
          onClick={() => notistackRef.current?.closeSnackbar(key)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
}
