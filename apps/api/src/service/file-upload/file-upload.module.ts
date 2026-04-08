import { FileModule } from "@api/database/module/file.module";
import { UserModule } from "@api/database/module/user.module";
import { TransactionService } from "@api/database/service/transaction.service";
import { FileUploadController } from "@api/service/file-upload/file-upload.controller";
import { FileUploadService } from "@api/service/file-upload/file-upload.service";
import { FileController } from "@api/service/file-upload/upload.controller";
import { StorageModule } from "@api/storage-manager/storage-manager.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UserModule, FileModule, StorageModule],
  controllers: [FileUploadController, FileController],
  providers: [FileUploadService, TransactionService],
})
export class FileUploadModule {}
