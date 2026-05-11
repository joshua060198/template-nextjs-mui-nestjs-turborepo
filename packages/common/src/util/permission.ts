import {
  BackendPermission,
  FrontendPermission,
} from "../entity/permission.entity.type.js";

export function getNameFromPermission(
  permission: FrontendPermission | BackendPermission,
) {
  return `${permission.action}:${permission.resource}`;
}

export function getActionResourceFromPermissionString(permission: string) {
  const temp = permission.split(":");
  return { action: temp[0], resource: temp[1] };
}
