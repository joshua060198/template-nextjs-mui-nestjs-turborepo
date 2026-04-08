import { SetMetadata } from "@nestjs/common";

export const SKIP_RESPONSE_INTERCEPTOR = "skip_response_interceptor";
export const SkipResponseInterceptor = () =>
  SetMetadata(SKIP_RESPONSE_INTERCEPTOR, true);
