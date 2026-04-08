import { PermissionName } from "@repo/common/entity/permission.entity.type";

export function isAllowedForRBACManagementPage(permissions: PermissionName[]) {
  return (
    permissions.filter(
      (p) =>
        p === "manage:user" ||
        p === "update:user" ||
        p === "create:user" ||
        p === "manage:rbac" ||
        p === "update:rbac" ||
        p === "create:rbac" ||
        p === "delete:rbac",
    ).length > 0
  );
}
