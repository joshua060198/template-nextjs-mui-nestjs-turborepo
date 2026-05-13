"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { UserFrontend } from "@repo/common/entity/user.entity.type";
import { EditIcon, LockResetIcon } from "@web/components/IconCollection";
import EmptyCell from "@web/components/native/table/cell/EmptyCell";
import { createLinkCell } from "@web/components/native/table/cell/LinkCell";
import generateTableCellStyle, {
  centeredCell,
} from "@web/components/native/table/style/generateTableCellStyle";
import Table from "@web/components/native/table/Table";
import AddUserForm from "@web/components/page/admin/rbac/user-management/form/AddUser.form";
import EditPermissionForm from "@web/components/page/admin/rbac/user-management/form/EditPermission.form";
import {
  useAuth,
  useForceResetPassword,
  useRoleQuery,
  useUserQuery,
} from "@web/libs/hooks/api/auth.api.hooks";
import { useDialog } from "@web/libs/hooks/useDialog.hooks";
import { ColumnDef } from "@web/libs/table/types";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function UserManagementTableComponent() {
  const { data: { id } = {} } = useAuth({
    select: (data) => ({ resetPassword: data.resetPassword, id: data.id }),
  });
  const t = useTranslations("Page.Admin.RBAC.UserManagement");
  const roleCell = createLinkCell<UserFrontend>({
    constructLink: (val, rowData) =>
      `/admin/rbac/role?name=${rowData.role.name}`,
  });
  const { dialogConfirm } = useDialog();

  const { data: { data: roles = [] } = {} } = useRoleQuery();

  const columns = useMemo<ColumnDef<UserFrontend>[]>(
    () => [
      {
        accessorKey: "username",
        grow: true,
        minSize: 200,
        header: t("Table.Username.Header"),
      },
      {
        accessorKey: "fullName",
        grow: true,
        minSize: 200,
        header: t("Table.FullName.Header"),
      },
      {
        accessorKey: "email",
        grow: true,
        minSize: 200,
        header: t("Table.Email.Header"),
        Cell: EmptyCell,
        muiTableBodyCellProps: generateTableCellStyle(centeredCell),
      },
      {
        accessorFn: (row) => row.role.displayName,
        id: "role.id",
        header: t("Table.Role.Header"),
        grow: false,
        size: 150,
        muiTableBodyCellProps: generateTableCellStyle(centeredCell),
        Cell: roleCell,
        meta: {
          filterStrategy: "eq",
        },
        filterVariant: "select",
        filterSelectOptions: roles.map((role) => ({
          value: role.id,
          label: role.displayName,
        })),
        enableSorting: false,
      },
    ],
    [t, roleCell, roles],
  );

  const { mutateAsync: resetPassword } = useForceResetPassword();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFrontend>();
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Table
        columns={columns}
        urlState={{
          columns: [
            { id: "username" },
            { id: "email" },
            { id: "fullName" },
            { id: "role.id" },
          ],
        }}
        queryFn={useUserQuery}
        entityName={t("EntityName")}
        addForm={{
          FormComponent: AddUserForm,
        }}
        customRowActions={({ row }) => {
          return (
            <>
              <Tooltip title={t("Table.ResetPassword.Label")}>
                <IconButton
                  onClick={() =>
                    dialogConfirm({
                      title: t("Table.ResetPassword.DialogTitle"),
                      content: t("Table.ResetPassword.DialogContent", {
                        user: row.original.username,
                      }),
                      onPositive: async () => {
                        await resetPassword(row.original.id);
                      },
                    })
                  }
                  color="warning"
                  size="small"
                >
                  <LockResetIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("Form.Permissions.Title")}>
                <IconButton
                  disabled={row.original.id === id}
                  color="secondary"
                  onClick={() => {
                    setSelectedUser(row.original);
                    openModal();
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          );
        }}
      />
      <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t("Form.Permissions.FormTitle", {
            user: selectedUser?.fullName ?? "",
          })}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {selectedUser && (
              <EditPermissionForm selectedUser={selectedUser.id} />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} variant="outlined">
            {t("Form.Permissions.Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
