import { Typography } from "@mui/material";
import pkg from "@web/../package.json";

export default function SidebarVersionComponent() {
  return (
    <Typography
      component="p"
      variant="caption"
      align="center"
      sx={{ width: "100%", mb: -1 }}
    >
      v{pkg.version}-{process.env.NODE_ENV === "development" ? "dev" : "prod"}
    </Typography>
  );
}
