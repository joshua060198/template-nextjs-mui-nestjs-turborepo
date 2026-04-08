import { LoginActivityService } from "@api/database/service/login-activity.service";
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import {
  LoginResponse,
  UnauthorizedError,
} from "@repo/common/auth.service.type";
import { FailedResponse, ResponseSuccess } from "@repo/common/common.type";
import { InsertLoginActivity } from "@repo/common/entity/login-activity.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import { Request } from "express";
import { Observable, tap } from "rxjs";
import { UAParser } from "ua-parser-js";

function extractClientIp(req: Request): string {
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string") return cfIp;

  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string") {
    const result = xff.split(",")[0];
    if (result) return result;
  }

  return req.socket.remoteAddress ?? "";
}

function normalizeIp(ip: string): string {
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
}

@Injectable()
export class LoginActivityInterceptor implements NestInterceptor {
  constructor(private readonly service: LoginActivityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const ipRaw = extractClientIp(req);
    const ip = normalizeIp(ipRaw);
    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();
    const osArr = [ua.os.name, ua.os.version].filter((v) => v !== undefined);
    const os = osArr.length > 0 ? osArr.join(" - ") : null;
    const deviceArr = [
      ua.device.type,
      ua.device.model,
      ua.device.vendor,
    ].filter((v) => v !== undefined);
    const device = deviceArr.length > 0 ? deviceArr.join(" - ") : null;
    const tempData: InsertLoginActivity = {
      ip,
      userAgent: ua.ua,
      browser: ua.browser.name,
      browserVersion: ua.browser.version,
      os,
      device,
      isSuccess: false,
      userId: "" as UserId,
    };
    return next.handle().pipe(
      tap({
        next: (result: ResponseSuccess<LoginResponse>) => {
          tempData.isSuccess = true;
          tempData.userId = result.data.sub;
          void this.service.logActivity(tempData);
        },
        error: (err) => {
          tempData.isSuccess = false;
          console.log(err);
          const temp = (err as HttpException).getResponse() as FailedResponse;

          if (UnauthorizedError.isErrorMatch(temp.error)) {
            tempData.userId = (temp.error as UnauthorizedError).sub as UserId;
            void this.service.logActivity(tempData);
          }
        },
      }),
    );
  }
}
