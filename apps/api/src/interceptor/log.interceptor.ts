import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP", { timestamp: true });

  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logByContext(context, now);
        },
        error: (err) => {
          // You can also access the error object here if needed
          this.logByContext(context, now, err);
        },
      }),
    );
  }

  private logByContext(
    context: ExecutionContext,
    startTime: number,
    err?: unknown,
  ) {
    const delay = Date.now() - startTime;

    if (context.getType() === "http") {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const { method, url } = request;

      // Note: In case of error, response.statusCode might still be the default (e.g. 200)
      // because the Global Exception Filter hasn't modified it yet.
      if (err) {
        this.logger.log(`${method} ${url} ${JSON.stringify(err)} +${delay}ms`);
      } else {
        this.logger.log(`${method} ${url} ${response.statusCode} +${delay}ms`);
      }
    } else {
      this.logger.log(`UNKNOWN TYPE!! ${context.getType()}`);
    }
    // else if (context.getType() === 'rpc') {
    //   const rpcContext = context.switchToRpc();
    //   const data = rpcContext.getData<unknown>();
    //   const pattern = context.getHandler().name;
    //
    //   const sanitizedData = JSON.stringify(data).replace(
    //     /"password":\s*"[^"]*"/g,
    //     `"password":"******"`,
    //   );
    //
    //   if (err) {
    //     if (!(err instanceof RpcException)) {
    //       console.log('ERROR', err);
    //       this.logger.error('ERROR IS NOT RCP EXCEPTION! PLEASE CHECK!!');
    //     }
    //     this.logger.log(
    //       `Pattern: [${pattern}] | Payload: ${sanitizedData} | error: ${JSON.stringify((err as RpcException).getError())} | +${delay}ms`,
    //     );
    //   } else {
    //     this.logger.log(
    //       `Pattern: [${pattern}] | Payload: ${sanitizedData} | +${delay}ms`,
    //     );
    //   }
    // }
  }
}
