import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class RequestContextService {
  private request!: Request;

  setRequest(req: Request) {
    this.request = req;
  }

  getRequest(): Request {
    return this.request;
  }
}
