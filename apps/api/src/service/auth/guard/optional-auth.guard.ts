import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtHttpAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user) {
    // ignore errors & allow unauthenticated
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user ?? null;
  }
}
