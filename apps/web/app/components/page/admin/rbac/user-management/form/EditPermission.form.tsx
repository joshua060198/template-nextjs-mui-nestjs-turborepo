import { Divider, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import {
  PermissionAction,
  PermissionResource,
} from "@repo/common/entity/permission.entity.type";
import { UserId } from "@repo/common/entity/user.entity.type";
import { Checkbox } from "@web/components/native/form/Checkbox";
import {
  useGrantUserPermission,
  usePermissionActions,
  usePermissionResources,
  useRevokeUserPermission,
  useUserPermissions,
} from "@web/libs/hooks/api/auth.api.hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface PermissionGroup {
  resource: PermissionResource;
  actions: Record<PermissionAction, boolean>;
}

/**
 * Parse flat permission list into grouped structure
 * e.g., ['manage:user', 'create:file', 'view:file'] =>
 * { user: { manage: true, actions: {...} }, file: { manage: false, actions: {...} } }
 */
const parsePermissions = (
  permissions: string[],
): Record<PermissionResource, PermissionGroup> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const groups: Record<PermissionResource, PermissionGroup> = {};

  permissions.forEach((perm) => {
    const splittedPerm = perm.split(":");
    const action = splittedPerm[0] as PermissionAction;
    const resource = splittedPerm[1] as PermissionResource;

    if (!resource) return;

    if (perm === "open:admin_page" || perm === "manage:system") {
      groups[resource] = {
        resource,
        actions: {
          manage: true,
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      };
    } else {
      if (!groups[resource]) {
        groups[resource] = {
          resource,
          actions: {
            manage: false,
            create: false,
            read: false,
            update: false,
            delete: false,
          },
        };
      }

      if (action in groups[resource].actions) {
        groups[resource].actions[action] = true;
      }
    }
  });

  return groups;
};

/**
 * Convert grouped structure back to flat permission list
 */
const flattenPermissions = (
  groups: Record<PermissionResource, PermissionGroup>,
): string[] => {
  const permissions: string[] = [];

  Object.values(groups).forEach(({ resource, actions }) => {
    if (resource === ("system" as PermissionResource)) {
      if (actions.manage) permissions.push("manage:system");
    } else if (resource === ("admin_page" as PermissionResource)) {
      if (actions.manage) permissions.push("open:admin_page");
    } else {
      if (actions.manage) {
        permissions.push(`${PermissionAction.MANAGE}:${resource}`);
      } else {
        if (actions.create)
          permissions.push(`${PermissionAction.CREATE}:${resource}`);
        if (actions.read)
          permissions.push(`${PermissionAction.READ}:${resource}`);
        if (actions.update)
          permissions.push(`${PermissionAction.UPDATE}:${resource}`);
        if (actions.delete)
          permissions.push(`${PermissionAction.DELETE}:${resource}`);
      }
    }
  });

  return permissions;
};

