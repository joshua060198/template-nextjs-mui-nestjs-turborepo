"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, IconButton } from "@mui/material";
import { Login, LoginSchema } from "@repo/common/auth.service.type";
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
import { useLogin } from "@web/libs/hooks/api/auth.api.hooks";
import { useApplyApiValidationErrorToFormError } from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  // API HOOKS
  const { mutate, error: apiError, isPending } = useLogin();

  // NEXT-INTL
  const t = useTranslations("Page.Login.Form");

  // ZOD VALIDATION
  const { errorMapper, fn } = useApplyApiValidationErrorToFormError<Login>();

  const formMethods = useForm<Login>({
    resolver: zodResolver(LoginSchema, {
      error: errorMapper,
    }),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = formMethods;

  // COMPONENT STATE
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const togglePassword = useCallback(
    () => setPasswordVisible((prev) => !prev),
    [],
  );
  const submitHandler = useCallback(
    (data: Login) => {
      mutate(data);
    },
    [mutate],
  );

  useEffect(() => {
    fn(apiError, setError);
  }, [apiError, fn, setError]);

  return (
    <Box mt={2}>
      <Form<Login>
        submitHandler={handleSubmit(submitHandler)}
        providers={formMethods}
      >
        <FormField>
          <FormControl<Login>
            name="username"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Username.Label")}
                type="text"
                required
                disabled={isPending}
                errorMsg={error}
              />
            )}
          />
        </FormField>
        <FormField>
          <FormControl<Login>
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
          <FormSubmit
            color="primary"
            isLoading={isPending}
            sx={{ borderRadius: 5 }}
          >
            {t("LoginButton")}
          </FormSubmit>
        </FormField>
        {/*<FormField slotProps={{ container: { textAlign: "center" } }}>*/}
        {/*  <Link href="/forgot-password">{t("ForgotPassword")}</Link>*/}
        {/*</FormField>*/}
      </Form>
    </Box>
  );
}
