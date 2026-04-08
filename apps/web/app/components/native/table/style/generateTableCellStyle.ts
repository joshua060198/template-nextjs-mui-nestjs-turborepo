import { TableCellProps } from "@mui/material";

export default function generateTableCellStyle(
  ...fns: Array<() => TableCellProps>
): TableCellProps {
  const result: TableCellProps = {};
  for (const fn of fns) {
    Object.assign(result, fn());
  }
  return result;
}

export function centeredCell() {
  return { align: "center" } as TableCellProps;
}
