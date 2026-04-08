import type { RowData } from "@tanstack/react-table";
import { FilterStrategy } from "@web/libs/table/filter-strategies";
import "@tanstack/react-table";
import type { MRT_ColumnDef } from "material-react-table";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";

// Extend MRT's column def with your own meta shape
export type ColumnDef<TData extends Record<string, unknown>> = Omit<
  MRT_ColumnDef<TData>,
  "meta"
> & {
  meta?: {
    filterStrategy?: FilterStrategy;
  };
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterStrategy?: FilterStrategy;
  }
}

export interface useQueryParams {
  columnFilters: MRT_ColumnFiltersState;
  globalFilter: string;
  sorting: MRT_SortingState;
  pagination: MRT_PaginationState;
  withDeleted?: boolean;
}
