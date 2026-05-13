import {
  PermissionCheckerFn,
  PermissionUtil,
} from "@web/libs/utils/permission.util";

class RBACPermissionUtil extends PermissionUtil {
  constructor() {
    super("rbac");
  }

  Delete: PermissionCheckerFn = (permissions) =>
    this.Manage(permissions) ||
    permissions.some((p) => p === `delete:${this.resource}`);
}

const RBACPermission = new RBACPermissionUtil();
export default RBACPermission;
