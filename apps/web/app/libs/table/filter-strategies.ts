import { dayjs } from "@repo/common/util/dayjs";

export type FilterStrategy =
  | "ilike"
  | "eq"
  | "null_toggle"
  | "date_eq"
  | "date_range"
  | "date_range_safe"
  | "null_sentinel";

export function applyFilter(
  queryParams: Record<string, string | string[]>,
  id: string,
  value: unknown,
  strategy: FilterStrategy = "ilike",
  now = dayjs(),
): void {
  const filterKey = `filter.${id}`;

  if (value === "__NULL__") {
    queryParams[filterKey] = "$null";
    return;
  }

  switch (strategy) {
    case "null_toggle":
      queryParams[filterKey] = value === "false" ? "$not:$null" : "$null";
      break;

    case "date_eq": {
      const date = dayjs(value as Date);
      if (date.isValid()) {
        queryParams[filterKey] = `$eq:${date.format("YYYY-MM-DD")}`;
      }
      break;
    }

    case "date_range": {
      const raw = value as Record<string, unknown>;
      const result: string[] = [];

      function insertToQuery(item: unknown, operation: "gte" | "lte") {
        if (dayjs.isDayjs(item)) {
          if (item.isValid()) {
            result.push(`$${operation}:${item.format("YYYY-MM-DD")}`);
          }
        }
      }

      insertToQuery(raw[0], "gte");
      insertToQuery(raw[1], "lte");

      queryParams[filterKey] = result;
      break;
    }

    case "date_range_safe": {
      const raw = value as Record<string, unknown>;
      const fallbackStart = now.subtract(dayjs.duration({ months: 1 }));
      const d1 =
        dayjs.isDayjs(raw[0]) && raw[0].isValid() ? raw[0] : fallbackStart;
      const d2 = dayjs.isDayjs(raw[1]) && raw[1].isValid() ? raw[1] : now;
      queryParams[filterKey] =
        `$btw:${d1.format("YYYY-MM-DD")},${d2.format("YYYY-MM-DD")}`;
      break;
    }

    case "eq":
      queryParams[filterKey] = `$eq:${value}`;
      break;

    case "ilike":
    default:
      queryParams[filterKey] = `$ilike:${value}`;
      break;
  }
}
