import { z } from "zod";
import {
  createPaginatedSchema,
  createSuccessResponseSchema,
  ErrorCode,
} from "./common.type.js";
import {
  AllPermissions,
  FrontendPermissionSchema,
  PermissionName,
} from "./entity/permission.entity.type.js";
import { BasicRole, FrontendRoleSchema } from "./entity/role.entity.type.js";
import { BackendUserPermissionSchema } from "./entity/user-permission.entity.type.js";
import {
  UserBackendSchema,
  UserFrontendSchema,
  UserId,
} from "./entity/user.entity.type.js";
import { brandedUUIDId, zod } from "./util/zod.js";

export interface JwtPayload {
  sub: UserId;
  role: BasicRole;
  permissions: string[];
}

class AuthError extends ErrorCode {
  private static MODULE_CODE = "01";

  constructor(errorCode: string, message?: string) {
    super(AuthError.MODULE_CODE, errorCode, message);
  }
}

export const AUTH_ERROR = {
  DUPLICATE_USER_ERROR: new AuthError(
    "001",
    "Failed to register a user. User with the same credential already exist.",
  ),
  USER_NOT_FOUND: new AuthError("002", "Can't find user with that credential."),
  FORGOT_PASSWORD_TOO_SOON: new AuthError(
    "003",
    "Forgot password sent email too fast. Please wait at least 5 minute before sending another request.",
  ),
  FAILED_SENDING_FORGOT_PASSWORD_EMAIL: new AuthError(
    "004",
    "Failed to send forgot password email!",
  ),
  INVALID_RESET_PASSWORD_TOKEN: new AuthError(
    "005",
    "Invalid reset password token or the email does not exist!",
  ),
  FAILED_TO_UPDATE_USER_PASSWORD: new AuthError(
    "006",
    "Failed to execute update user password! Please check again.",
  ),
  PERMISSION_NOT_FOUND: new AuthError(
    "007",
    "Can't find permission with that name.",
  ),
  ROLE_NOT_FOUND: new AuthError("008", "Can't find role with that name or id."),
  CREATE_ROLE_FAILED: new AuthError("009", "Failed to create role"),
};

export class UnauthorizedError extends ErrorCode {
  public static MODULE_CODE = "01";

  constructor(public readonly sub: string) {
    super(UnauthorizedError.MODULE_CODE, "000", "Invalid credentials.");
  }

  static isErrorMatch(error: any) {
    return (
      error !== undefined &&
      error !== null &&
      error instanceof UnauthorizedError &&
      error.code === "01000"
    );
  }
}

export const RegisterUserSchema = UserBackendSchema.pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
})
  .extend({
    roleId: brandedUUIDId<"RoleId">(),
  })
  .partial({
    password: true,
  });

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const LoginSchema = UserBackendSchema.pick({
  username: true,
  password: true,
});
export type Login = z.infer<typeof LoginSchema>;

export const LoginResponseSchema = createSuccessResponseSchema(
  zod.object({
    accessToken: zod.string().required(),
    sub: brandedUUIDId<"UserId">(),
  }),
);

export type LoginResponse = z.infer<typeof LoginResponseSchema>["data"];

export const MeResponseFrontendSchema = createSuccessResponseSchema(
  UserFrontendSchema.extend({
    imageUrl: zod.string().optional(),
    imageExpiration: zod.number().min(0).optional(),
    permissions: zod.array(
      zod
        .string()
        .required()
        .transform((v) => v as PermissionName),
    ),
  }),
);

export type MeResponseFrontend = z.infer<
  typeof MeResponseFrontendSchema
>["data"];

export const MeResponseBackendSchema = createSuccessResponseSchema(
  UserBackendSchema.extend({
    imageUrl: zod.string().optional(),
    imageExpiration: zod.number().min(0).optional(),
    permissions: zod.array(zod.string().required()),
  }),
);

export type MeResponseBackend = z.infer<typeof MeResponseBackendSchema>["data"];

export const ForgotPasswordSchema = zod.object({
  email: zod.email(),
});

export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = UserBackendSchema.pick({
  password: true,
});

export const ResetPasswordFormSchema = zod
  .object({
    password: zod.string().required(),
    confirmPassword: zod.string().required(),
  })
  .sameAs("password", "confirmPassword", "PasswordNotSame");

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;

export const ChangeUserRoleSchema = zod.object({
  userId: brandedUUIDId<"UserId">(),
  roleId: brandedUUIDId<"RoleId">(),
});

export type ChangeUserRole = z.infer<typeof ChangeUserRoleSchema>;

export const ChangeUserRoleResponseSchema = createSuccessResponseSchema(
  UserBackendSchema.omit({ password: true }),
);

export type ChangeUserRoleResponse = z.infer<
  typeof ChangeUserRoleResponseSchema
>;

export const GrantOrRevokeUserPermissionSchema = zod.object({
  permissionName: zod.enum(AllPermissions),
  userId: brandedUUIDId<"UserId">(),
});

export type GrantOrRevokeUserPermission = z.infer<
  typeof GrantOrRevokeUserPermissionSchema
>;

export const GrantOrRevokeUserPermissionResponseSchema =
  createSuccessResponseSchema(
    BackendUserPermissionSchema.extend({
      user: zod.lazy(() =>
        UserBackendSchema.omit({
          role: true,
        }),
      ),
    }),
  );

export type GrantOrRevokeUserPermissionResponse = z.infer<
  typeof GrantOrRevokeUserPermissionResponseSchema
>;
export const ResetPasswordResponseSchema = createSuccessResponseSchema(
  zod.string(),
);

export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;

export const ChangePasswordSchema = zod.object({
  password: zod.string().required().min(8).max(64),
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

export const QueryResponseUserSchema =
  createPaginatedSchema(UserFrontendSchema);
export type QueryResponseUser = z.infer<typeof QueryResponseUserSchema>;

export const QueryResponseRoleSchema =
  createPaginatedSchema(FrontendRoleSchema);
export type QueryResponseRole = z.infer<typeof QueryResponseRoleSchema>;

export const QueryResponsePermissionSchema = createPaginatedSchema(
  FrontendPermissionSchema,
);
export type QueryResponsePermission = z.infer<
  typeof QueryResponsePermissionSchema
>;
