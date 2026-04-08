import { SaveIcon } from "@web/components/IconCollection";
import { FormField, FormSubmit } from "@web/components/native/form/Form";
import { useTranslations } from "next-intl";

export interface FormButtonsProps {
  isLoading: boolean;
  closeModal: () => void;
}

export default function TableFormActions({
  isLoading,
  closeModal,
}: FormButtonsProps) {
  const t = useTranslations("Global.Component.Table.FormActions");
  return (
    <FormField
      slotProps={{
        container: {
          sx: {
            display: "flex",
            justifyContent: "end",
            columnGap: 2,
          },
        },
      }}
    >
      <FormSubmit
        type="button"
        color="error"
        fullWidth={false}
        onClick={closeModal}
        disabled={isLoading}
        sx={{ borderRadius: 2 }}
      >
        {t("Cancel")}
      </FormSubmit>
      <FormSubmit
        color="success"
        startIcon={<SaveIcon />}
        isLoading={isLoading}
        fullWidth={false}
        sx={{ borderRadius: 2 }}
      >
        {t("Submit")}
      </FormSubmit>
    </FormField>
  );
}
