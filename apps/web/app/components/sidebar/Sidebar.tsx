"use client";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { MenuIcon } from "@web/components/IconCollection";
import DrawerContainerComponent from "@web/components/sidebar/drawer/DrawerContainer.component";
import * as React from "react";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  logoComponent: ReactNode;
  drawerComponent: ReactNode;
}

export default function Sidebar({
  children,
  logoComponent,
  drawerComponent,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        color="default"
        position="fixed"
        sx={{
          width: {
            xs: "calc(100% - 24px)",
          },
          ml: {
            xs: 1.5,
          },
          left: 0,
          display: { md: "none" },
          mt: 1.5,
          borderRadius: 3.5,
          border: "1px solid",
          borderColor: (theme) => theme.palette.divider,
          pr: "0px !important",
        }}
        elevation={3}
      >
        <Toolbar>
          <Button
            onClick={handleDrawerToggle}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 3,
              display: { md: "none" },
            }}
            color="inherit"
            startIcon={<MenuIcon />}
          >
            Menu
          </Button>
          {logoComponent}
        </Toolbar>
      </AppBar>
      <DrawerContainerComponent
        isOpen={mobileOpen}
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
      >
        {drawerComponent}
      </DrawerContainerComponent>
      {children}
    </Box>
  );
}
