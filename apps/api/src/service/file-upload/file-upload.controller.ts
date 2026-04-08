import { SchemaResponse } from "@api/decorator/schema-response.decorator";
import { CurrentUser } from "@api/service/auth/decorator/current-user.decorator";
import { OptionalJwtHttpAuthGuard } from "@api/service/auth/guard/optional-auth.guard";
import {
  CompleteUploadDto,
  GetFileDto,
  PrepareUploadDto,
} from "@api/service/file-upload/file-upload.dto";
import { FileUploadService } from "@api/service/file-upload/file-upload.service";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import type { JwtPayload } from "@repo/common/auth.service.type";
import {
  CompleteUploadResponseSchema,
  type FileId,
  PrepareUploadResponseSchema,
} from "@repo/common/entity/file.entity.type";

@Controller("file-upload")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post("/prepare")
  @SchemaResponse(PrepareUploadResponseSchema)
  prepareUpload(
    @CurrentUser() user: JwtPayload,
    @Body() data: PrepareUploadDto,
  ) {
    return this.fileUploadService.prepareUpload(data, user.sub);
  }

  @Post("/complete")
  @SchemaResponse(CompleteUploadResponseSchema)
  completeUpload(
    @CurrentUser() user: JwtPayload,
    @Body() body: CompleteUploadDto,
  ) {
    return this.fileUploadService.completeUpload(body, user.sub);
  }

  @UseGuards(OptionalJwtHttpAuthGuard)
  @Get("/download/:id")
  getFile(
    @CurrentUser() user: JwtPayload,
    @Param("id") id: FileId,
    @Query() data: GetFileDto,
  ) {
    return this.fileUploadService.getFileDownloadUrl(id, data, user.sub);
  }
}
