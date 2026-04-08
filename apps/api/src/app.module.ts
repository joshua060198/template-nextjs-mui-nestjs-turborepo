import { ConfigurationModule } from "@api/configuration/configuration.module";
import { DatabaseModule } from "@api/database/database.module";
import { RBACModule } from "@api/database/module/rbac.module";
import { SeedersService } from "@api/database/seeders/seeders.service";
import { TransactionService } from "@api/database/service/transaction.service";
import { LoggingInterceptor } from "@api/interceptor/log.interceptor";
import { RequestContextInterceptor } from "@api/interceptor/request-context.interceptor";
import { ResponseInterceptor } from "@api/interceptor/response.interceptor";
import { TimingMiddleware } from "@api/middleware/timing.middleware";
import { QueueModule } from "@api/queue/queue.module";
import { AuthModule } from "@api/service/auth/auth.module";
import { JwtHttpAuthGuard } from "@api/service/auth/guard/jwt-http.guard";
import { PermissionsGuard } from "@api/service/auth/guard/permissions.guard";
import { FileUploadModule } from "@api/service/file-upload/file-upload.module";
import { RequestContextService } from "@api/service/request-context.service";
import { StorageModule } from "@api/storage-manager/storage-manager.module";
import CustomZodValidationPipe from "@api/validation/zod.validation";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ZodSerializerInterceptor } from "nestjs-zod";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    StorageModule,
    QueueModule,
    AuthModule,
    RBACModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    RequestContextService,
    TransactionService,
    SeedersService,
    JwtHttpAuthGuard,
    PermissionsGuard,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimingMiddleware).forRoutes("*path");
  }
}
