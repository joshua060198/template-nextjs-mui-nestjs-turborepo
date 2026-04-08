import { z } from 'zod';
import { BrandedId, brandedUUIDId, zod } from '../util/zod.js';
import { UserSchema } from './user.entity.type.js';

export type LoginActivityId = BrandedId<'LoginActivityId'>;

export const LoginActivitySchema = zod.object({
  ip: zod.ipv4(),
  userAgent: zod.string().required(),
  browser: zod.string().optional().nullable(),
  browserVersion: zod.string().optional().nullable(),
  os: zod.string().optional().nullable(),
  device: zod.string().optional().nullable(),
  continent: zod.string().optional().nullable(),
  country: zod.string().optional().nullable(),
  city: zod.string().optional().nullable(),
  isSuccess: zod.boolean(),
  createdAt: zod.date(),
  user: zod.lazy(() => UserSchema),
  id: brandedUUIDId<'LoginActivityId'>(),
});

export type LoginActivityBackend = z.infer<typeof LoginActivitySchema>;

export const InsertLoginActivitySchema = LoginActivitySchema.omit({
  id: true,
  user: true,
  createdAt: true,
}).extend({
  userId: brandedUUIDId<'UserId'>(),
});

export type InsertLoginActivity = z.infer<typeof InsertLoginActivitySchema>;
