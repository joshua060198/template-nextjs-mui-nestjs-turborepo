import { z } from 'zod';
import { createSuccessResponseSchema } from '../common.type.js';
import { BrandedId, brandedUUIDId, zod } from '../util/zod.js';
import { UserSchema } from './user.entity.type.js';

export type FileId = BrandedId<'FileId'>;
export type Bytes = number & { readonly __brand: 'bytes' };

export enum FileStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  PROCESSING = 'processing',
  IDLE = 'idle',
}

export enum FileVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  SHARED = 'shared',
}

export const FileSchema = zod.object({
  objectKey: zod.string().required(),
  size: zod.number().transform((v) => v as Bytes),
  mimeType: zod.string().required(),
  status: zod.enum(FileStatus),
  visibility: zod.enum(FileVisibility),
  originalName: zod.string().required(),
  thumbnailSmall: zod.string().optional().nullable(),
  thumbnailMedium: zod.string().optional().nullable(),
  createdAt: zod.date(),
  deletedAt: zod.date().optional().nullable(),
  id: brandedUUIDId<'FileId'>(),
});

export const FileBackendSchema = FileSchema.extend({
  ownerId: brandedUUIDId<'UserId'>(),
});

export type FileBackend = z.infer<typeof FileBackendSchema>;

export const FileFrontendSchema = FileSchema.extend({
  createdAt: zod.iso.datetime(),
  deletedAt: zod.iso.datetime().optional().nullable(),
  user: zod.lazy(() => UserSchema),
});

export type FileFrontend = z.infer<typeof FileFrontendSchema>;

export const UpdateFileStatusSchema = FileSchema.pick({
  id: true,
  status: true,
});

export type UpdateFileStatus = z.infer<typeof UpdateFileStatusSchema>;

export const CreateFileSchema = FileSchema.pick({
  objectKey: true,
  size: true,
  mimeType: true,
  status: true,
  originalName: true,
}).extend({
  userId: brandedUUIDId<'UserId'>(),
});

export type CreateFile = z.infer<typeof CreateFileSchema>;

export const UpdateFileMetadataSchema = FileSchema.partial()
  .pick({
    objectKey: true,
    size: true,
    mimeType: true,
    status: true,
    thumbnailSmall: true,
    thumbnailMedium: true,
  })
  .extend({
    id: brandedUUIDId<'FileId'>(),
  });

export type UpdateFileMetadata = z.infer<typeof UpdateFileMetadataSchema>;

export const PrepareUploadSchema = FileSchema.pick({
  mimeType: true,
  size: true,
}).extend({
  fileName: zod.string().required(),
});

export type PrepareUpload = z.infer<typeof PrepareUploadSchema>;

export const PrepareUploadResponseSchema = createSuccessResponseSchema(
  FileSchema.pick({
    id: true,
    objectKey: true,
  }).extend({
    uploadUrl: zod.url(),
    expiresInSeconds: zod.number(),
  }),
);

export type PrepareUploadResponse = z.infer<
  typeof PrepareUploadResponseSchema
>['data'];

export const CompleteUploadSchema = FileSchema.pick({
  id: true,
  objectKey: true,
});

export type CompleteUpload = z.infer<typeof CompleteUploadSchema>;

export const CompleteUploadResponseSchema =
  createSuccessResponseSchema(FileBackendSchema);

export type CompleteUploadResponse = z.infer<
  typeof CompleteUploadResponseSchema
>['data'];

export const GetFileResponseSchema = createSuccessResponseSchema(
  zod.object({
    url: zod.url(),
    expiresInSeconds: zod.number(),
  }),
);
export type GetFileResponse = z.infer<typeof GetFileResponseSchema>['data'];

export const GetFileSchema = zod.object({
  isThumbnail: zod.boolean().optional(),
  isThumbnailMedium: zod.boolean().optional(),
});
export type GetFile = z.infer<typeof GetFileSchema>;
