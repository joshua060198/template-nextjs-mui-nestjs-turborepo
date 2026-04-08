"use client";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { LogoutIcon } from "@web/components/IconCollection";
import { useLogout } from "@web/libs/hooks/api/auth.api.hooks";
import { useTranslations } from "next-intl";

export default function SidebarLogoutComponent() {
  const t = useTranslations("Global.Sidebar");
  const { mutate: Logout } = useLogout();

  return (
    <Box px={1} py={0.5}>
      <Button
        variant="outlined"
        color="error"
        fullWidth
        size="small"
        sx={{ borderRadius: 2 }}
        onClick={() => Logout()}
        endIcon={<LogoutIcon />}
      >
        {t("Logout")}
      </Button>
    </Box>
  );
}
