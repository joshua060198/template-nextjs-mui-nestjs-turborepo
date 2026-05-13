import { Divider, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { UserId } from "@repo/common/entity/user.entity.type";
import { Checkbox } from "@web/components/native/form/Checkbox";
import {
  useAllAvailablePermissions,
  useGrantUserPermission,
  usePermissionResources,
  useRevokeUserPermission,
  useUserPermissions,
} from "@web/libs/hooks/api/auth.api.hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface PermissionGroup {
  resource: string;
  actions: Record<string, boolean>;
}

const parseResourceStringToPrettyString = (value: string) => {
  return value
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

/**
 * Parse flat permission list into grouped structure
 * e.g., ['manage:user', 'create:file', 'view:file'] =>
 * { user: { manage: true, actions: {...} }, file: { manage: false, actions: {...} } }
 */
const parsePermissions = (
  permissions: string[],
): Record<string, PermissionGroup> => {
  const groups: Record<string, PermissionGroup> = {};

  permissions.forEach((perm) => {
    const splittedPerm = perm.split(":");
    const action = splittedPerm[0];
    const resource = splittedPerm[1];
    console.log(splittedPerm);

    if (!resource || !action) return;

    if (groups[resource]) {
      groups[resource].actions[action] = true;
    } else {
      groups[resource] = {
        resource,
        actions: { [action]: true },
      };
    }
  });

  return groups;
};

/**
 * Convert grouped structure back to flat permission list
 */
const flattenPermissions = (
  groups: Record<string, PermissionGroup>,
): string[] => {
  const permissions: string[] = [];

  Object.values(groups).forEach(({ resource, actions }) => {
    Object.entries(actions).forEach(([action, val]) => {
      if (val) permissions.push(`${action}:${resource}`);
    });
  });

  return permissions;
};

export default function EditPermissionForm({
  selectedUser,
}: {
  selectedUser: UserId;
}) {
  const { data } = useUserPermissions(selectedUser);
  const { data: permissionList } = useAllAvailablePermissions();
  const { data: resourceList } = usePermissionResources();
  const t = useTranslations("Page.Admin.RBAC.UserManagement.Form.Permissions");

  const [allPermissionGroups, setAllPermissionGroups] = useState<
    Record<string, PermissionGroup>
  >(() => parsePermissions(permissionList ?? []));

  const [userPermissionGroups, setUserPermissionGroups] = useState<
    Record<string, PermissionGroup>
  >(() => parsePermissions(data ?? []));

  const { mutate: revoke, isPending: loadingRevoke } =
    useRevokeUserPermission();

  const { mutate: grant, isPending: loadingGrant } = useGrantUserPermission();

  useEffect(() => {
    setUserPermissionGroups(parsePermissions(data ?? []));
  }, [data]);

  useEffect(() => {
    setAllPermissionGroups(parsePermissions(permissionList ?? []));
  }, [permissionList]);

  return (
    <>
      <Typography variant="body2" color="textSecondary">
        Override specific permissions from the user's role. Selecting "manage"
        grants all actions (create, view, update, delete) for that resource.
      </Typography>

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
                  {parseResourceStringToPrettyString(resource)}
                </Typography>
              </Box>

              {/* Manage Permission */}
              {allPermissionGroups[resource] &&
                Object.keys(allPermissionGroups[resource].actions).includes(
                  "manage",
                ) && (
                  <Checkbox
                    onChange={(e, checked) => {
                      setUserPermissionGroups((prev) => {
                        const newData = { ...prev };
                        if (newData[resource]) {
                          newData[resource].actions.manage = checked;
                        } else {
                          newData[resource] = {
                            resource,
                            actions: {
                              manage: checked,
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
                    checked={
                      userPermissionGroups[resource]?.actions?.manage ?? false
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {t("Manage.Label")}
                        </Typography>
                      </Box>
                    }
                  />
                )}

              {/* Individual Actions - only show if manage is NOT selected */}
              {!userPermissionGroups[resource]?.actions?.manage && (
                <Box
                  id={
                    allPermissionGroups[resource]
                      ? JSON.stringify(
                          Object.entries(allPermissionGroups[resource].actions),
                          null,
                          3,
                        )
                      : undefined
                  }
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
                  {allPermissionGroups[resource] &&
                    Object.entries(allPermissionGroups[resource].actions)
                      ?.filter(([action]) => action !== "manage")
                      .map(([action]) => (
                        <Checkbox
                          key={action + resource}
                          checked={
                            userPermissionGroups[resource]?.actions[action] ??
                            false
                          }
                          disabled={loadingRevoke || loadingGrant}
                          label={
                            <Typography variant="body2">
                              {parseResourceStringToPrettyString(action)}
                            </Typography>
                          }
                          onChange={(e, checked) => {
                            setUserPermissionGroups((prev) => {
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
