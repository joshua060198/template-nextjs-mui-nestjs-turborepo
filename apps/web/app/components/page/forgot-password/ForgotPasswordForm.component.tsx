"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from "@repo/common/auth.service.type";
import {
  Form,
  FormControl,
  FormField,
  FormSubmit,
} from "@web/components/native/form/Form";
import TextField from "@web/components/native/form/TextField";
import { useForgotPassword } from "@web/libs/hooks/api/auth.api.hooks";
import { useApplyApiValidationErrorToFormError } from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordFormComponent() {
  const { mutate, error: apiError, isPending } = useForgotPassword();

  const t = useTranslations("Page.ForgotPassword.Form");

  const { errorMapper, fn } =
    useApplyApiValidationErrorToFormError<ForgotPassword>();

  const formMethods = useForm<ForgotPassword>({
    resolver: zodResolver(ForgotPasswordSchema, {
      error: errorMapper,
    }),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, setError } = formMethods;

  const submitHandler = useCallback(
    (data: ForgotPassword) => {
      mutate(data.email);
    },
    [mutate],
  );

  useEffect(() => {
    fn(apiError, setError);
  }, [apiError, fn, setError]);

  return (
    <Box mt={2}>
      <Form<ForgotPassword>
        submitHandler={handleSubmit(submitHandler)}
        providers={formMethods}
      >
        <FormField>
          <FormControl<ForgotPassword>
            name="email"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Email.Label")}
                type="email"
                required
                disabled={isPending}
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
            {t("ForgotPasswordButton")}
          </FormSubmit>
        </FormField>
      </Form>
    </Box>
  );
}
