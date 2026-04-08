"use client";
import { FrontendPermission } from "@repo/common/entity/permission.entity.type";
import { FrontendRole } from "@repo/common/entity/role.entity.type";
import { createChipCell } from "@web/components/native/table/cell/ChipCell";
import { createListCell } from "@web/components/native/table/cell/ListCell";
import generateTableCellStyle, {
  centeredCell,
} from "@web/components/native/table/style/generateTableCellStyle";
import Table from "@web/components/native/table/Table";
import AddEditRoleForm from "@web/components/page/admin/rbac/role/AddEditRole.form";
import {
  useDeleteRole,
  useRestoreRole,
  useRoleQuery,
} from "@web/libs/hooks/api/auth.api.hooks";
import { ColumnDef } from "@web/libs/table/types";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function RoleTableComponent() {
  const t = useTranslations("Page.Admin.RBAC.Role");
  const permissionCell = createListCell<FrontendRole, FrontendPermission>({
    getItems: (rowData) => rowData.permissions,
    getItemLabel: (row, value) => value.displayName,
    getItemId: (row, value) => `${row.id}:${value.id}`,
  });
  const roleStatusCell = createChipCell<
    FrontendRole,
    FrontendRole["deletedAt"]
  >({
    getLabel: (value) =>
      value === null ? t("Table.Status.Active") : t("Table.Status.Inactive"),
    getColor: (value) => (value === null ? "success" : "error"),
  });

  const isSystemCell = createChipCell<FrontendRole, FrontendRole["isSystem"]>({
    getLabel: (value) => (value ? t("Table.System.Yes") : t("Table.System.No")),
    getColor: (value) => (value ? "error" : "default"),
  });

  const columns = useMemo<ColumnDef<FrontendRole>[]>(
    () => [
      {
        accessorKey: "name",
        grow: true,
        minSize: 200,
        header: t("Table.Name.Header"),
      },
      {
        accessorKey: "displayName",
        grow: true,
        minSize: 200,
        header: t("Table.DisplayName.Header"),
      },
      {
        accessorKey: "permissions",
        grow: true,
        minSize: 200,
        header: t("Table.Permission.Header"),
        Cell: permissionCell,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "isSystem",
        header: t("Table.System.Header"),
        Cell: isSystemCell,
        muiTableBodyCellProps: generateTableCellStyle(centeredCell),
        filterVariant: "checkbox",
        meta: {
          filterStrategy: "eq",
        },
      },
      {
        accessorKey: "deletedAt",
        header: t("Table.Status.Header"),
        Cell: roleStatusCell,
        muiTableBodyCellProps: generateTableCellStyle(centeredCell),
        filterVariant: "checkbox",
        meta: {
          filterStrategy: "null_toggle",
        },
      },
    ],
    [t, permissionCell, roleStatusCell, isSystemCell],
  );

  const { mutateAsync: deleteRole } = useDeleteRole();
  const { mutateAsync: restoreRole } = useRestoreRole();

  return (
    <>
      <Table
        columns={columns}
        urlState={{
          columns: [
            { id: "name" },
            { id: "displayName" },
            { id: "deletedAt" },
            { id: "isSystem" },
          ],
        }}
        queryFn={useRoleQuery}
        entityName={t("EntityName")}
        deleteHandler={{
          fn: deleteRole,
          restoreFn: restoreRole,
          getDialogContent: (row: FrontendRole) => row.displayName,
          shouldShow: (row: FrontendRole) => !row.isSystem,
        }}
        addForm={{
          FormComponent: AddEditRoleForm,
        }}
        editForm={{
          FormComponent: AddEditRoleForm,
        }}
      />
    </>
  );
}
