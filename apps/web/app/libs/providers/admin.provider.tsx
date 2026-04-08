"use client";
import { Button, Container, Typography } from "@mui/material";
import { PermissionAction } from "@repo/common/entity/permission.entity.type";
import GlobalLoadingComponent from "@web/components/GlobalLoading.component";
import { ArrowBackwardIosIcon } from "@web/components/IconCollection";
import { useAuth, useLogout } from "@web/libs/hooks/api/auth.api.hooks";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

export default function AdminProvider({ children }: { children: ReactNode }) {
  const hasLoggedOut = useRef(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useAuth({ enabled: !hasLoggedOut.current });

  const t = useTranslations("Global.Unauthorized.Admin");
  const { mutate: logout } = useLogout();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if ((isError || (!isLoading && !user)) && !hasLoggedOut.current) {
      hasLoggedOut.current = true;
      logout();
    }
  }, [isLoading, user, pathname, router, isError, logout]);

  if (isLoading) {
    return <GlobalLoadingComponent />;
  }

  if (!user) {
    return null;
  }

  if (user.permissions.find((i) => i.includes(PermissionAction.MANAGE))) {
    return <>{children}</>;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 5,
        p: 3,
      }}
    >
      <Image src="/403.png" alt="403" width={225} height={300} />
      <Typography variant="h4">Hi, {user.fullName}!</Typography>
      <Typography sx={{ mt: 2 }} align="center" variant="h5">
        {t("Title")}
      </Typography>
      <Button
        variant="outlined"
        href="/app"
        sx={{ mt: 2, textTransform: "uppercase" }}
        startIcon={<ArrowBackwardIosIcon />}
      >
        {t("Button")}
      </Button>
    </Container>
  );
}
