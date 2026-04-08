import { S3StorageManager } from "@api/storage-manager/aws-s3/s3.storage.manager";
import { S3StorageModule } from "@api/storage-manager/aws-s3/s3.storage.module";
import {
  S3_INTERNAL_CLIENT_PROVIDER,
  S3_PUBLIC_CLIENT_PROVIDER,
  STORAGE_MANAGER_PROVIDER,
} from "@api/storage-manager/storage-manager.constant";
import { S3Client } from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStorageModule } from "@api/storage-manager/local/local.storage.module";
import { LocalStorageManager } from "@api/storage-manager/local/local.storage.manager";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Module({
  imports: [
    S3StorageModule,
    LocalStorageModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [
    {
      provide: STORAGE_MANAGER_PROVIDER,
      inject: [
        S3_PUBLIC_CLIENT_PROVIDER,
        S3_INTERNAL_CLIENT_PROVIDER,
        ConfigService,
      ],
      useFactory: (
        publicClient: S3Client,
        internalClient: S3Client,
        config: ConfigService,
      ) => {
        const storageType = config.getOrThrow<string>("STORAGE_TYPE");
        if (storageType === "s3") {
          const env = config.getOrThrow<string>("NODE_ENV");
          const bucket = config.getOrThrow<string>("AWS_BUCKET");

          return new S3StorageManager(
            publicClient,
            env === "development" ? internalClient : publicClient,
            bucket,
          );
        } else {
          return new LocalStorageManager(config);
        }
      },
    },
  ],
  exports: [STORAGE_MANAGER_PROVIDER],
})
export class StorageModule {}
