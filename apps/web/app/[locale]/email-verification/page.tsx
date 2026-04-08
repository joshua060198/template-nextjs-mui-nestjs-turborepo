"use client";
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBackwardIosIcon } from "@web/components/IconCollection";
import { LanguageSwitcher } from "@web/components/LanguageSwitcher.component";
import { useRouter } from "@web/i18n/navigation";
import { useVerifiedEmail } from "@web/libs/hooks/api/user.api.hooks";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerificationPage() {
  const { mutate, isError, error, isSuccess } = useVerifiedEmail();

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("t");

  const t = useTranslations("Page.EmailVerification");
  const tService = useTranslations("Service.User.EmailVerification");

  let content: React.ReactNode;

  if (!token) {
    content = (
      <>
        <Typography variant="h6">{tService("Error.20007")}</Typography>
      </>
    );
  } else if (isSuccess) {
    content = (
      <>
        <Typography sx={{ mt: 3 }} variant="h6">
          {tService("Verified")}
        </Typography>
      </>
    );
  } else if (isError) {
    content = (
      <>
        <Typography align="center" variant="h6">
          {error.error &&
          error.error.code &&
          (error.error.code.startsWith("000") ||
            error.error.code.startsWith("200"))
            ? tService(`Error.${error.error.code}`)
            : tService("Error.Other")}
        </Typography>
      </>
    );
  } else {
    content = (
      <>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 3 }} variant="h6">
          {t("Processing")}
        </Typography>
      </>
    );
  }

  const backHandler = () => {
    router.replace("/");
  };

  useEffect(() => {
    if (!token) return;
    mutate(token);
  }, [token, mutate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3}>
        <Box
          p={5}
          pb={3}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          height="200px"
        >
          {content}
        </Box>
        <Box
          p={1}
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Button
            sx={{ borderRadius: 3, ml: 1 }}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ArrowBackwardIosIcon />}
            onClick={backHandler}
          >
            Go back to app
          </Button>
          <Box width="220px">
            <LanguageSwitcher />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
