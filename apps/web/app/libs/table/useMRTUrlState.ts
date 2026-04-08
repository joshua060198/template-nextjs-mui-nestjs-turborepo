"use client";

import { dayjs } from "@repo/common/util/dayjs";
import type { MRT_ColumnFiltersState } from "material-react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Column type definitions ──────────────────────────────────────────────────

type ColumnSerializer<T = unknown> = {
  toUrl: (value: T) => string | null;
  fromUrl: (raw: string) => T | null;
};

type AnyColumnSerializer = {
  toUrl: (value: never) => string | null;
  fromUrl: (raw: string) => unknown;
};

const singleDate: ColumnSerializer<ReturnType<typeof dayjs>> = {
  fromUrl: (raw) => {
    const d = dayjs(raw, "YYYY-MM-DD");
    return d.isValid() ? d : null;
  },
  toUrl: (value) =>
    dayjs.isDayjs(value) && value.isValid() ? value.format("YYYY-MM-DD") : null,
};

const dateRange: ColumnSerializer<{
  "0": ReturnType<typeof dayjs> | "";
  "1": ReturnType<typeof dayjs> | "";
}> = {
  fromUrl: (raw) => {
    const [s1, s2] = raw.split(",");
    return {
      "0": s1 && dayjs(s1).isValid() ? dayjs(s1, "YYYY-MM-DD") : "",
      "1": s2 && dayjs(s2).isValid() ? dayjs(s2, "YYYY-MM-DD") : "",
    };
  },
  toUrl: (value) => {
    const v1 = value["0"];
    const v2 = value["1"];
    const s1 = dayjs.isDayjs(v1) && v1.isValid() ? v1.format("YYYY-MM-DD") : "";
    const s2 = dayjs.isDayjs(v2) && v2.isValid() ? v2.format("YYYY-MM-DD") : "";
    const result = s2 ? `${s1},${s2}` : s1;
    return result || null;
  },
};

const text: ColumnSerializer<string> = {
  fromUrl: (raw) => raw,
  toUrl: (value) => value || null,
};

// ─── Column type map ──────────────────────────────────────────────────────────

export type ColumnType = "text" | "singleDate" | "dateRange";

const serializerMap: Record<ColumnType, AnyColumnSerializer> = {
  text: text as AnyColumnSerializer,
  singleDate: singleDate as AnyColumnSerializer,
  dateRange: dateRange as AnyColumnSerializer,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnConfig = {
  id: string;
  type?: ColumnType;
};

export type UseMRTUrlStateOptions = {
  columns: ColumnConfig[];
  debounceMs?: number;
};

type UseMRTUrlStateReturn = {
  columnFilters: MRT_ColumnFiltersState;
  setColumnFilters: React.Dispatch<
    React.SetStateAction<MRT_ColumnFiltersState>
  >;
  resetFilters: () => void;
};

// ─── Helpers (outside hook to avoid re-creation) ─────────────────────────────

const serializeForComparison = (filters: MRT_ColumnFiltersState): string =>
  JSON.stringify(filters, (_key, value) => {
    if (dayjs.isDayjs(value))
      return value.isValid() ? value.format("YYYY-MM-DD") : null;
    return value;
  });

const areFiltersEqual = (
  a: MRT_ColumnFiltersState,
  b: MRT_ColumnFiltersState,
) => serializeForComparison(a) === serializeForComparison(b);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMRTUrlState({
  columns,
  debounceMs = 300,
}: UseMRTUrlStateOptions): UseMRTUrlStateReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFirstRender = useRef(true);
  // Track the last URL string we wrote, so we skip no-op router.replace calls
  const lastWrittenSearch = useRef<string | null>(null);

  const getSerializer = (col: ColumnConfig): AnyColumnSerializer =>
    serializerMap[col.type ?? "text"];

  // ── URL → MRT ──────────────────────────────────────────────────────────────

  const urlToFilters = (params: URLSearchParams): MRT_ColumnFiltersState => {
    return columns.reduce<MRT_ColumnFiltersState>((acc, col) => {
      const raw = params.get(col.id);
      if (!raw) return acc;
      const value = getSerializer(col).fromUrl(raw);
      if (value != null) acc.push({ id: col.id, value });
      return acc;
    }, []);
  };

  // ── MRT → URL ──────────────────────────────────────────────────────────────

  const filtersToUrl = (
    filters: MRT_ColumnFiltersState,
    currentParams: URLSearchParams,
  ): URLSearchParams => {
    const params = new URLSearchParams(currentParams.toString());

    columns.forEach((col) => params.delete(col.id));

    filters.forEach((filter) => {
      const col = columns.find((c) => c.id === filter.id);
      if (!col || filter.value == null || filter.value === "") return;
      const serialized = getSerializer(col).toUrl(filter.value as never);
      if (serialized) params.set(filter.id, serialized);
    });

    return params;
  };

  // ── State ──────────────────────────────────────────────────────────────────

  const initialFilters = useMemo(
    () => urlToFilters(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [columnFilters, setColumnFilters] =
    useState<MRT_ColumnFiltersState>(initialFilters);

  // ── URL → MRT (when searchParams changes externally) ──────────────────────

  useEffect(() => {
    // If this searchParams change was caused by our own router.replace, skip it
    // to avoid the write-back cycle
    if (lastWrittenSearch.current === searchParams.toString()) return;

    const next = urlToFilters(searchParams);
    setColumnFilters((prev) => (areFiltersEqual(prev, next) ? prev : next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ── MRT → URL (debounced) ─────────────────────────────────────────────────

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const params = filtersToUrl(columnFilters, searchParams);
      const nextSearch = params.toString();

      // Skip if the URL would not actually change
      if (nextSearch === searchParams.toString()) return;

      lastWrittenSearch.current = nextSearch;
      router.replace(`?${nextSearch}`, { scroll: false });
    }, debounceMs);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, debounceMs, router]);

  // ── Reset ──────────────────────────────────────────────────────────────────

  const resetFilters = () => {
    setColumnFilters([]);
    lastWrittenSearch.current = "";
    router.replace("?", { scroll: false });
  };

  return { columnFilters, setColumnFilters, resetFilters };
}
