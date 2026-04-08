import { ConfigurationModule } from "@api/configuration/configuration.module";
import {
  S3_INTERNAL_CLIENT_PROVIDER,
  S3_PUBLIC_CLIENT_PROVIDER,
} from "@api/storage-manager/storage-manager.constant";
import { S3Client } from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigurationModule],
  providers: [
    {
      provide: S3_PUBLIC_CLIENT_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): S3Client => {
        return new S3Client({
          region: config.getOrThrow<string>("AWS_REGION"),
          endpoint: config.get<string>("AWS_ENDPOINT_PUBLIC"),
          requestChecksumCalculation: "WHEN_REQUIRED",
          responseChecksumValidation: "WHEN_REQUIRED",
          forcePathStyle: true,
        });
      },
    },
    {
      provide: S3_INTERNAL_CLIENT_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): S3Client => {
        return new S3Client({
          region: config.getOrThrow<string>("AWS_REGION"),
          endpoint: config.get<string>("AWS_ENDPOINT_INTERNAL"),
          forcePathStyle: true,
          requestChecksumCalculation: "WHEN_REQUIRED",
          responseChecksumValidation: "WHEN_REQUIRED",
        });
      },
    },
  ],
  exports: [S3_PUBLIC_CLIENT_PROVIDER, S3_INTERNAL_CLIENT_PROVIDER],
})
export class S3StorageModule {}
