"use client";
import { ToggleButtonGroup, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import {
  ContrastIcon,
  FilterVintageIcon,
  FlareIcon,
  ForestIcon,
  NightsStayIcon,
  NordicWalkingIcon,
  SailingIcon,
} from "@web/components/IconCollection";
import IconToggleButton from "@web/components/native/IconToggleButton";
import { ThemeContext } from "@web/libs/providers/theme.provider";
import { useTranslations } from "next-intl";
import { useContext } from "react";

export default function ThemeSwitcherThemeComponent() {
  const t = useTranslations("Page.Settings.Appearance");
  const { setTheme, theme } = useContext(ThemeContext);
  return (
    <Box width="calc(100%)">
      <ToggleButtonGroup
        color="secondary"
        value={theme}
        exclusive
        sx={{
          maxWidth: { xs: "calc(100vw - 48px)", md: "100%" },
          overflowX: "auto",
          flexWrap: "nowrap",
        }}
        onChange={(e, value) => {
          if (value !== null) {
            setTheme(value);
          }
        }}
      >
        <IconToggleButton value="default" sx={{ whiteSpace: "nowrap" }}>
          <ContrastIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeDefault")}
          </Typography>
        </IconToggleButton>
        <IconToggleButton sx={{ whiteSpace: "nowrap" }} value="rosequartz">
          <NightsStayIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeRoseQuartz")}
          </Typography>
        </IconToggleButton>
        <IconToggleButton sx={{ whiteSpace: "nowrap" }} value="solarflare">
          <FlareIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeSolarFlare")}
          </Typography>
        </IconToggleButton>
        <IconToggleButton sx={{ whiteSpace: "nowrap" }} value="oceaniccalm">
          <SailingIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeOceanicCalm")}
          </Typography>
        </IconToggleButton>
        <IconToggleButton sx={{ whiteSpace: "nowrap" }} value="forestserenity">
          <ForestIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeForestSerenity")}
          </Typography>
        </IconToggleButton>
        <IconToggleButton sx={{ whiteSpace: "nowrap" }} value="midnightviolet">
          <FilterVintageIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeMidnightViolet")}
          </Typography>
        </IconToggleButton>
        <IconToggleButton sx={{ whiteSpace: "nowrap" }} value="nordicfrost">
          <NordicWalkingIcon fontSize="small" />
          <Typography fontSize="small" component="span">
            {t("ThemeNordicFrost")}
          </Typography>
        </IconToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
