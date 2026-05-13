import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import {
  CreatePermission,
  CreatePermissionSchema,
  FrontendPermission,
} from "@repo/common/entity/permission.entity.type";
import AutoComplete from "@web/components/native/form/Autocomplete";
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
  useCreatePermission,
  usePermissionActions,
  usePermissionResources,
  useUpdatePermission,
} from "@web/libs/hooks/api/auth.api.hooks";

import { useApplyApiValidationErrorToFormError } from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormControl = createFormControl<CreatePermission>();

export default function AddEditPermissionForm(
  props: AddFormProps | EditFormProps<FrontendPermission>,
) {
  const currItem = "editedItem" in props ? props.editedItem : undefined;

  const {
    mutateAsync: addPermission,
    isPending: loadingAdd,
    error: errorAdd,
  } = useCreatePermission();
  const {
    mutateAsync: editPermission,
    isPending: loadingEdit,
    error: errorEdit,
  } = useUpdatePermission();

  const { data: resourcesList = [] } = usePermissionResources();
  const { data: actionsList = [] } = usePermissionActions();

  const t = useTranslations("Page.Admin.RBAC.Permission.Form");

  const { fn, errorMapper } =
    useApplyApiValidationErrorToFormError<CreatePermission>();

  const form = useForm<
    z.input<typeof CreatePermissionSchema>,
    undefined,
    CreatePermission
  >({
    resolver: zodResolver(CreatePermissionSchema, { error: errorMapper }),
    defaultValues: {
      description: currItem?.description ?? "",
      action: currItem?.action ?? "",
      resource: currItem?.resource ?? "",
      displayName: currItem?.displayName ?? "",
    },
  });

  const { setError, handleSubmit, setValue } = form;

  const submitHandler = useCallback(
    (data: CreatePermission) => {
      if (currItem) {
        editPermission({ ...data, id: currItem.id }).then(props.closeModal);
      } else {
        addPermission(data).then(props.closeModal);
      }
    },
    [addPermission, editPermission, currItem, props.closeModal],
  );

  useEffect(() => {
    if (errorAdd) fn(errorAdd, setError);
    if (errorEdit) fn(errorEdit, setError);
  }, [errorAdd, errorEdit, fn, setError]);

  return (
    <Box>
      <Form<z.input<typeof CreatePermissionSchema>>
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

        <FormField
          slotProps={{
            container: {
              size: { xs: 12, md: 6 },
            },
          }}
        >
          <FormControl
            name="action"
            render={({ field, error }) => (
              <AutoComplete
                {...field}
                options={actionsList}
                freeSolo
                textFieldProps={{
                  label: t("Action.Label"),
                  required: true,
                }}
                disabled={loadingAdd || loadingEdit || currItem}
                errorMsg={error}
                onInputChange={(e, value) => {
                  setValue("action", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onChange={(e, value) => {
                  setValue("action", value ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
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
            name="resource"
            render={({ field, error }) => (
              <AutoComplete
                {...field}
                options={resourcesList}
                freeSolo
                textFieldProps={{
                  label: t("Resource.Label"),
                  required: true,
                }}
                disabled={loadingAdd || loadingEdit || currItem}
                errorMsg={error}
                onInputChange={(e, value) => {
                  setValue("resource", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onChange={(e, value) => {
                  setValue("resource", value ?? "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />
        </FormField>

        <TableFormActions
          isLoading={loadingAdd || loadingEdit}
          closeModal={props.closeModal}
        />
      </Form>
    </Box>
  );
}
