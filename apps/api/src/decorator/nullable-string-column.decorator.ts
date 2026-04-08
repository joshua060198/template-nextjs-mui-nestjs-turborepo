import { Column, ColumnOptions } from "typeorm";

export function NullableStringColumn(
  options: ColumnOptions = {},
): PropertyDecorator {
  return Column({
    type: "varchar",
    nullable: true,
    ...options,
  });
}
