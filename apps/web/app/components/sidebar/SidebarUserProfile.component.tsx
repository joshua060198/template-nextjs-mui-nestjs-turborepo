"use client";
import { Avatar, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useAuth } from "@web/libs/hooks/api/auth.api.hooks";
import { useTranslations } from "next-intl";

export default function SidebarUserProfile() {
  const { data } = useAuth();
  const t = useTranslations("Global.UserType");

  if (!data) {
    return null;
  }

  return (
    <>
      <Avatar src={data.imageUrl}>
        {data.fullName
          .split(" ")
          .map((v) => v.charAt(0))
          .join("")}
      </Avatar>
      <Box
        ml={1}
        display="flex"
        flexDirection="column"
        sx={{
          maxWidth: {
            xs: "calc(100% - 40px)",
            md: "calc(100% - 48px)",
          },
          flex: 1,
        }}
      >
        <Tooltip title={data.fullName}>
          <Typography
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
            display="inline-block"
            variant="subtitle1"
            fontWeight="bold"
          >
            {data.fullName}
          </Typography>
        </Tooltip>
        <Typography variant="subtitle2" fontSize="small">
          {data.role.displayName}
        </Typography>
      </Box>
    </>
  );
}
