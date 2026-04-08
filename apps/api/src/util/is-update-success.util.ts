import { UpdateResult } from "typeorm";

export default function isDatabaseUpdateSuccess(
  result: UpdateResult,
  checkFn?: (result: UpdateResult) => boolean,
) {
  if (checkFn) {
    return (
      result.affected !== undefined && result.affected > 0 && checkFn(result)
    );
  }
  return result.affected !== undefined && result.affected > 0;
}
