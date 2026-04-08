import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
  DateValidationError,
} from "@mui/x-date-pickers";
import { dayjs, formatDate } from "@repo/common/util/dayjs";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type DatePickerProps = MuiDatePickerProps & {
  errorMsg?: string;
};

export default function DatePicker({
  errorMsg,
  minDate = dayjs("1990-01-01"),
  maxDate,
  ...props
}: DatePickerProps) {
  const [errorReason, setErrorReason] = useState<DateValidationError | null>(
    null,
  );
  const [hasInteracted, setHasInteracted] = useState(false);

  const t = useTranslations("Global.Component.DatePicker");

  const errorMessage = useMemo(() => {
    if (!errorReason) return "";
    switch (errorReason) {
      case "invalidDate":
        return t("InvalidDate");
      case "minDate":
        return t("MinDate", { minDate: formatDate(minDate) });
      case "maxDate":
        return t("MaxDate", { maxDate: formatDate(maxDate) });
      case "disableFuture":
        return t("DisableFuture");
      case "disablePast":
        return t("DisablePast");
      default:
        return "";
    }
  }, [errorReason, t, minDate, maxDate]);

  return (
    <MuiDatePicker
      {...props}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(value, context) => {
        if (value === null) {
          setErrorReason(null);
          props.onChange?.(value, context);
          return;
        }
        setErrorReason(context.validationError);
        props.onChange?.(value, context);
      }}
      onAccept={() => setHasInteracted(true)}
      slotProps={{
        ...props.slotProps,
        textField: (ownerState) => {
          const existingTextFieldProps =
            typeof props.slotProps?.textField === "function"
              ? props.slotProps.textField(ownerState)
              : props.slotProps?.textField;

          const shouldShowError = hasInteracted && errorReason !== null;

          return {
            ...existingTextFieldProps,
            helperText:
              errorMsg ?? errorMessage ?? existingTextFieldProps?.helperText,

            error: Boolean(
              Boolean(errorMsg) ||
              shouldShowError ||
              existingTextFieldProps?.error,
            ),
            fullWidth: true,
            onBlur: () => setHasInteracted(true),
          };
        },
        field: {
          ...props.slotProps?.field,
          clearable: true,
          onClear: () => {
            setErrorReason(null);
            setHasInteracted(false);
          },
        },
      }}
    />
  );
}
