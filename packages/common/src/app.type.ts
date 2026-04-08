import { z } from 'zod';
import { createSuccessResponseSchema } from './common.type.js';
import { zod } from './util/zod.js';

export const HealthCheckSchema = createSuccessResponseSchema(zod.string());

export type HealthCheckResponse = z.infer<typeof HealthCheckSchema>;
