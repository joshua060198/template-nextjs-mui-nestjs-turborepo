import { ValueTransformer } from "typeorm";
import { Bytes } from "@repo/common/entity/file.entity.type";

export class StringToBytesTransformer implements ValueTransformer {
  from(databaseValue: string | null): Bytes {
    if (databaseValue == null) return 0 as Bytes;
    return parseInt(databaseValue, 10) as Bytes;
  }

  to(entityValue: Bytes | undefined): string | undefined {
    if (entityValue === undefined) {
      return undefined;
    }

    return entityValue.toString();
  }
}
