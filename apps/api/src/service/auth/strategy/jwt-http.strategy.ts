import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { JwtPayload } from "@repo/common/auth.service.type";
import { Request } from "express";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";

const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies["access-token"] as string;
  }
  return null;
};

@Injectable()
export class JwtHttpStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject()
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
