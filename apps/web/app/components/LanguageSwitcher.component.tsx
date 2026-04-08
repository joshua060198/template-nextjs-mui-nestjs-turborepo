"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { usePathname, useRouter } from "@web/i18n/navigation";
import { routing } from "@web/i18n/routing";
import { IDFlagIcon, UKFlagIcon } from "@web/components/IconCollection";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // this gives current query params
  const currLocale = useLocale() as "id" | "en";

  const t = useTranslations("Global.Sidebar.LocaleSwitcher");

  const switchLocale = (locale: string) => {
    const params = searchParams.toString();
    const url = params ? `${pathname}?${params}` : pathname;

    router.push(url, { locale });
  };

  return (
    <Box display="flex" justifyContent="space-evenly" py={1} width="100%">
      {routing.locales.map((locale) => (
        <Button
          size="small"
          variant={locale === currLocale ? "contained" : "outlined"}
          color="secondary"
          key={locale}
          onClick={() => switchLocale(locale)}
          sx={{ borderRadius: 3 }}
          endIcon={locale === "id" ? <IDFlagIcon /> : <UKFlagIcon />}
        >
          {t(locale)}
        </Button>
      ))}
    </Box>
  );
}
