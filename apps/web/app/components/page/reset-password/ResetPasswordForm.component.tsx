"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, IconButton } from "@mui/material";
import {
  ResetPasswordForm,
  ResetPasswordFormSchema,
} from "@repo/common/auth.service.type";
import {
  VisibilityIcon,
  VisibilityOffIcon,
} from "@web/components/IconCollection";
import {
  Form,
  FormControl,
  FormField,
  FormSubmit,
} from "@web/components/native/form/Form";
import TextField from "@web/components/native/form/TextField";
import { useChangePassword } from "@web/libs/hooks/api/auth.api.hooks";
import { useApplyApiValidationErrorToFormError } from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ResetPasswordFormComponent() {
  const { mutate, error: apiError, isPending } = useChangePassword();

  const t = useTranslations("Page.ResetPassword.Form");

  const { errorMapper, fn } =
    useApplyApiValidationErrorToFormError<ResetPasswordForm>();

  const formMethods = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordFormSchema, {
      error: errorMapper,
    }),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, setError } = formMethods;

  const submitHandler = useCallback(
    (data: ResetPasswordForm) => {
      mutate({ password: data.password });
    },
    [mutate],
  );

  useEffect(() => {
    fn(apiError, setError);
  }, [apiError, fn, setError]);

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const togglePassword = useCallback(
    () => setPasswordVisible((prev) => !prev),
    [],
  );

  return (
    <Box mt={2}>
      <Form<ResetPasswordForm>
        submitHandler={handleSubmit(submitHandler)}
        providers={formMethods}
      >
        <FormField>
          <FormControl<ResetPasswordForm>
            name="password"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Password.Label")}
                type={passwordVisible ? "text" : "password"}
                disabled={isPending}
                required
                errorMsg={error}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton onClick={togglePassword}>
                        {passwordVisible ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    ),
                    sx: { pr: 0 },
                  },
                }}
              />
            )}
          />
        </FormField>
        <FormField>
          <FormControl<ResetPasswordForm>
            name="confirmPassword"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("ConfirmPassword.Label")}
                type={passwordVisible ? "text" : "password"}
                disabled={isPending}
                required
                errorMsg={error}
              />
            )}
          />
        </FormField>
        <FormField>
          <FormSubmit
            color="primary"
            isLoading={isPending}
            sx={{ borderRadius: 5 }}
          >
            {t("ResetPasswordButton")}
          </FormSubmit>
        </FormField>
      </Form>
    </Box>
  );
}
