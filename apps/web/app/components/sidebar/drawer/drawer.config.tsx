"use client";
import {
  AdminPanelSettingsIcon,
  HomeIcon,
  PeopleIcon,
  VerifiedUserIcon,
} from "@web/components/IconCollection";
import { isAllowedForRBACManagementPage } from "@web/libs/utils/permission.util";
import { ReactNode } from "react";

export interface DrawerItemConfig {
  label: string;
  path?: string;
  icon?: ReactNode;
  type?: "section";
  isAllowed?: (userPermission: string[]) => boolean;
  children?: DrawerItemConfig[];
}

function transformDrawerConfigWithBasePath(
  basePath: string,
  baseLabel: string,
  config: DrawerItemConfig[],
) {
  return config.map((item) =>
    transformBasePathRecursive(basePath, baseLabel, item),
  );
}

function transformBasePathRecursive(
  basePath: string,
  baseLabel: string,
  config: DrawerItemConfig,
): DrawerItemConfig {
  const children = config.children?.map((item) =>
    transformBasePathRecursive(basePath, baseLabel, item),
  );

  const finalPath = config.path ? `/${basePath}/${config.path}` : config.path;

  return {
    ...config,
    label: `${baseLabel}.${config.label}`,
    children,
    path: finalPath,
  };
}

export const appSidebarConfig: DrawerItemConfig[] =
  transformDrawerConfigWithBasePath("", "App", [
    {
      label: "Home",
      path: "",
      icon: <HomeIcon fontSize="small" />,
    },
  ]);

export const adminSidebarConfig: DrawerItemConfig[] =
  transformDrawerConfigWithBasePath("admin", "Admin", [
    {
      label: "Home",
      path: "",
      icon: <HomeIcon fontSize="small" />,
    },
    {
      label: "RBAC.Title",
      isAllowed: isAllowedForRBACManagementPage,
      type: "section",
    },
    {
      label: "RBAC.UserManagement",
      path: "rbac/user-management",
      icon: <PeopleIcon fontSize="small" />,
      isAllowed: isAllowedForRBACManagementPage,
    },
    {
      label: "RBAC.Role",
      path: "rbac/role",
      icon: <AdminPanelSettingsIcon fontSize="small" />,
      isAllowed: isAllowedForRBACManagementPage,
    },
    {
      label: "RBAC.Permission",
      path: "rbac/permission",
      icon: <VerifiedUserIcon fontSize="small" />,
      isAllowed: isAllowedForRBACManagementPage,
    },
    // {
    //   label: "BasicConfiguration.SchoolYear",
    //   path: "school-year",
    //   icon: <EventIcon fontSize="small" />,
    //   // isAllowed: () =>  //optional permission check
    // },
  ]);
