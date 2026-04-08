import MainContentContainerComponent from "@web/components/MainContentContainer.component";
import { appSidebarConfig } from "@web/components/sidebar/drawer/drawer.config";
import DrawerContentComponent from "@web/components/sidebar/drawer/DrawerContent.component";
import Sidebar from "@web/components/sidebar/Sidebar";
import SidebarLogoComponent from "@web/components/sidebar/SidebarLogo.component";
import AuthProvider from "@web/libs/providers/auth.provider";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Sidebar
        logoComponent={<SidebarLogoComponent />}
        drawerComponent={<DrawerContentComponent config={appSidebarConfig} />}
      >
        <MainContentContainerComponent>
          {children}
        </MainContentContainerComponent>
      </Sidebar>
    </AuthProvider>
  );
}
