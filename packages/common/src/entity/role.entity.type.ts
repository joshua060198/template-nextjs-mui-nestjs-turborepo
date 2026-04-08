import z from "zod";
import { createSuccessResponseSchema } from "../common.type.js";
import { BrandedId, brandedUUIDId, zod } from "../util/zod.js";
import {
  BackendPermissionSchema,
  FrontendPermissionSchema,
} from "./permission.entity.type.js";

export type RoleId = BrandedId<"RoleId">;

export const BasicRoleSchema = zod.object({
  id: brandedUUIDId<"RoleId">(),
  name: zod.string().required(),
  displayName: zod.string().required(),
  description: zod.string().nullable().optional(),
  isSystem: zod.boolean().default(false),
});

export const BackendRoleSchema = BasicRoleSchema.extend({
  createdAt: zod.date(),
  updatedAt: zod.date(),
  deletedAt: zod.date().nullable(),
  permissions: zod.array(zod.lazy(() => BackendPermissionSchema)),
});

export const FrontendRoleSchema = BasicRoleSchema.extend({
  createdAt: zod.iso.datetime(),
  updatedAt: zod.iso.datetime(),
  deletedAt: zod.iso.datetime().nullable(),
  permissions: zod.array(zod.lazy(() => FrontendPermissionSchema)),
});

export type BasicRole = z.infer<typeof BasicRoleSchema>;
export type BackendRole = z.infer<typeof BackendRoleSchema>;
export type FrontendRole = z.infer<typeof FrontendRoleSchema>;

export const CreateRoleSchema = BasicRoleSchema.pick({
  name: true,
  displayName: true,
  description: true,
  isSystem: true,
}).extend({
  permissions: zod.array(brandedUUIDId<"PermissionId">()),
});

export type CreateRole = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = CreateRoleSchema.omit({
  isSystem: true,
})
  .partial()
  .extend({
    roleId: brandedUUIDId<"RoleId">(),
  });

export type UpdateRole = z.infer<typeof UpdateRoleSchema>;

export const UpdateRoleResponseSchema =
  createSuccessResponseSchema(BackendRoleSchema);

export type UpdateRoleResponse = z.infer<typeof UpdateRoleResponseSchema>;
