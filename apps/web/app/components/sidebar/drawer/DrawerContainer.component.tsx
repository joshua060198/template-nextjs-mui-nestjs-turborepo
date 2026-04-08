"use client";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { drawerWidth } from "@web/libs/utils/constant";
import { ReactNode } from "react";

type SidebarDrawerComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  onTransitionEnd: () => void;
  children: ReactNode;
};

export default function DrawerContainerComponent({
  isOpen,
  onClose,
  onTransitionEnd,
  children,
}: SidebarDrawerComponentProps) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth + 32 }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={isOpen}
        onTransitionEnd={onTransitionEnd}
        onClose={onClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "50%",
            minWidth: drawerWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Pushes content to top and bottom
            // height: '100%',
            height: "calc(100% - 24px)",
            mt: 1.5,
            ml: 1.5,
            borderRadius: 2,
            padding: 1,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {children}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Pushes content to top and bottom
            // height: '100%',
            height: "calc(100% - 24px)",
            mt: 1.5,
            ml: 1.5,
            borderRadius: 2,
            padding: 1,
            border: "1px solid",
            borderColor: (theme) => theme.palette.divider,
          },
        }}
        open
      >
        {children}
      </Drawer>
    </Box>
  );
}
