import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

export const JwtToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    if (req.cookies) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accessTokenCookies = req.cookies["access-token"] as string;
      if (!accessTokenCookies) {
        throw new UnauthorizedException("Missing access-token in cookie!");
      }

      return accessTokenCookies;
    }

    throw new UnauthorizedException("Missing access-token in cookie!");
  },
);
