import z from 'zod';
import { BrandedId, brandedUUIDId, zod } from '../util/zod.js';
import {
  BackendPermissionSchema,
  FrontendPermissionSchema,
} from './permission.entity.type.js';
import { UserBackendSchema, UserFrontendSchema } from './user.entity.type.js';

export type UserPermissionId = BrandedId<'UserPermissionId'>;
export enum UserPermissionEffect {
  ALLOW = 'allow',
  DENY = 'deny',
}

export const BasicUserPermissionSchema = zod.object({
  id: brandedUUIDId<'UserPermissionId'>(),
  effect: zod.enum(UserPermissionEffect),
});

export const BackendUserPermissionSchema = BasicUserPermissionSchema.extend({
  createdAt: zod.date(),
  permission: zod.lazy(() => BackendPermissionSchema),
  user: zod.lazy(() => UserBackendSchema),
});

export const FrontendUserPermissionSchema = BasicUserPermissionSchema.extend({
  createdAt: zod.iso.datetime(),
  permission: zod.lazy(() => FrontendPermissionSchema),
  user: zod.lazy(() => UserFrontendSchema),
});

export type BasicUserPermission = z.infer<typeof BasicUserPermissionSchema>;
export type BackendUserPermission = z.infer<typeof BackendUserPermissionSchema>;
export type FrontendUserPermission = z.infer<
  typeof FrontendUserPermissionSchema
>;
