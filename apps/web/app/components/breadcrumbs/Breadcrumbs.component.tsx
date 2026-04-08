"use client";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Breadcrumbs,
  IconButton,
  Link as MuiLink,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { LinkIcon } from "@web/components/IconCollection";
import Link from "@web/components/native/Link";
import { useSnack } from "@web/libs/hooks/useSnack.hooks";
import { useTranslations } from "next-intl";

type BreadcrumbItem = {
  label: string;
  href: string;
};

export default function BreadcrumbsComponent({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  const t = useTranslations("Global.Component.Breadcrumbs");
  const { success, error } = useSnack();
  const copyCurrentUrl = () =>
    navigator.clipboard
      .writeText(window.location.toString())
      .then(() => success(t("CopyUrl.Success")))
      .catch(() => error(t("CopyUrl.Error")));

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      <MuiLink
        component={Link}
        fontSize="0.85rem"
        href="/app"
        underline="hover"
      >
        Home
      </MuiLink>

      {items.map((item, index) =>
        index === items.length - 1 ? (
          <Box key={item.href + "-" + index}>
            <Typography
              component="span"
              key={item.href}
              color="text.primary"
              fontSize=".85rem"
            >
              {item.label}
            </Typography>
            <Tooltip title={t("CopyUrl.Title")}>
              <IconButton
                size="small"
                sx={{ ml: 0.5 }}
                onClick={copyCurrentUrl}
              >
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <MuiLink
            key={item.href}
            component={Link}
            href={item.href}
            underline="hover"
            fontSize="0.85rem"
          >
            {item.label}
          </MuiLink>
        ),
      )}
    </Breadcrumbs>
  );
}
