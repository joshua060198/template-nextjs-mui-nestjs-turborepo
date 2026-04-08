import { FailedResponse } from "@repo/common/common.type";
import { useQueryClient } from "@tanstack/react-query";
import { useSnack } from "@web/libs/hooks/useSnack.hooks";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";

export default function use401ErrorHandler(
  fn?: (error: FailedResponse) => void,
  {
    bypassError,
  }: {
    bypassError: Array<
      "00001" | "00002" | "00003" | "00004" | "00005" | "00006"
    >;
  } = { bypassError: [] },
) {
  const t = useTranslations("Service.Common.Errors");
  const queryClient = useQueryClient();
  const { error } = useSnack();
  return (err: FailedResponse) => {
    if (isAxiosError(err)) {
      if (err.status && err.status === 401) {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    } else {
      const castedErr = err as FailedResponse;

      if (
        castedErr.error.code === "00002" ||
        castedErr.error.code === "00003" ||
        castedErr.error.code === "00004" ||
        castedErr.error.code === "00005"
      ) {
        if (
          bypassError.indexOf(
            castedErr.error.code as
              | "00001"
              | "00002"
              | "00003"
              | "00004"
              | "00005"
              | "00006",
          ) === -1
        ) {
          error(t(castedErr.error.code));
        }
      } else {
        if (fn) {
          fn(err as FailedResponse);
        }
      }
    }
  };
}
