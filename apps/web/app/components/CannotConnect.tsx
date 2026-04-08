import { Container, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";

export default function CannotConnect() {
  const t = useTranslations("Global.CantConnect");
  return (
    <Container maxWidth="xs">
      <Box mx="auto" mt={5} component={Paper} p={3}>
        <Typography align="center" variant="h6">
          {t("Text")}
        </Typography>
      </Box>
    </Container>
  );
}
