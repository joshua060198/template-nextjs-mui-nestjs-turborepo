import { SKIP_RESPONSE_INTERCEPTOR } from "@api/decorator/skip-response-interceptor.decorator";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ResponseSuccess } from "@repo/common/common.type";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.get<boolean>(
      SKIP_RESPONSE_INTERCEPTOR,
      context.getHandler(),
    );

    if (skip) {
      return next.handle();
    }

    const now = Date.now(); // Start time before the handler executes

    return next.handle().pipe(
      map((data: ResponseSuccess<unknown>) => {
        // This runs when the response is about to be sent to the client
        const responseTime = Date.now() - now;

        // Transform the response body to include the duration
        return {
          success: true,
          data: data.data,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
