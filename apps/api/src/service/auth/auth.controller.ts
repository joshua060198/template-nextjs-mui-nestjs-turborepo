import { SchemaResponse } from "@api/decorator/schema-response.decorator";
import { LoginActivityInterceptor } from "@api/interceptor/login-activity.interceptor";
import {
  ChangePasswordDto,
  ChangeUserRoleDto,
  CreatePermissionDto,
  CreateRoleDto,
  GrantOrRevokeUserPermissionDto,
  LoginDto,
  RegisterUserDto,
  UpdatePermissionDto,
  UpdateRoleDto,
} from "@api/service/auth/auth.dto";
import { AuthService } from "@api/service/auth/auth.service";
import { CurrentUser } from "@api/service/auth/decorator/current-user.decorator";
import { Public } from "@api/service/auth/decorator/is-public.decorator";
import { RequirePermissions } from "@api/service/auth/decorator/require-permissions.decorator";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ChangeUserRoleResponseSchema,
  CreateUpdatePermissionResponseSchema,
  GrantOrRevokeUserPermissionResponseSchema,
  type JwtPayload,
  LoginResponseSchema,
  MeResponseBackendSchema,
  ResetPasswordResponseSchema,
} from "@repo/common/auth.service.type";
import {
  BooleanResponseSchema,
  createPaginatedSchema,
  createSuccessResponseSchema,
  ResponseSuccess,
  StringArrayResponseSchema,
  StringResponseSchema,
} from "@repo/common/common.type";
import { BackendPermissionSchema } from "@repo/common/entity/permission.entity.type";
import {
  BackendRoleSchema,
  type RoleId,
  UpdateRoleResponseSchema,
} from "@repo/common/entity/role.entity.type";
import {
  UserBackendSchema,
  type UserId,
} from "@repo/common/entity/user.entity.type";
import type { Response } from "express";
import { Paginate, type PaginateQuery } from "nestjs-paginate";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post("/login")
  @UseInterceptors(LoginActivityInterceptor)
  @SchemaResponse(LoginResponseSchema)
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(payload);
    response.cookie("access-token", result.data.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: this.configService.getOrThrow("NODE_ENV") === "production",
      path: "/",
    });
    return result;
  }

  @Post("/register")
  @RequirePermissions("create:user")
  @SchemaResponse(StringResponseSchema)
  register(@Body() payload: RegisterUserDto) {
    return this.authService.register(payload);
  }

  @Get("/me")
  @SchemaResponse(MeResponseBackendSchema)
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user.sub);
  }

  @Public()
  @SchemaResponse(BooleanResponseSchema)
  @Post("/logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("access-token", {
      httpOnly: true,
      sameSite: "lax",
      secure: this.configService.getOrThrow("NODE_ENV") === "production",
      path: "/",
    });

    return new ResponseSuccess(true);
  }

  @Get("permission")
  @SchemaResponse(
    createSuccessResponseSchema(createPaginatedSchema(BackendPermissionSchema)),
  )
  @RequirePermissions("read:rbac")
  queryPermissions(@Paginate() query: PaginateQuery) {
    return this.authService.queryPermission(query);
  }

  @Get("role")
  @SchemaResponse(
    createSuccessResponseSchema(createPaginatedSchema(BackendRoleSchema)),
  )
  @RequirePermissions("read:rbac")
  queryRoles(@Paginate() query: PaginateQuery) {
    return this.authService.queryRole(query);
  }

  @Get("user")
  @SchemaResponse(
    createSuccessResponseSchema(
      createPaginatedSchema(UserBackendSchema.omit({ password: true })),
    ),
  )
  @RequirePermissions("read:rbac")
  @UseInterceptors(ClassSerializerInterceptor)
  queryUser(@Paginate() query: PaginateQuery) {
    return this.authService.queryUser(query);
  }

  @Get("user/:id/permissions")
  @RequirePermissions("read:rbac")
  @SchemaResponse(StringArrayResponseSchema)
  getUserPermissions(@Param("id") id: UserId) {
    return this.authService.getUserPermissions(id);
  }

  @Post("role")
  @SchemaResponse(UpdateRoleResponseSchema)
  @RequirePermissions("create:rbac")
  addRole(@Body() data: CreateRoleDto) {
    return this.authService.addRole(data);
  }

  @Put("role/:id")
  @SchemaResponse(UpdateRoleResponseSchema)
  @RequirePermissions("update:rbac")
  updateRole(@Param("id") id: RoleId, @Body() data: UpdateRoleDto) {
    return this.authService.updateRole(id, data);
  }

  @Post("role/:id/delete")
  @SchemaResponse(UpdateRoleResponseSchema)
  @RequirePermissions("delete:rbac")
  deleteRole(@Param("id") id: RoleId) {
    return this.authService.deleteRole(id);
  }

  @Post("role/:id/restore")
  @SchemaResponse(UpdateRoleResponseSchema)
  @RequirePermissions("delete:rbac")
  restoreRole(@Param("id") id: RoleId) {
    return this.authService.restoreRole(id);
  }

  @Get("permission/actions")
  @Public()
  @SchemaResponse(StringArrayResponseSchema)
  getPermissionActions() {
    return this.authService.getPermissionActions();
  }

  @Get("permission/resources")
  @Public()
  @SchemaResponse(StringArrayResponseSchema)
  getPermissionResources() {
    return this.authService.getPermissionResources();
  }

  @Get("permission-list")
  @Public()
  @SchemaResponse(StringArrayResponseSchema)
  getAllAvailablePermissions() {
    return this.authService.getAvailablePermissions();
  }

  @Post("user/role")
  @SchemaResponse(ChangeUserRoleResponseSchema)
  @RequirePermissions("update:rbac")
  changeUserRole(@Body() data: ChangeUserRoleDto) {
    return this.authService.assignRole(data.userId, data.roleId);
  }

  @Post("user/permission/grant")
  @RequirePermissions("update:rbac")
  @SchemaResponse(GrantOrRevokeUserPermissionResponseSchema)
  grantUserpermission(@Body() data: GrantOrRevokeUserPermissionDto) {
    return this.authService.grantPermissionToUser(data.userId, data.string);
  }

  @Post("user/permission/revoke")
  @RequirePermissions("update:rbac")
  @SchemaResponse(GrantOrRevokeUserPermissionResponseSchema)
  revokeUserpermission(@Body() data: GrantOrRevokeUserPermissionDto) {
    return this.authService.revokePermissionFromUser(data.userId, data.string);
  }

  @Post("user/:id/reset-password")
  @RequirePermissions("update:rbac")
  @SchemaResponse(ResetPasswordResponseSchema)
  resetUserPassword(@Param("id") id: UserId) {
    return this.authService.resetPassword(id);
  }

  @Post("user/change-password")
  @SchemaResponse(BooleanResponseSchema)
  changeUserPassword(
    @CurrentUser() user: JwtPayload,
    @Body() data: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.sub, data.password);
  }

  @Post("permission")
  @SchemaResponse(CreateUpdatePermissionResponseSchema)
  createPermission(@Body() data: CreatePermissionDto) {
    return this.authService.createPermission(data);
  }

  @Patch("permission")
  @SchemaResponse(CreateUpdatePermissionResponseSchema)
  updatePermission(@Body() data: UpdatePermissionDto) {
    return this.authService.updatePermission(data);
  }
}
