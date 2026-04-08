import Link from "@web/components/native/Link";
import { MRT_Cell, MRT_Row, MRT_TableInstance } from "material-react-table";

interface LinkCellConfig<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  /** Transform the raw cell value into a display label */
  getLabel?: (value: TValue, row: TData) => string;
  /** Resolve the MUI Chip color from the value */
  constructLink?: (value: TValue, row: TData) => string;
}

interface CellProps<TData extends Record<string, unknown>> {
  cell: MRT_Cell<TData>;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

// --- Factory Function ---

export function createLinkCell<
  TData extends Record<string, unknown>,
  TValue = unknown,
>(config: LinkCellConfig<TData, TValue> = {}) {
  const {
    getLabel = (value) => String(value ?? ""),
    constructLink = (value) => String(value ?? ""),
  } = config;

  // Returns the function that MRT expects for the `Cell` prop
  return function LinkCell({ cell, row }: CellProps<TData>) {
    const value = cell.getValue<TValue>();
    const rowData = row.original;

    const label = getLabel(value, rowData);
    const link = constructLink(value, rowData);

    return <Link href={link}>{label}</Link>;
  };
}
