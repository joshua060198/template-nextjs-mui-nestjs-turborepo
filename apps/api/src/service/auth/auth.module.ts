import { LoginActivityModule } from "@api/database/module/login-activity.module";
import { TransactionService } from "@api/database/service/transaction.service";
import { LoginActivityInterceptor } from "@api/interceptor/login-activity.interceptor";
import { AuthController } from "@api/service/auth/auth.controller";
import { JwtHttpAuthGuard } from "@api/service/auth/guard/jwt-http.guard";
import { JwtHttpStrategy } from "@api/service/auth/strategy/jwt-http.strategy";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RBACModule } from "@api/database/module/rbac.module";
import { UserModule } from "@api/database/module/user.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow("JWT_SECRET", "supersecret"),
        signOptions: { expiresIn: "60m" },
      }),
    }),
    UserModule,
    RBACModule,
    LoginActivityModule,
  ],
  providers: [
    AuthService,
    JwtHttpStrategy,
    JwtHttpAuthGuard,
    LoginActivityInterceptor,
    TransactionService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
