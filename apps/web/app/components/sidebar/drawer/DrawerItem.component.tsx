"use client";
import { Collapse, Divider, List, ListSubheader } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ExpandLessIcon, ExpandMoreIcon } from "@web/components/IconCollection";
import Link from "@web/components/native/Link";
import { DrawerItemConfig } from "@web/components/sidebar/drawer/drawer.config";
import { usePathname } from "@web/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

type OpenMap = Record<string, boolean>;

function isPathActive(pathname: string, path?: string) {
  if (!path) return false;
  return pathname === path || pathname.startsWith(path + "/");
}

export default function DrawerItemComponent({
  userPermissions,
  config,
}: {
  config: DrawerItemConfig[];
  userPermissions: string[];
}) {
  const pathname = usePathname();

  return (
    <DrawerItemTree
      key={pathname}
      pathname={pathname}
      userPermissions={userPermissions}
      config={config}
    />
  );
}

function DrawerItemTree({
  pathname,
  userPermissions,
  config,
}: {
  config: DrawerItemConfig[];
  pathname: string;
  userPermissions: string[];
}) {
  const [openMap, setOpenMap] = useState<OpenMap>({});

  const toggleOpen = (key: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <List disablePadding>
      {config.map((item) => (
        <DrawerItem
          key={item.label}
          item={item}
          pathname={pathname}
          openMap={openMap}
          toggleOpen={toggleOpen}
          userPermissions={userPermissions}
        />
      ))}
    </List>
  );
}

function DrawerItem({
  item,
  pathname,
  openMap,
  toggleOpen,
  userPermissions,
}: {
  item: DrawerItemConfig;
  pathname: string;
  openMap: OpenMap;
  toggleOpen: (key: string) => void;
  userPermissions: string[];
}) {
  const t = useTranslations("Global.Sidebar.DrawerItem");
  if (item.isAllowed) {
    if (!item.isAllowed(userPermissions)) return null;
  }

  // ── Section type ──────────────────────────────────────────────────────────
  if (item.type === "section") {
    return (
      <>
        <Divider sx={{ mt: 0.25, mb: 0.25 }} />
        <ListSubheader
          disableSticky
          sx={{
            lineHeight: "28px",
            px: 2,
            py: 0,
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "text.disabled",
            bgcolor: "transparent",
          }}
        >
          {t(item.label)}
        </ListSubheader>
      </>
    );
  }

  // ── Collapsible parent ────────────────────────────────────────────────────
  const visibleChildren =
    item.children?.filter(
      (_c) => true,
      // hasPermission(userPermissions, c.permissions)
    ) ?? [];

  const isRouteOpen = visibleChildren.some((child) =>
    isPathActive(pathname, child.path),
  );

  const isOpen = openMap[item.label] ?? isRouteOpen;

  if (visibleChildren.length > 0) {
    return (
      <>
        <ListItemButton
          onClick={() => toggleOpen(item.label)}
          sx={{ py: 0.5, minHeight: 36 }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 32 }}>
              {/* Shrink icon to 18px */}
              <span style={{ fontSize: 18, display: "flex" }}>{item.icon}</span>
            </ListItemIcon>
          )}
          <ListItemText
            primary={t(item.label)}
            slotProps={{ primary: { variant: "body2" } }}
          />
          {isOpen ? (
            <ExpandLessIcon sx={{ fontSize: 16 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 16 }} />
          )}
        </ListItemButton>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {visibleChildren.map((child) => (
              <ListItemButton
                key={child.label}
                component={Link}
                href={child.path!}
                selected={isPathActive(pathname, child.path)}
                sx={{ pl: 4, py: 0.5, minHeight: 34 }}
              >
                {child.icon && (
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <span
                      style={{
                        fontSize: 16,
                        display: "flex",
                      }}
                    >
                      {child.icon}
                    </span>
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={t(child.label)}
                  slotProps={{
                    primary: { variant: "body2" },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  // ── Leaf item ─────────────────────────────────────────────────────────────
  return (
    <ListItemButton
      component={Link}
      href={item.path!}
      selected={isPathActive(pathname, item.path)}
      sx={{ py: 0.5, minHeight: 36 }}
    >
      {item.icon && (
        <ListItemIcon sx={{ minWidth: 32 }}>
          <span style={{ fontSize: 18, display: "flex" }}>{item.icon}</span>
        </ListItemIcon>
      )}
      <ListItemText
        primary={t(item.label)}
        slotProps={{ primary: { variant: "body2" } }}
      />
    </ListItemButton>
  );
}
