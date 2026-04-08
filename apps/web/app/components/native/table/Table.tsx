"use no memo";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { PaginatedResponse } from "@repo/common/common.type";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  ClearFilterIcon,
  DeleteIcon,
  RestoreIcon,
} from "@web/components/IconCollection";
import TableAdd, {
  type TableAddProps,
} from "@web/components/native/table/TableAdd";
import TableEdit, {
  type TableEditProps,
} from "@web/components/native/table/TableEdit";
import { useDialog } from "@web/libs/hooks/useDialog.hooks";
import "@web/libs/table/types";
import {
  useMRTUrlState,
  type UseMRTUrlStateOptions,
} from "@web/libs/table/useMRTUrlState";
import useQueryParamParser, {
  QueryParamsType,
} from "@web/libs/table/useQueryParamParser";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_RowData,
  type MRT_SortingState,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_ID } from "material-react-table/locales/id";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface TableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  urlState: UseMRTUrlStateOptions;
  queryFn: (
    params: QueryParamsType,
  ) => UseQueryResult<PaginatedResponse<T>, Error>;
  entityName: string;
  addForm?: Omit<TableAddProps, "entityName">;
  editForm?: Omit<TableEditProps<T>, "entityName" | "item">;
  deleteHandler?: {
    fn: (id: T["id"]) => void;
    getDialogContent: (row: T) => string;
    getId?: (row: T) => string;
    restoreFn?: (id: T["id"]) => void;
    shouldShow?: (row: T) => boolean;
  };
  customRowActions?: MRT_TableOptions<T>["renderRowActions"];
}

const tableLocale = {
  id: MRT_Localization_ID,
  en: MRT_Localization_EN,
};

export default function Table<T extends MRT_RowData>({
  columns,
  urlState,
  queryFn,
  addForm,
  deleteHandler,
  editForm,
  entityName,
  customRowActions,
}: TableProps<T>) {
  const t = useTranslations("Global.Component.Table");
  const locale = useLocale();
  const { columnFilters, setColumnFilters, resetFilters } =
    useMRTUrlState(urlState);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { dialogConfirm } = useDialog();

  const queryParams = useQueryParamParser({
    sorting,
    globalFilter,
    columnFilters,
    pagination,
    columns,
  });

  const {
    data: { data = [], meta } = {},
    isLoading,
    isError,
    isFetching,
    refetch,
  } = queryFn(queryParams);

  const table = useMaterialReactTable({
    data,
    columns,
    initialState: {
      showColumnFilters: true,
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: t("LoadError"),
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalItems ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    renderTopToolbarCustomActions: () => (
      <Box
        display="flex"
        justifyContent="space-between"
        flex={1}
        id="custom_table_top_toolbar"
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            columnGap: { xs: 1, sm: 3 },
          }}
        >
          <Tooltip
            title={t("RefetchData")}
            sx={{ display: { xs: "inherit", sm: "none" } }}
          >
            <IconButton color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            sx={{ display: { xs: "none", sm: "inherit" } }}
            variant="outlined"
            color="primary"
            onClick={() => refetch()}
            startIcon={<RefreshIcon />}
          >
            Muat Ulang Data
          </Button>
          {addForm !== undefined ? (
            <TableAdd {...addForm} entityName={entityName} />
          ) : null}
        </Box>
        <Tooltip title={t("Toolbar.ClearFilter")}>
          <IconButton onClick={resetFilters}>
            <ClearFilterIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableBodyCellProps: () => ({
      sx: {
        borderBottomColor: (theme) => theme.palette.divider, // A light gray border for dark mode
      },
    }),
    enableStickyHeader: true,
    enableStickyFooter: true,
    muiTableContainerProps: {
      sx: {
        maxHeight: {
          xs: "calc(100vh - 400px)",
          sm: "calc(100vh - 325px)",
          md: "calc(100vh - 270px)",
          xl: "calc(100vh - 132px)",
        },
        maxWidth: {
          xs: "calc(100vw - 42px)",
        },
      },
    },
    layoutMode: "grid",
    enableRowNumbers: true,
    enableRowActions:
      editForm !== undefined ||
      deleteHandler !== undefined ||
      customRowActions !== undefined,
    positionActionsColumn: "last",
    renderRowActions: ({ row, ...params }) => (
      <Box width="100%">
        {editForm !== undefined && (
          <TableEdit
            {...editForm}
            entityName={entityName}
            item={row.original}
          />
        )}
        {row.original.deletedAt === null && deleteHandler !== undefined ? (
          deleteHandler.shouldShow === undefined ||
          deleteHandler.shouldShow(row.original) ? (
            <Tooltip title={t("Delete.Title")}>
              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  dialogConfirm({
                    title: t("Delete.DialogTitle", {
                      name: entityName,
                    }),
                    content: t("Delete.DialogContent", {
                      data: deleteHandler.getDialogContent(row.original),
                    }),
                    onPositive: () =>
                      deleteHandler.fn(
                        deleteHandler.getId
                          ? deleteHandler.getId(row.original)
                          : row.original.id,
                      ),
                  })
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : undefined
        ) : undefined}
        {row.original.deletedAt !== null &&
        deleteHandler !== undefined &&
        deleteHandler.restoreFn !== undefined ? (
          deleteHandler.shouldShow === undefined ||
          deleteHandler.shouldShow(row.original) ? (
            <Tooltip title={t("Restore.Title")}>
              <IconButton
                size="small"
                color="secondary"
                onClick={() =>
                  dialogConfirm({
                    title: t("Restore.DialogTitle", {
                      name: entityName,
                    }),
                    content: t("Restore.DialogContent", {
                      data: deleteHandler.getDialogContent(row.original),
                    }),
                    onPositive: () =>
                      deleteHandler.restoreFn!(
                        deleteHandler.getId
                          ? deleteHandler.getId(row.original)
                          : row.original.id,
                      ),
                  })
                }
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : undefined
        ) : undefined}
        {customRowActions ? customRowActions({ row, ...params }) : undefined}
      </Box>
    ),
    displayColumnDefOptions: {
      "mrt-row-actions": {
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          sx: {
            "& *": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            borderBottomColor: (theme) => theme.palette.divider,
          },
        },
        size: 100,
        grow: false,
      },
    },
    localization: tableLocale[locale as "id" | "en"],
    muiFilterTextFieldProps: ({ column, rangeFilterIndex }) => {
      if (
        column.columnDef.filterVariant === "date-range" ||
        column.columnDef.filterVariant === "datetime-range"
      ) {
        return {
          slotProps: {
            input: {
              startAdornment: (
                <Typography sx={{ mr: 1, width: "50px" }} variant="caption">
                  {rangeFilterIndex === 0
                    ? t("TextFieldProps.From")
                    : t("TextFieldProps.To")}
                </Typography>
              ),
            },
          },
          size: "medium",
          sx: {
            fontSize: "0.25rem",
            "& .MuiInputAdornment-positionEnd svg": {
              fontSize: "1.2rem",
            },
          },
        };
      }
      return {};
    },
    muiTableHeadCellProps: {
      sx: {
        justifyContent: "flex-start",
      },
    },
    muiTableHeadProps: {
      sx: {
        "& .MuiCollapse-wrapperInner>.MuiBox-root": {
          display: "flex",
          flexDirection: "column",
          rowGap: "0.25rem",
        },
      },
    },
    muiTablePaperProps: {
      sx: {
        borderRadius: 3,
      },
    },
  });
  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
}
