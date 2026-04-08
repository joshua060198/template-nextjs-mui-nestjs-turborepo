"use client";
import { Button } from "@mui/material";
import { MeResponseFrontend } from "@repo/common/auth.service.type";
import { SchoolIcon } from "@web/components/IconCollection";
import { useRouter } from "@web/i18n/navigation";
import { useAuth } from "@web/libs/hooks/api/auth.api.hooks";
import { useTranslations } from "next-intl";

export default function SidebarAdminComponent({
  isAdminPage,
}: {
  isAdminPage?: boolean;
}) {
  const { data: { permissions: userPermission } = {} } = useAuth({
    select: (data: MeResponseFrontend) => ({
      permissions: data.permissions,
      resetPassword: data.resetPassword,
    }),
  });

  const router = useRouter();
  const t = useTranslations("Global.Sidebar");
  if (!isAdminPage) {
    if (userPermission?.includes("open:admin_page"))
      return (
        <>
          <Button
            color="warning"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: 20,
              "& .MuiButton-icon": { ml: 0.5 },
              mx: 1,
            }}
            endIcon={<SchoolIcon />}
            onClick={() => router.push("/admin")}
          >
            {t("Admin")}
          </Button>
        </>
      );
    else return null;
  }
  return (
    <Button
      color="warning"
      variant="outlined"
      size="small"
      fullWidth
      sx={{
        borderRadius: 20,
        "& .MuiButton-icon": { ml: 0.5 },
        mx: 1,
      }}
      onClick={() => router.push("/")}
    >
      {t("App")}
    </Button>
  );
}
