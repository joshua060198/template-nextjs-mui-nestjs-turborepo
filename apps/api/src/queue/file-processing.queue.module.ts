import { ConfigurationModule } from "@api/configuration/configuration.module";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { FILE_PROCESSING_QUEUE } from "@repo/common/common.type";

@Module({
  imports: [
    ConfigurationModule,
    BullModule.registerQueue({
      name: FILE_PROCESSING_QUEUE,
    }),
  ],
  exports: [BullModule],
})
export class FileProcessingModule {}
