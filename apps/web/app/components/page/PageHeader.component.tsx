"use client";

import { Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import BreadcrumbsWrapper from "@web/components/breadcrumbs/BreadcrumbsWrapper.component";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface PageHeaderComponentProps {
  page?: string;
  headerAction?: ReactNode;
  title?: string;
}

export default function PageHeaderComponent({
  page,
  title,
  headerAction,
}: PageHeaderComponentProps) {
  const t = useTranslations(`Page.${page}`);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      component={Paper}
      elevation={0}
      sx={{
        mt: { xs: 2, md: 0 },
        px: 2,
        py: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box>
        <BreadcrumbsWrapper />
        <Typography variant="h5">
          {page ? t("Title") : title ? title : "Untitled"}
        </Typography>
      </Box>
      <Box>{headerAction}</Box>
    </Box>
  );
}
