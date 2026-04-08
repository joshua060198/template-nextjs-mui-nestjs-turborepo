import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserEntity from "@api/database/entity/user.entity";
import { RoleEntity } from "@api/database/entity/role.entity";
import { PermissionEntity } from "@api/database/entity/permission.entity";
import { UserPermissionEntity } from "@api/database/entity/user-permission.entity";
import { RBACService } from "@api/database/service/rbac.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      PermissionEntity,
      UserPermissionEntity,
    ]),
  ],
  providers: [RBACService],
  exports: [RBACService],
})
export class RBACModule {}
