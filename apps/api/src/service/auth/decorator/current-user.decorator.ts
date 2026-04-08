import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "@repo/common/auth.service.type";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (request as any).user as JwtPayload;
  },
);
