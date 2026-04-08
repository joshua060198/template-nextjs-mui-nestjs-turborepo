"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { dayjs, resolveDayjsLocale } from "@repo/common/util/dayjs";
import { useLocale } from "next-intl";
import { ReactNode, useEffect } from "react";

export const DATE_FORMATS = {
  en: "DD/MM/YYYY",
  id: "DD/MM/YYYY",
  fr: "DD/MM/YYYY",
  de: "DD.MM.YYYY",
  ja: "YYYY/MM/DD",
} as const;

export type SupportedLocale = keyof typeof DATE_FORMATS;

export function getDateFormat(locale: string) {
  return DATE_FORMATS[locale as SupportedLocale] ?? "YYYY-MM-DD";
}

const localeMap: Record<string, () => Promise<unknown>> = {
  en: () => import("dayjs/locale/en"),
  id: () => import("dayjs/locale/id"),
  fr: () => import("dayjs/locale/fr"),
  de: () => import("dayjs/locale/de"),
  ja: () => import("dayjs/locale/ja"),
};

export default function DateProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    const resolved = resolveDayjsLocale(locale);
    const loadLocale = localeMap[resolved];
    if (loadLocale) {
      loadLocale().then(() => {
        dayjs.locale(locale);
      });
    } else {
      dayjs.locale("en");
    }
  }, [locale]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={resolveDayjsLocale(locale)}
      dateFormats={{
        keyboardDate: getDateFormat(locale),
      }}
    >
      {children}
    </LocalizationProvider>
  );
}
