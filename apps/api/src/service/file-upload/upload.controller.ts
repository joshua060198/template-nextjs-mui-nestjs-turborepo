import { FileService } from "@api/database/service/file.service";
import { SkipResponseInterceptor } from "@api/decorator/skip-response-interceptor.decorator";
import { Public } from "@api/service/auth/decorator/is-public.decorator";
import type { LocalStorageManagerType } from "@api/storage-manager/local/local.storage.manager";
import { STORAGE_MANAGER_PROVIDER } from "@api/storage-manager/storage-manager.constant";
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseFailed, ResponseSuccess } from "@repo/common/common.type";
import { FILE_UPLOAD_ERROR } from "@repo/common/file-upload.service.type";

import { ReadStream } from "node:fs";

@Controller({
  path: "files",
  version: VERSION_NEUTRAL,
})
export class FileController {
  constructor(
    @Inject(STORAGE_MANAGER_PROVIDER)
    private readonly storage: LocalStorageManagerType,
    private readonly fileService: FileService,
  ) {}

  @Get("download/*key")
  @SkipResponseInterceptor()
  @Public()
  async download(@Param("key") key: string[]) {
    const finalKey = key.join("/");
    const fileData = await this.fileService.getFileByObjectKey(finalKey);

    if (!fileData) {
      throw new NotFoundException(
        new ResponseFailed(FILE_UPLOAD_ERROR.UPLOADED_FILE_NOT_FOUND),
      );
    }

    const result = await this.storage.directDownload(finalKey);

    return new StreamableFile(result as ReadStream, {
      type: fileData.mimeType || "application/octet-stream",
      disposition: `attachment; filename="${fileData.originalName || "file"}"`,
    });
  }

  @Post("upload/*key")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @Param("key") key: string[],
    @UploadedFile() file: Express.Multer.File,
  ) {
    const finalKey = key.join("/");
    const fileData = await this.fileService.getFileByObjectKey(finalKey);

    if (!fileData) {
      throw new NotFoundException(
        new ResponseFailed(FILE_UPLOAD_ERROR.UPLOADED_FILE_NOT_FOUND),
      );
    }

    if (file.size !== fileData.size || file.mimetype !== fileData.mimeType) {
      throw new BadRequestException(
        new ResponseFailed(FILE_UPLOAD_ERROR.DIFFERENT_FILE_UPLOADED),
      );
    }

    await this.storage.directUpload(finalKey, file.buffer, fileData.mimeType);

    return new ResponseSuccess(true);
  }
}
