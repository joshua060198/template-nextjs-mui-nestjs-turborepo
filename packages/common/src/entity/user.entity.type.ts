import z from 'zod';
import { BrandedId, brandedUUIDId, zod } from '../util/zod.js';
import { Bytes, FileSchema } from './file.entity.type.js';
import { BasicRoleSchema, FrontendRoleSchema } from './role.entity.type.js';

export type UserId = BrandedId<'UserId'>;

export const UserSchema = zod.object({
  username: zod.string().required().min(4),
  email: zod.email().optional().nullable(),
  fullName: zod.string().required().max(64),
  resetPassword: zod.boolean().default(true),
  usedStorageBytes: zod.number().transform((v) => v as Bytes),
  storageLimitBytes: zod.number().transform((v) => v as Bytes),
  avatar: zod
    .lazy(() => FileSchema)
    .nullable()
    .optional(),
  id: brandedUUIDId<'UserId'>(),
});

export const UserBackendSchema = UserSchema.extend({
  role: zod.lazy(() => BasicRoleSchema),
  password: zod.string().required().min(8).max(64),
  createdAt: zod.date(),
  updatedAt: zod.date(),
  deletedAt: zod.date().optional().nullable(),
  emailVerifiedAt: zod.date().optional().nullable(),
  emailVerificationTokenSentAt: zod.date().optional().nullable(),
});

export type UserBackend = z.infer<typeof UserBackendSchema>;

export const UserFrontendSchema = UserSchema.extend({
  role: zod.lazy(() => FrontendRoleSchema),
  createdAt: zod.iso.datetime(),
  updatedAt: zod.iso.datetime(),
  deletedAt: zod.iso.datetime().optional().nullable(),
  emailVerifiedAt: zod.iso.datetime().optional().nullable(),
  emailVerificationTokenSentAt: zod.iso.datetime().optional().nullable(),
});

export type UserFrontend = z.infer<typeof UserFrontendSchema>;

export const UpdateUserProfileSchema = UserFrontendSchema.pick({
  email: true,
  fullName: true,
}).extend({
  avatarId: brandedUUIDId<'FileId'>().optional().nullable(),
});

export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateUserProfileFormInput = z.input<
  typeof UpdateUserProfileSchema
>;

export const VerifiedEmailSchema = zod.object({
  token: zod.string().required(),
});

export type VerifiedEmail = z.infer<typeof VerifiedEmailSchema>;
