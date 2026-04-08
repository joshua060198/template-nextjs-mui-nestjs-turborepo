import z from "zod";
import { BrandedId, brandedUUIDId, zod } from "../util/zod.js";

export type PermissionId = BrandedId<"PermissionId">;
export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage",
}
export enum PermissionResource {
  USER = "user",
  RBAC = "rbac",
}

export type PermissionName =
  | `${PermissionAction}:${PermissionResource}`
  | "manage:system"
  | "open:admin_page";

// Generate "action:resource"
const permissionCombinations: PermissionName[] = Object.values(
  PermissionAction,
).flatMap((action) =>
  Object.values(PermissionResource).map(
    (resource) => `${action}:${resource}` as const,
  ),
);

// Add special case
export const AllPermissions = [
  ...permissionCombinations,
  "manage:system",
  "open:admin_page",
] as const;

export type PermissionConfig =
  | {
      action: PermissionAction;
      resource: PermissionResource;
    }
  | "manage:system"
  | "open:admin_page";

export const BasicPermissionSchema = zod.object({
  id: brandedUUIDId<"PermissionId">(),
  name: zod
    .string()
    .required()
    .regex(/^[a-zA-Z]*:[a-zA-Z_]*$/gm),
  displayName: zod.string().required(),
  description: zod.string().nullable().optional(),
});

export const BackendPermissionSchema = BasicPermissionSchema.extend({
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const FrontendPermissionSchema = BasicPermissionSchema.extend({
  createdAt: zod.iso.datetime(),
  updatedAt: zod.iso.datetime(),
});

export type BasicPermission = z.infer<typeof BasicPermissionSchema>;
export type BackendPermission = z.infer<typeof BackendPermissionSchema>;
export type FrontendPermission = z.infer<typeof FrontendPermissionSchema>;

export const CreatePermissionSchema = BasicPermissionSchema.pick({
  displayName: true,
  description: true,
}).extend({
  action: zod.enum(PermissionAction),
  resource: zod.enum(PermissionResource),
});

export type CreatePermission = z.infer<typeof CreatePermissionSchema>;

export const UpdatePermissionSchema = BasicPermissionSchema.pick({
  displayName: true,
  description: true,
}).partial();

export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>;
