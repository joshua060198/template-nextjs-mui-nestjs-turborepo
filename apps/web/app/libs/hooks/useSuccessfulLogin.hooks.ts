"use client";

import { useRouter } from "@web/i18n/navigation";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export function useSuccessfulLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useLocale();
  return () => {
    const redirect = searchParams.get("redirect");
    const target = redirect && redirect.startsWith("/") ? redirect : "/app";
    router.replace(target);
  };
}
