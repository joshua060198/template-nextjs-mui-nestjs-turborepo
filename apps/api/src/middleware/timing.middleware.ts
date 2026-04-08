import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      startTime?: number;
    }
  }
}
@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    req.startTime = Date.now();
    next();
  }
}
