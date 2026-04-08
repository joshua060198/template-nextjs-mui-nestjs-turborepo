import { Box, Paper, Typography } from "@mui/material";
import { LanguageSwitcher } from "@web/components/LanguageSwitcher.component";
import ResetPasswordFormComponent from "@web/components/page/reset-password/ResetPasswordForm.component";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ResetPasswordPage() {
  const t = useTranslations("Page.ResetPassword");
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: { xs: "85vw", md: "50vw", xl: "30vw" },
        }}
      >
        <Image
          loading="eager"
          src="/logo.png"
          alt="logo"
          width={225}
          height={49}
        />
        <Typography variant="h6" align="center" sx={{ mt: 1 }}>
          {t("Title")}
        </Typography>
        <ResetPasswordFormComponent />
        <Box justifyContent="space-evenly" minWidth="250px" display="flex">
          <LanguageSwitcher />
        </Box>
      </Paper>
    </Box>
  );
}
