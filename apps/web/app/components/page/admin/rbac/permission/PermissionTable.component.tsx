"use client";
import { FrontendPermission } from "@repo/common/entity/permission.entity.type";
import Table from "@web/components/native/table/Table";
import { usePermissionQuery } from "@web/libs/hooks/api/auth.api.hooks";
import { ColumnDef } from "@web/libs/table/types";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function PermissionTableComponent() {
  const t = useTranslations("Page.Admin.RBAC.Permission");

  const columns = useMemo<ColumnDef<FrontendPermission>[]>(
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
    ],
    [t],
  );

  return (
    <>
      <Table
        columns={columns}
        urlState={{
          columns: [{ id: "name" }, { id: "displayName" }],
        }}
        queryFn={usePermissionQuery}
        entityName={t("EntityName")}
      />
    </>
  );
}
