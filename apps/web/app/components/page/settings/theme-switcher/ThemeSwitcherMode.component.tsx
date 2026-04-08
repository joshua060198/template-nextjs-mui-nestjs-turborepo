"use client";
import { ToggleButtonGroup, Typography, useColorScheme } from "@mui/material";
import {
  DarkModeIcon,
  LightModeIcon,
  SettingsBrightnessIcon,
} from "@web/components/IconCollection";
import IconToggleButton from "@web/components/native/IconToggleButton";
import { useTranslations } from "next-intl";

export default function ThemeSwitcherModeComponent() {
  const t = useTranslations("Page.Settings.Appearance");
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <ToggleButtonGroup
      color="primary"
      value={mode}
      exclusive
      onChange={(e, value) => {
        if (value !== null) setMode(value);
      }}
    >
      <IconToggleButton fullWidth value="light">
        <LightModeIcon fontSize="small" />
        <Typography fontSize="small" component="span">
          {t("Light")}
        </Typography>
      </IconToggleButton>
      <IconToggleButton fullWidth value="system">
        <SettingsBrightnessIcon fontSize="small" />
        <Typography fontSize="small" component="span">
          {t("System")}
        </Typography>
      </IconToggleButton>
      <IconToggleButton fullWidth value="dark">
        <DarkModeIcon fontSize="small" />
        <Typography fontSize="small" component="span">
          {t("Dark")}
        </Typography>
      </IconToggleButton>
    </ToggleButtonGroup>
  );
}
