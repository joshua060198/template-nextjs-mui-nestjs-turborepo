import {
  CompleteUploadSchema,
  GetFileSchema,
  PrepareUploadSchema,
} from "@repo/common/entity/file.entity.type";
import { createZodDto } from "nestjs-zod";

export class PrepareUploadDto extends createZodDto(PrepareUploadSchema) {}
export class CompleteUploadDto extends createZodDto(CompleteUploadSchema) {}
export class GetFileDto extends createZodDto(GetFileSchema) {}
