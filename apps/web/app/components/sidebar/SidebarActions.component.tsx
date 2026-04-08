"use client";
import { Button } from "@mui/material";
import { useRouter } from "@web/i18n/navigation";
import {
  NotificationsNoneIcon,
  SettingsIcon,
} from "@web/components/IconCollection";
import { useTranslations } from "next-intl";

export default function SidebarActionsComponent() {
  const router = useRouter();
  const t = useTranslations("Global.Sidebar");
  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        size="small"
        sx={{ borderRadius: 20, "& .MuiButton-icon": { ml: 0.5 } }}
        endIcon={<NotificationsNoneIcon />}
        onClick={() => console.log("IMPLEMENTED LATER --> NOTIFICATIONS")}
      >
        {t("Notifications")}
      </Button>
      <Button
        color="primary"
        variant="outlined"
        size="small"
        sx={{ borderRadius: 20, "& .MuiButton-icon": { ml: 0.5 } }}
        endIcon={<SettingsIcon />}
        onClick={() => router.push("/app/settings")}
      >
        {t("Settings")}
      </Button>
    </>
  );
}
