import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";

// plugins (add once, globally)
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

import "dayjs/plugin/duration.js";
import "dayjs/plugin/timezone.js";
import "dayjs/plugin/utc.js";
import "dayjs/plugin/localizedFormat.js";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export { dayjs };
export default dayjs;

export const DAYJS_LOCALE_MAP: Record<string, string> = {
  en: "en",
  id: "id",
  fr: "fr",
  de: "de",
  ja: "ja",
};

export function resolveDayjsLocale(locale: string) {
  return DAYJS_LOCALE_MAP[locale] ?? "en";
}

export const DATE_FORMATS = {
  default: "DD-MM-YYYY",
  defaultText: "DD MMMM YYYY",
  short: "L", // localized short (best for UI)
  long: "LL", // localized long
  withTime: "LL HH:mm",
  isoDate: "YYYY-MM-DD",
  isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
} as const;

export function formatDate(
  date: dayjs.ConfigType,
  format: keyof typeof DATE_FORMATS = "default",
) {
  return dayjs(date).format(DATE_FORMATS[format]);
}
