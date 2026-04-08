import {
  ChangePasswordSchema,
  ChangeUserRoleSchema,
  ForgotPasswordSchema,
  GrantOrRevokeUserPermissionSchema,
  LoginSchema,
  RegisterUserSchema,
  ResetPasswordSchema,
} from "@repo/common/auth.service.type";
import {
  CreatePermissionSchema,
  UpdatePermissionSchema,
} from "@repo/common/entity/permission.entity.type";
import {
  CreateRoleSchema,
  UpdateRoleSchema,
} from "@repo/common/entity/role.entity.type";
import { createZodDto } from "nestjs-zod";

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}
export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) {}
export class UpdatePermissionDto extends createZodDto(UpdatePermissionSchema) {}
export class ChangeUserRoleDto extends createZodDto(ChangeUserRoleSchema) {}
export class GrantOrRevokeUserPermissionDto extends createZodDto(
  GrantOrRevokeUserPermissionSchema,
) {}
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
