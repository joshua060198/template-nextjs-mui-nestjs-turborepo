import { Box, Grid } from "@mui/material";
import {
  SettingsHeading,
  SettingsSubHeading,
} from "@web/components/page/settings/SettingsHeading";
import ThemeSwitcherModeComponent from "@web/components/page/settings/theme-switcher/ThemeSwitcherMode.component";
import ThemeSwitcherThemeComponent from "@web/components/page/settings/theme-switcher/ThemeSwitcherTheme.component";
import { useTranslations } from "next-intl";

export default function ThemeSwitcherContainer() {
  const t = useTranslations("Page.Settings.Appearance");
  return (
    <Box>
      <SettingsHeading>{t("Title")}</SettingsHeading>
      <Grid container spacing={{ xs: 2, xl: 4 }}>
        <Grid>
          <SettingsSubHeading>{t("SubtitleMode")}</SettingsSubHeading>
          <ThemeSwitcherModeComponent />
        </Grid>
        <Grid>
          <SettingsSubHeading>{t("SubtitleTheme")}</SettingsSubHeading>
          <ThemeSwitcherThemeComponent />
        </Grid>
      </Grid>
    </Box>
  );
}
