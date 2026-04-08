import { createZodDto, ZodResponse } from "nestjs-zod";
import { z } from "zod";

export const SchemaResponse = (
  schema: z.ZodSchema,
  status = 200,
  description = "Unset",
) =>
  ZodResponse({
    type: createZodDto(schema),
    status,
    description,
  });
