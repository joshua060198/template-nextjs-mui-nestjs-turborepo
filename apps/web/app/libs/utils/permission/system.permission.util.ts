import { PermissionCheckerFn } from "@web/libs/utils/permission.util";

type SystemPermissionKey = "ManageSystem" | "OpenAdminPage";

const SystemPermission: Record<SystemPermissionKey, PermissionCheckerFn> = {
  ManageSystem: (permissions) => permissions.some((p) => p === "manage:system"),
  OpenAdminPage: (permissions) =>
    permissions.some((p) => p === "open:admin_page"),
};

export default SystemPermission;
