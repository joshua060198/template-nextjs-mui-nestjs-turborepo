import { FileShareEntity } from "@api/database/entity/file-shares.entity";
import FileEntity from "@api/database/entity/file.entity";
import { FileShareService } from "@api/database/service/file-share.service";
import { FileService } from "@api/database/service/file.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, FileShareEntity])],
  providers: [FileService, FileShareService],
  exports: [FileService, FileShareService],
})
export class FileModule {}
