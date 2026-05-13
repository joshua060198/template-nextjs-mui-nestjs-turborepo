import z from "zod";
import { BrandedId, brandedUUIDId, zod } from "../util/zod.js";

export type PermissionId = BrandedId<"PermissionId">;

export const BasicPermissionSchema = zod.object({
  id: brandedUUIDId<"PermissionId">(),
  action: zod.string().required(),
  resource: zod.string().required(),
  isSystem: zod.boolean().default(false),
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
  description: true,
  action: true,
  resource: true,
  displayName: true,
});

export type CreatePermission = z.infer<typeof CreatePermissionSchema>;

export const UpdatePermissionSchema = CreatePermissionSchema.pick({
  displayName: true,
  description: true,
}).extend({
  id: brandedUUIDId<"PermissionId">(),
});

export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>;
