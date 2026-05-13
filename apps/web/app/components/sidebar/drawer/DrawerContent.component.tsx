"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { MeResponseFrontend } from "@repo/common/auth.service.type";
import { LanguageSwitcher } from "@web/components/LanguageSwitcher.component";
import { DrawerItemConfig } from "@web/components/sidebar/drawer/drawer.config";
import DrawerItemComponent from "@web/components/sidebar/drawer/DrawerItem.component";
import SidebarLogoutComponent from "@web/components/sidebar/drawer/SidebarLogout.component";
import SidebarActionsComponent from "@web/components/sidebar/SidebarActions.component";
import SidebarAdminComponent from "@web/components/sidebar/SidebarAdmin.component";
import SidebarUserProfile from "@web/components/sidebar/SidebarUserProfile.component";
import SidebarVersionComponent from "@web/components/sidebar/SidebarVersion.component";
import { useAuth } from "@web/libs/hooks/api/auth.api.hooks";
import Image from "next/image";

export default function DrawerContentComponent({
  config,
  isAdmin,
}: {
  config: DrawerItemConfig[];
  isAdmin?: boolean;
}) {
  const { data: { permissions } = {} } = useAuth({
    select: (data: MeResponseFrontend) => ({
      permissions: data.permissions,
      resetPassword: data.resetPassword,
    }),
  });
  return (
    <>
      <Box>
        <Toolbar sx={{ flexDirection: "column" }}>
          <Image
            loading="eager"
            src="/logo.png"
            alt="logo"
            width={225}
            height={49}
          />
          {isAdmin && (
            <Typography fontWeight="bold" sx={{ my: 1 }}>
              ADMIN
            </Typography>
          )}
        </Toolbar>
        <Divider />
        <DrawerItemComponent
          userPermissions={permissions ?? []}
          config={config}
        />
      </Box>
      <Box mb={1}>
        <Divider />
        <LanguageSwitcher />
        <Divider />
        <Box
          sx={{
            padding: 1,
            display: "flex",
            alignItems: "center",
          }}
          width="100%"
        >
          <SidebarUserProfile />
        </Box>
        <Box
          pb={1}
          px={{ sm: 0 }}
          display="flex"
          justifyContent={{ xs: "space-evenly", sm: "space-evenly" }}
        >
          <SidebarActionsComponent />
        </Box>
        <Box
          pb={1}
          px={{ sm: 0 }}
          display="flex"
          justifyContent={{
            xs: "space-evenly",
            sm: "space-evenly",
          }}
        >
          <SidebarAdminComponent isAdminPage={isAdmin} />
        </Box>

        <SidebarLogoutComponent />
        <SidebarVersionComponent />
      </Box>
    </>
  );
}
