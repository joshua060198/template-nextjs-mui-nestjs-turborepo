import {
  emailVerification,
  updateProfile,
  verifiedEmail,
} from "@web/libs/api/services/user.service.api";
import use401ErrorHandler from "@web/libs/hooks/api/with401ErrorHandler";
import { useSnack } from "@web/libs/hooks/useSnack.hooks";
import { ResponseFailed } from "@repo/common/common.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function useUpdateProfile() {
  const t = useTranslations("Service.User.UpdateProfile");
  const snack = useSnack();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfile,
    onSuccess: () => {
      snack.success(t("Success"));
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: use401ErrorHandler((error: ResponseFailed) => {
      if ("details" in error.error) {
        snack.error(t("Errors.FieldError"));
      } else {
        snack.error(t(`Errors.${error.error.code}`));
      }
    }),
  });
}

export function useEmailVerification() {
  const { success, error } = useSnack();
  const t = useTranslations("Service.User.EmailVerification");
  return useMutation({
    mutationKey: ["email-verificaiton"],
    mutationFn: emailVerification,
    onSuccess: () => {
      success(t("Success"));
    },
    onError: use401ErrorHandler((err) => {
      if (err.error.code === "20006") error(t("Error.20006"));
      else error(t("Error.Other"));
    }),
  });
}

export function useVerifiedEmail() {
  return useMutation<void, ResponseFailed, string>({
    mutationKey: ["verified-email"],
    mutationFn: verifiedEmail,
  });
}
