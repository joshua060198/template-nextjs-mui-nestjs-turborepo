import { SetMetadata } from "@nestjs/common";
import { PermissionConfig } from "@repo/common/entity/permission.entity.type";

export const PERMISSIONS_KEY = "permissions";
export const RequirePermissions = (...permissions: PermissionConfig[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
