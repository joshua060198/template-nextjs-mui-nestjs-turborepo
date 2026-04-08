import { applyFilter } from "@web/libs/table/filter-strategies";
import "@web/libs/table/types"; // 👈 force TypeScript to include the augmentation
import { ColumnDef, useQueryParams } from "@web/libs/table/types";

export type QueryParamsType = { sortBy?: string[] } & Record<string, string>;

export default function useQueryParamParser<
  TData extends Record<string, unknown>,
>({
  withDeleted = true,
  globalFilter,
  columnFilters,
  pagination,
  sorting,
  columns, // <-- new
}: useQueryParams & { columns: ColumnDef<TData>[] }) {
  const queryParams: QueryParamsType = {};

  queryParams["limit"] = pagination.pageSize.toString();
  queryParams["page"] = (pagination.pageIndex + 1).toString();
  queryParams["search"] = globalFilter;
  queryParams["withDeleted"] = withDeleted.toString();

  // Build a strategy lookup from column defs
  const strategyMap = Object.fromEntries(
    columns
      .filter((col) => col.meta?.filterStrategy && col.id)
      .map((col) => [col.id!, col.meta?.filterStrategy]),
  );

  for (const filter of columnFilters) {
    const strategy =
      strategyMap[filter.id] ?? (filter.id.endsWith("id") ? "eq" : "ilike");
    applyFilter(queryParams, filter.id, filter.value, strategy);
  }

  for (const sort of sorting) {
    const entry = `${sort.id}:${sort.desc ? "DESC" : "ASC"}`;
    if (queryParams.sortBy) {
      queryParams.sortBy.push(entry);
    } else {
      queryParams.sortBy = [entry];
    }
  }

  return queryParams;
}
