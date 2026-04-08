import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { drawerWidth } from "@web/libs/utils/constant";
import { ReactNode } from "react";

export default function MainContentContainerComponent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1.5,
        px: 1.5,
        width: { md: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar sx={{ display: { md: "none" } }} />
      {children}
    </Box>
  );
}
