import { dayjs } from "@repo/common/util/dayjs";
import type {
  MRT_Cell,
  MRT_Column,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from "material-react-table";
import { ReactNode, RefObject } from "react";

export default function DateCell<T extends MRT_RowData>(props: {
  cell: MRT_Cell<T, unknown>;
  column: MRT_Column<T, unknown>;
  renderedCellValue: ReactNode;
  row: MRT_Row<T>;
  rowRef?: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex?: number;
  table: MRT_TableInstance<T>;
}) {
  return dayjs(props.cell.getValue<string>()).format("DD MMMM YYYY");
}
