import { RBACService } from "@api/database/service/rbac.service";
import { IS_PUBLIC_KEY } from "@api/service/auth/decorator/is-public.decorator";
import { PERMISSIONS_KEY } from "@api/service/auth/decorator/require-permissions.decorator";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "@repo/common/auth.service.type";
import { GENERAL_ERROR, ResponseFailed } from "@repo/common/common.type";
import { getActionResourceFromPermissionString } from "@repo/common/util/permission";
import { Request } from "express";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RBACService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const payload = (request as any).user as JwtPayload;

    const userPermissions = await this.rbacService.getUserPermissions(
      payload.sub,
    );

    if (userPermissions.includes("manage:system")) return true;

    const passed = requiredPermissions.every((p) => {
      const { action, resource } = getActionResourceFromPermissionString(p);
      if (!action || !resource) return false;
      else {
        return (
          userPermissions.includes(`${action}:${resource}`) ||
          userPermissions.includes(`manage:${resource}`)
        );
      }
    });

    if (!passed) {
      throw new ForbiddenException(
        new ResponseFailed(GENERAL_ERROR.FORBIDDEN_ERROR),
      );
    }

    return true;
  }
}
