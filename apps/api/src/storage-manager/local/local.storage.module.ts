import { Module } from "@nestjs/common";
import { ConfigurationModule } from "@api/configuration/configuration.module";
import { LocalStorageManager } from "@api/storage-manager/local/local.storage.manager";

@Module({
  imports: [ConfigurationModule],
  providers: [LocalStorageManager],
  exports: [LocalStorageManager],
})
export class LocalStorageModule {}
