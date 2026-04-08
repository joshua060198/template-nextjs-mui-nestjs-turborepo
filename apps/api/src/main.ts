import { AppModule } from "@api/app.module";
import { DatabaseErrorFilter } from "@api/filter/database-error.filter";
import { GlobalHttpExceptionFilter } from "@api/filter/global-exception.filter";
import { JwtHttpAuthGuard } from "@api/service/auth/guard/jwt-http.guard";
import { PermissionsGuard } from "@api/service/auth/guard/permissions.guard";
import { Logger, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { updateGlobalConfig } from "nestjs-paginate";
import "reflect-metadata";

async function bootstrap() {
  const logger = new Logger("Main", { timestamp: true });
  logger.log("Initiating API Gateway...");
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allow specific HTTP methods
      credentials: true,
    },
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>("API_PORT", 3000);
  app.useGlobalFilters(
    new DatabaseErrorFilter(),
    new GlobalHttpExceptionFilter(),
  );
  (app as NestExpressApplication)
    .getHttpAdapter()
    .getInstance()
    .set("trust proxy", true);

  app.use(cookieParser()); // Use the cookie-parser middleware
  app.useGlobalGuards(app.get(JwtHttpAuthGuard), app.get(PermissionsGuard));

  await app.listen(port, () =>
    logger.log(`API Gateway running on port: ${port}`),
  );
}
process.env.TZ = "UTC";
updateGlobalConfig({
  defaultLimit: 10,
  defaultMaxLimit: 500,
});
void bootstrap();
