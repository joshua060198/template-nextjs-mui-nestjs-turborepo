import { ConfigurationModule } from "@api/configuration/configuration.module";
import { BullModule } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    ConfigurationModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: config.getOrThrow<string>("REDIS_HOST"),
            port: config.getOrThrow<number>("REDIS_PORT"),
            password: config.get<string>("REDIS_PASSWORD"),
            username: "default",
          },
          maxRetriesPerRequest: null,
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
