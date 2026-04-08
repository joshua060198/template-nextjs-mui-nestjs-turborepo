"use client";

import { GlobalDialog } from "@web/components/GlobalDialog.component";
import { DialogContext } from "@web/libs/providers/global-dialog/dialog.context";
import { DialogOptions } from "@web/libs/providers/global-dialog/dialog.type";
import { ReactNode, useCallback, useRef, useState } from "react";

type Resolver = (value: boolean) => void;

export function DialogProvider({ children }: { children: ReactNode }) {
  const resolverRef = useRef<Resolver | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<
    DialogOptions & { onPositive?: () => void; onNegative?: () => void }
  >({});

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const confirm = useCallback((opts: DialogOptions) => {
    setOptions({
      ...opts,
      cancelText: opts.cancelText ? opts.cancelText : "Cancel",
    });
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const alert = useCallback(async (opts: Omit<DialogOptions, "cancelText">) => {
    setOptions({
      ...opts,
      cancelText: undefined,
      confirmText: opts.confirmText ?? "OK",
    });
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setLoading(true);
    let res = undefined;
    if (options.onPositive) res = options.onPositive();
    if (res !== undefined && res instanceof Promise) {
      res
        .then(() => {
          resolverRef.current?.(true);
          close();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      resolverRef.current?.(true);
      close();
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (options.onNegative) options.onNegative();
    resolverRef.current?.(false);
    close();
  };

  console.log(options);

  return (
    <DialogContext.Provider
      value={{ dialogConfirm: confirm, dialogAlert: alert }}
    >
      {children}

      <GlobalDialog
        loading={loading}
        open={open}
        {...options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  );
}
