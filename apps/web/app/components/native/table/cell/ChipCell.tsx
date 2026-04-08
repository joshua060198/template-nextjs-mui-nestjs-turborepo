// chipCellRenderer.tsx
import { Chip } from "@mui/material";
import { MRT_Cell, MRT_Row, MRT_TableInstance } from "material-react-table";

// --- Types ---

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

interface ChipCellConfig<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  /** Transform the raw cell value into a display label */
  getLabel?: (value: TValue, row: TData) => string;
  /** Resolve the MUI Chip color from the value */
  getColor?: (value: TValue, row: TData) => ChipColor;
  /** Optionally resolve a custom hex/CSS color (overrides getColor) */
  getCustomColor?: (value: TValue, row: TData) => string | undefined;
  /** MUI Chip variant */
  variant?: "filled" | "outlined";
  /** MUI Chip size */
  size?: "small" | "medium";
}

interface CellProps<TData extends Record<string, unknown>> {
  cell: MRT_Cell<TData>;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

// --- Factory Function ---

export function createChipCell<
  TData extends Record<string, unknown>,
  TValue = unknown,
>(config: ChipCellConfig<TData, TValue> = {}) {
  const {
    getLabel = (value) => String(value ?? ""),
    getColor = () => "default",
    getCustomColor,
    variant = "filled",
    size = "small",
  } = config;

  // Returns the function that MRT expects for the `Cell` prop
  return function ChipCell({ cell, row }: CellProps<TData>) {
    const value = cell.getValue<TValue>();
    const rowData = row.original;

    const label = getLabel(value, rowData);
    const chipColor = getColor(value, rowData);
    const customColor = getCustomColor?.(value, rowData);

    return (
      <Chip
        label={label}
        color={customColor ? "default" : chipColor}
        variant={variant}
        size={size}
        sx={
          customColor
            ? {
                backgroundColor: customColor,
                color: "#fff",
                fontWeight: 500,
              }
            : { fontWeight: 500 }
        }
      />
    );
  };
}
