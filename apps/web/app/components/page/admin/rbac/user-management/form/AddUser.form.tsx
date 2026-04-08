import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import {
  RegisterUser,
  RegisterUserSchema,
} from "@repo/common/auth.service.type";
import AutoComplete from "@web/components/native/form/Autocomplete";
import {
  createFormControl,
  Form,
  FormField,
} from "@web/components/native/form/Form";
import TextField from "@web/components/native/form/TextField";
import { AddFormProps } from "@web/components/native/table/TableAdd";
import TableFormActions from "@web/components/native/table/TableFormActions";
import {
  useRegisterUser,
  useRoleQuery,
} from "@web/libs/hooks/api/auth.api.hooks";
import { useDialog } from "@web/libs/hooks/useDialog.hooks";
import { useApplyApiValidationErrorToFormError } from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormControl = createFormControl<RegisterUser>();

export default function AddUserForm(props: AddFormProps) {
  const {
    mutateAsync: addUser,
    isPending: loadingAdd,
    error: errorAdd,
  } = useRegisterUser();

  const { dialogAlert } = useDialog();
  const t = useTranslations("Page.Admin.RBAC.UserManagement.Form");

  const { fn, errorMapper } =
    useApplyApiValidationErrorToFormError<RegisterUser>();

  const form = useForm<
    z.input<typeof RegisterUserSchema>,
    undefined,
    RegisterUser
  >({
    resolver: zodResolver(RegisterUserSchema, { error: errorMapper }),
    defaultValues: {
      password: undefined,
      fullName: "",
      roleId: undefined,
      username: "",
      email: null,
    },
  });

  const { setError, handleSubmit, setValue } = form;

  const submitHandler = useCallback(
    (data: RegisterUser) => {
      addUser(data).then((data) =>
        dialogAlert({
          title: t("Password.DialogTitle"),
          content: t("Password.DialogContent", { password: data }),
          onPositive: props.closeModal,
        }),
      );
    },
    [addUser, t, dialogAlert, props.closeModal],
  );

  useEffect(() => {
    if (errorAdd) fn(errorAdd, setError);
  }, [errorAdd, fn, setError]);

  const { data: { data: roles } = {}, isPending } = useRoleQuery();

  return (
    <Box>
      <Form<z.input<typeof RegisterUserSchema>>
        submitHandler={handleSubmit(submitHandler)}
        providers={form}
      >
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, md: 6 },
            },
          }}
        >
          <FormControl
            name="username"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Username.Label")}
                type="text"
                required
                disabled={loadingAdd}
                errorMsg={error}
              />
            )}
          />
        </FormField>

        <FormField
          slotProps={{
            container: {
              size: { xs: 12, md: 6 },
            },
          }}
        >
          <FormControl
            name="fullName"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Fullname.Label")}
                type="text"
                required
                disabled={loadingAdd}
                errorMsg={error}
              />
            )}
          />
        </FormField>

        <FormField
          slotProps={{
            container: {
              size: { xs: 12, md: 6 },
            },
          }}
        >
          <FormControl
            name="email"
            render={({ field, error }) => (
              <TextField
                {...field}
                value={field.value ? field.value : ""}
                onChange={(e) => {
                  const finalValue = e.target.value ? e.target.value : null;
                  setValue("email", finalValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                label={t("Email.Label")}
                type="email"
                disabled={loadingAdd}
                errorMsg={error}
              />
            )}
          />
        </FormField>

        <FormField
          slotProps={{
            container: {
              size: { xs: 12, md: 6 },
            },
          }}
        >
          <FormControl
            name="roleId"
            render={({ field, error }) => (
              <AutoComplete
                {...field}
                textFieldProps={{
                  label: t("Role.Label"),
                  required: true,
                }}
                value={roles?.find((o) => o.id === field.value) ?? null}
                onChange={(e, value) => field.onChange(value?.id ?? null)}
                errorMsg={error}
                options={roles ?? []}
                getOptionLabel={(option) => option.displayName}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                disabled={isPending}
              />
            )}
          />
        </FormField>

        <TableFormActions
          isLoading={loadingAdd}
          closeModal={props.closeModal}
        />
      </Form>
    </Box>
  );
}
