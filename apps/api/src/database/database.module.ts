import { ConfigurationModule } from "@api/configuration/configuration.module";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SystemConfigEntity } from "@api/database/entity/system.entity";

@Global()
@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        timezone: "Z",
        host: configService.getOrThrow("DB_HOST"),
        port: +configService.getOrThrow("DB_PORT"),
        username: configService.getOrThrow("DB_USER"),
        password: configService.getOrThrow("DB_PASSWORD"),
        database: configService.getOrThrow("DB_NAME"),
        autoLoadEntities: true,
        // synchronize: true,
        synchronize: configService.getOrThrow("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SystemConfigEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
