import LoginActivityEntity from "@api/database/entity/login-activity.entity";
import { LoginActivityService } from "@api/database/service/login-activity.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([LoginActivityEntity])],
  providers: [LoginActivityService],
  exports: [LoginActivityService],
})
export class LoginActivityModule {}