export default function EditPermissionForm({
  selectedUser,
}: {
  selectedUser: UserId;
}) {
  const { data } = useUserPermissions(selectedUser);
  const { data: resourceList } = usePermissionResources();
  const { data: actionList } = usePermissionActions();
  const t = useTranslations("Page.Admin.RBAC.UserManagement.Form.Permissions");

  const [permissionGroups, setPermissionGroups] = useState<
    Record<PermissionResource, PermissionGroup>
  >(() => parsePermissions(data ?? []));

  const { mutate: revoke, isPending: loadingRevoke } =
    useRevokeUserPermission();

  const { mutate: grant, isPending: loadingGrant } = useGrantUserPermission();

  useEffect(() => {
    setPermissionGroups(parsePermissions(data ?? []));
  }, [data]);

  console.log(permissionGroups);
  return (
    <>
      <Typography variant="body2" color="textSecondary">
        Override specific permissions from the user's role. Selecting "manage"
        grants all actions (create, view, update, delete) for that resource.
      </Typography>

      <Box key="open_admin_page">
        <Stack spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                color: "textPrimary",
              }}
            >
              {t(`OpenAdmin`)}
            </Typography>
          </Box>

          {/* Manage Permission */}
          <Checkbox
            onChange={(e, checked) => {
              setPermissionGroups((prev) => {
                const newData = { ...prev };
                if (newData["admin_page" as PermissionResource]) {
                  newData["admin_page" as PermissionResource].actions.manage =
                    checked;
                } else {
                  newData["admin_page" as PermissionResource] = {
                    resource: "admin_page" as PermissionResource,
                    actions: {
                      manage: checked,
                      create: false,
                      read: false,
                      update: false,
                      delete: false,
                    },
                  };
                }
                return newData;
              });
              if (checked) {
                grant({
                  string: "open:admin_page",
                  userId: selectedUser,
                });
              } else {
                revoke({
                  string: "open:admin_page",
                  userId: selectedUser,
                });
              }
            }}
            disabled={loadingRevoke || loadingGrant}
            checked={
              permissionGroups["admin_page" as PermissionResource]?.actions
                ?.manage ?? false
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("Allow")}
                </Typography>
              </Box>
            }
          />
        </Stack>
      </Box>

      <Box key="manage_system">
        <Stack spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                color: "textPrimary",
              }}
            >
              {t(`ManageSystem`)}
            </Typography>
          </Box>

          {/* Manage Permission */}
          <Checkbox
            onChange={(e, checked) => {
              setPermissionGroups((prev) => {
                const newData = { ...prev };
                if (newData["system" as PermissionResource]) {
                  newData["system" as PermissionResource].actions.manage =
                    checked;
                } else {
                  newData["system" as PermissionResource] = {
                    resource: "system" as PermissionResource,
                    actions: {
                      manage: checked,
                      create: false,
                      read: false,
                      update: false,
                      delete: false,
                    },
                  };
                }
                return newData;
              });
              if (checked) {
                grant({
                  string: "manage:system",
                  userId: selectedUser,
                });
              } else {
                revoke({
                  string: "manage:system",
                  userId: selectedUser,
                });
              }
            }}
            disabled={loadingRevoke || loadingGrant}
            checked={
              permissionGroups["system" as PermissionResource]?.actions
                ?.manage ?? false
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("Allow")}
                </Typography>
              </Box>
            }
          />
        </Stack>
      </Box>

      {resourceList?.map((resource, index) => {
        return (
          <Box key={resource}>
            {index > 0 && <Divider sx={{ my: 1 }} />}

            <Stack spacing={1.5}>
              {/* Resource Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                    color: "textPrimary",
                  }}
                >
                  {t(`Resources.${resource}`)}
                </Typography>
              </Box>

              {/* Manage Permission */}
              <Checkbox
                onChange={(e, checked) => {
                  setPermissionGroups((prev) => {
                    const newData = { ...prev };
                    if (newData[resource]) {
                      newData[resource].actions.manage = checked;
                    } else {
                      newData[resource] = {
                        resource,
                        actions: {
                          manage: checked,
                          create: false,
                          read: false,
                          update: false,
                          delete: false,
                        },
                      };
                    }
                    return newData;
                  });
                  if (checked) {
                    grant({
                      string: `manage:${resource}`,
                      userId: selectedUser,
                    });
                  } else {
                    revoke({
                      string: `manage:${resource}`,
                      userId: selectedUser,
                    });
                  }
                }}
                disabled={loadingRevoke || loadingGrant}
                checked={permissionGroups[resource]?.actions?.manage ?? false}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t("Manage.Label")}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {t("Manage.SubLabel")}
                    </Typography>
                  </Box>
                }
              />

              {/* Individual Actions - only show if manage is NOT selected */}
              {!permissionGroups[resource]?.actions?.manage && (
                <Box
                  sx={{
                    ml: 2,
                    pl: 2,
                    borderLeft: "2px solid",
                    borderColor: "divider",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                  }}
                >
                  {actionList
                    ?.filter((action) => action !== "manage")
                    .map((action) => (
                      <Checkbox
                        key={action + resource}
                        checked={
                          permissionGroups[resource]?.actions[action] ?? false
                        }
                        disabled={loadingRevoke || loadingGrant}
                        label={t(`Actions.${action}`)}
                        onChange={(e, checked) => {
                          setPermissionGroups((prev) => {
                            const newData = { ...prev };
                            if (newData[resource]) {
                              newData[resource].actions[action] = checked;
                            } else {
                              newData[resource] = {
                                resource,
                                actions: {
                                  manage: false,
                                  create: false,
                                  read: false,
                                  update: false,
                                  delete: false,
                                },
                              };
                              newData[resource].actions[action] = checked;
                            }
                            return newData;
                          });
                          if (checked) {
                            grant({
                              string: `${action}:${resource}`,
                              userId: selectedUser,
                            });
                          } else {
                            revoke({
                              string: `${action}:${resource}`,
                              userId: selectedUser,
                            });
                          }
                        }}
                      />
                    ))}
                </Box>
              )}
            </Stack>
          </Box>
        );
      })}
    </>
  );
}
