import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { MRT_Cell, MRT_Row, MRT_TableInstance } from "material-react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ListCellConfig<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  getItems?: (row: TData) => TValue[];
  getItemLabel?: (row: TData, value: TValue) => string;
  getItemId?: (row: TData, value: TValue) => string;
}

interface CellProps<TData extends Record<string, unknown>> {
  cell: MRT_Cell<TData>;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

// --- Factory Function ---

export function createListCell<
  TData extends Record<string, unknown>,
  TValue = unknown,
>(config: ListCellConfig<TData, TValue> = {}) {
  const {
    getItems = (value) => [String(value ?? "")],
    getItemId = (row, value) => String(value ?? ""),
    getItemLabel = (row, value) => String(value ?? ""),
  } = config;

  // Returns the function that MRT expects for the `Cell` prop
  return function ListCell({ cell, row }: CellProps<TData>) {
    const rowData = row.original;

    const items = getItems(rowData);

    const t = useTranslations("Global.Component.Table.Cell.ListCell");
    const [show, setShow] = useState(false);

    if (items.length === 0) {
      return (
        <Typography variant="body2" fontStyle="italic">
          {t("Empty")}
        </Typography>
      );
    }

    return (
      <Box>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? t("Hide") : t("Show")}
        </Button>
        {show && (
          <ul style={{ marginTop: "8px", marginBottom: "0px" }}>
            {items.map((item) => {
              const id = getItemId(rowData, item as TValue);
              const label = getItemLabel(rowData, item as TValue);
              return <li key={id}>{label}</li>;
            })}
          </ul>
        )}
      </Box>
    );
  };
}
