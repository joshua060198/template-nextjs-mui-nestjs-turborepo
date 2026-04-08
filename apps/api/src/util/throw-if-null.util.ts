import { InternalServerErrorException } from "@nestjs/common";
import { ErrorCode, ResponseFailed } from "@repo/common/common.type";

export default function throwIfNull<T>(data: T | null, error: ErrorCode) {
  if (data === null) {
    throw new InternalServerErrorException(new ResponseFailed(error));
  }
}
