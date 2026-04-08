import { zodResolver } from "@hookform/resolvers/zod";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Box } from "@mui/material";
import {
  FrontendPermission,
  PermissionId,
} from "@repo/common/entity/permission.entity.type";
import {
  CreateRole,
  CreateRoleSchema,
  FrontendRole,
} from "@repo/common/entity/role.entity.type";
import AutoComplete from "@web/components/native/form/Autocomplete";
import { Checkbox } from "@web/components/native/form/Checkbox";
import {
  createFormControl,
  Form,
  FormField,
} from "@web/components/native/form/Form";
import TextField from "@web/components/native/form/TextField";
import { AddFormProps } from "@web/components/native/table/TableAdd";
import { EditFormProps } from "@web/components/native/table/TableEdit";
import TableFormActions from "@web/components/native/table/TableFormActions";
import {
  useCreateRole,
  usePermissionQuery,
  useUpdateRole,
} from "@web/libs/hooks/api/auth.api.hooks";

import { useApplyApiValidationErrorToFormError } from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormControl = createFormControl<CreateRole>();

export default function AddEditRoleForm(
  props: AddFormProps | EditFormProps<FrontendRole>,
) {
  const currItem = "editedItem" in props ? props.editedItem : undefined;

  const {
    mutateAsync: addRole,
    isPending: loadingAdd,
    error: errorAdd,
  } = useCreateRole();
  const {
    mutateAsync: editRole,
    isPending: loadingEdit,
    error: errorEdit,
  } = useUpdateRole();

  const { data: { data: permissionList = [] } = {} } = usePermissionQuery();

  const t = useTranslations("Page.Admin.RBAC.Role.Form");

  const { fn, errorMapper } =
    useApplyApiValidationErrorToFormError<CreateRole>();

  const form = useForm<z.input<typeof CreateRoleSchema>, undefined, CreateRole>(
    {
      resolver: zodResolver(CreateRoleSchema, { error: errorMapper }),
      defaultValues: {
        name: currItem?.name ?? "",
        description: currItem?.description ?? "",
        permissions:
          currItem?.permissions.map((p: FrontendPermission) => p.id) ?? [],
        displayName: currItem?.displayName ?? "",
        isSystem: currItem?.isSystem !== undefined ? currItem.isSystem : false,
      },
    },
  );

  const { setError, handleSubmit, setValue } = form;

  const submitHandler = useCallback(
    (data: CreateRole) => {
      if (currItem) {
        editRole({ ...data, roleId: currItem.id }).then(props.closeModal);
      } else {
        addRole(data).then(props.closeModal);
      }
    },
    [addRole, editRole, currItem, props.closeModal],
  );

  useEffect(() => {
    if (errorAdd) fn(errorAdd, setError);
    if (errorEdit) fn(errorEdit, setError);
  }, [errorAdd, errorEdit, fn, setError]);

  return (
    <Box>
      <Form<z.input<typeof CreateRoleSchema>>
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
            name="name"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Name.Label")}
                type="text"
                required
                disabled={loadingAdd || loadingEdit}
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
            name="displayName"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("DisplayName.Label")}
                type="text"
                required
                disabled={loadingAdd || loadingEdit}
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
            name="permissions"
            render={({ field, error }) => (
              <AutoComplete
                options={permissionList}
                textFieldProps={{
                  label: t("Permissions.Label"),
                }}
                getOptionLabel={(option) => option.displayName}
                limitTags={5}
                value={permissionList.filter((permission) =>
                  (field.value as PermissionId[]).includes(permission.id),
                )}
                multiple
                onChange={(e, value) => {
                  setValue(
                    "permissions",
                    value.map((v) => v.id),
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  );
                }}
                errorMsg={error}
                disabled={loadingAdd || loadingEdit}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  const SelectionIcon = selected
                    ? CheckBoxIcon
                    : CheckBoxOutlineBlankIcon;

                  return (
                    <li key={key} {...optionProps}>
                      <SelectionIcon
                        fontSize="small"
                        style={{
                          marginRight: 8,
                          padding: 9,
                          boxSizing: "content-box",
                        }}
                      />
                      {option.displayName}
                    </li>
                  );
                }}
                disableCloseOnSelect
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
            name="description"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Description.Label")}
                type="text"
                multiline
                maxRows={4}
                minRows={1}
                disabled={loadingAdd || loadingEdit}
                errorMsg={error}
              />
            )}
          />
        </FormField>

        {currItem === undefined && (
          <FormField
            slotProps={{
              container: {
                size: { xs: 12, md: 6 },
              },
            }}
          >
            <FormControl
              name="isSystem"
              render={({ field, error }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  label={t("System.Label")}
                  disabled={loadingAdd || loadingEdit}
                  onChange={(e, checked) =>
                    setValue("isSystem", checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              )}
            />
          </FormField>
        )}

        <TableFormActions
          isLoading={loadingAdd || loadingEdit}
          closeModal={props.closeModal}
        />
      </Form>
    </Box>
  );
}
