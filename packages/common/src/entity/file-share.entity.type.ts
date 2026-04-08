import { z } from 'zod';
import { BrandedId, brandedUUIDId, zod } from '../util/zod.js';
import type { FileId } from './file.entity.type.js';
import { type UserId } from './user.entity.type.js';

export type FileShareId = BrandedId<'FileShareId'>;

export const FileShareSchema = zod.object({
  createdAt: zod.date(),
  id: brandedUUIDId<'FileShareId'>(),
  sharedWithUserId: zod
    .string()
    .required()
    .validUUID()
    .transform((v) => v as UserId),
  fileId: zod
    .string()
    .required()
    .validUUID()
    .transform((v) => v as FileId),
});

export const FileShareBackendSchema = FileShareSchema;

export type FileShareBackend = z.infer<typeof FileShareBackendSchema>;

export const FileShareFrontendSchema = FileShareSchema.extend({
  createdAt: zod.iso.datetime(),
});

export type FileShareFrontend = z.infer<typeof FileShareFrontendSchema>;
