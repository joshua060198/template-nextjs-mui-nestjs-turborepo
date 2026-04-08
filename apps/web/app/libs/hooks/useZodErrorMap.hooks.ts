import { useTranslations } from "next-intl";
import { $ZodIssue, $ZodRawIssue } from "zod/v4/core";

export function useZodErrorMap() {
  const t = useTranslations("Zod");

  return (issue: $ZodRawIssue | $ZodIssue) => {
    switch (issue.code) {
      case "too_small":
        if (issue.minimum === 1) return t("Required");
        return t("MinLength", { min: issue.minimum.toString() });
      case "too_big":
        return t("MaxLength", { max: issue.maximum.toString() });
      case "invalid_format":
        if (issue.format === "email") {
          return t("InvalidEmail");
        } else if (issue.format === "date") {
          return t("Date.InvalidDate");
        }
        return "";
      case "custom": {
        switch (issue.params?.customCode) {
          case "invalid_phone_number":
            return t("InvalidPhoneNumber");
          case "invalid_date_string":
            return t("Date.InvalidDate");
          case "disable_future":
            return t("Date.DisableFuture");
          case "min_date": {
            const date = issue.params!.minDate as string;
            return t("Date.MinDate", { minDate: date });
          }
          case "max_date": {
            const date = issue.params!.maxDate as string;
            return t("Date.MaxDate", { maxDate: date });
          }
          case "disable_past":
            return t("Date.DisablePast");
          case "fields_not_match":
            return t(issue.params!.translationKey);
          default:
            return "";
        }
      }
      case "invalid_type":
        return t("InvalidType");
      default:
        return undefined;
    }
  };
}
