import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";
import * as path from "node:path";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "test"
          ? [path.join(process.cwd(), ".env.test"), "../../.env.test"]
          : [path.join(process.cwd(), ".env"), "../../.env"],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .default("development"),
        API_HOST: Joi.string(),
        API_PORT: Joi.number().port().default(3000),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number().port().default(5432),
        DB_USER: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        JWT_SECRET: Joi.string().min(16),
        SUPER_ADMIN_PASSWORD: Joi.string().min(8),
        REDIS_PORT: Joi.number().port(),
        REDIS_HOST: Joi.string(),
        REDIS_PASSWORD: Joi.string(),
        STORAGE_TYPE: Joi.string().valid("local", "s3").default("local"),
        STORAGE_PATH: Joi.string(),
        AWS_FILE_EXPIRATION: Joi.number(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_BUCKET: Joi.string(),
        AWS_REGION: Joi.string(),
        AWS_ENDPOINT_PUBLIC: Joi.string(),
        AWS_ENDPOINT_INTERNAL: Joi.string(),
      }),
      expandVariables: true,
      cache: true,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
