export type PermissionCheckerFn = (permissions: string[]) => boolean;

interface DefaultPermission {
  Manage: PermissionCheckerFn;
  Read: PermissionCheckerFn;
  Update: PermissionCheckerFn;
  Create: PermissionCheckerFn;
  Delete?: PermissionCheckerFn;
}

export function isAllowed(permissions: string[], ...fn: PermissionCheckerFn[]) {
  return (
    permissions.includes("manage:system") || fn.some((f) => f(permissions))
  );
}

export abstract class PermissionUtil implements DefaultPermission {
  protected constructor(protected readonly resource: string) {}

  Manage: PermissionCheckerFn = (permissions) =>
    permissions.some((p) => p === `manage:${this.resource}`);

  Read: PermissionCheckerFn = (permissions) =>
    this.Manage(permissions) ||
    permissions.some((p) => p === `read:${this.resource}`);

  Create: PermissionCheckerFn = (permissions) =>
    this.Manage(permissions) ||
    permissions.some((p) => p === `create:${this.resource}`);

  Update: PermissionCheckerFn = (permissions) =>
    this.Manage(permissions) ||
    permissions.some((p) => p === `update:${this.resource}`);
}
