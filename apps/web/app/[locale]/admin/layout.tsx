import MainContentContainerComponent from "@web/components/MainContentContainer.component";
import { adminSidebarConfig } from "@web/components/sidebar/drawer/drawer.config";
import DrawerContentComponent from "@web/components/sidebar/drawer/DrawerContent.component";
import Sidebar from "@web/components/sidebar/Sidebar";
import SidebarLogoComponent from "@web/components/sidebar/SidebarLogo.component";
import AdminProvider from "@web/libs/providers/admin.provider";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <Sidebar
        logoComponent={<SidebarLogoComponent />}
        drawerComponent={
          <DrawerContentComponent config={adminSidebarConfig} isAdmin />
        }
      >
        <MainContentContainerComponent>
          {children}
        </MainContentContainerComponent>
      </Sidebar>
    </AdminProvider>
  );
}
