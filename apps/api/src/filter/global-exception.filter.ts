import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { ResponseFailed } from "@repo/common/common.type";
import { Request, Response } from "express";

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const response = exception.getResponse() as ResponseFailed;

    const duration = req.startTime
      ? `${Date.now() - req.startTime}ms`
      : undefined;

    if (exception instanceof NotFoundException) {
      res.status(status).json({
        success: false,
        error: {
          code: "404",
        },
        responseTime: duration,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(status).json({
      success: false,
      error: response.error,
      responseTime: duration,
      timestamp: new Date().toISOString(),
    });
  }
}
