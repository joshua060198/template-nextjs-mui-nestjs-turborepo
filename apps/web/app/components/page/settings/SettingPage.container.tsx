"use client";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import {
  AccountCircleIcon,
  SettingsSuggestIcon,
} from "@web/components/IconCollection";
import { useTranslations } from "next-intl";
import { ReactNode, SyntheticEvent, useState } from "react";

enum TabValue {
  PROFILE,
  GENERAL,
  // SECURITY,
}

interface SettingPageContainerProps {
  tabs: ReactNode[];
}

export default function SettingPageContainer({
  tabs,
}: SettingPageContainerProps) {
  const t = useTranslations("Page.Settings");
  const [value, setValue] = useState<TabValue>(TabValue.PROFILE);

  const handleChange = (event: SyntheticEvent, newValue: TabValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          // mt={{ xs: 1, md: 0 }}
          display="flex"
          justifyContent="center"
        >
          <TabList
            variant="scrollable"
            // centered
            sx={(theme) => ({
              maxWidth: "calc(100vw - 24px)",
              overflowX: "auto",

              // textTransform: 'none',
              width: "fit-content",
              minHeight: "auto",
              bgcolor: "grey.200",
              borderRadius: 99,
              p: 1,
              ...theme.applyStyles("dark", {
                bgcolor: theme.palette.background.paper,
              }),
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
              "& .MuiTab-root": {
                minHeight: "auto",
                py: 0.75,
                px: 1.5,
                zIndex: 1,
                color: "text.secondary",
                fontWeight: 500,
                borderRadius: 99,
                "&.Mui-selected": {
                  color: "common.black",
                },
                ...theme.applyStyles("dark", {
                  "&.Mui-selected": {
                    color: "common.white",
                  },
                }),
              },
              "& .MuiTabs-indicator": {
                height: "100%",
                borderRadius: 99,
                bgcolor: "#2e2e2e",
                zIndex: 1,
                mixBlendMode: "difference",
                transition: theme.transitions.create(["left", "width"], {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeInOut,
                }),
                ...theme.applyStyles("dark", {
                  bgcolor: theme.palette.divider,
                }),
              },

              "& .MuiButtonBase-root": {
                ...theme.applyStyles("dark", {
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                }),
              },
            })}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab
              sx={{ minHeight: "inherit" }}
              iconPosition="start"
              icon={<AccountCircleIcon />}
              label={t("TabProfile")}
              value={TabValue.PROFILE}
            />
            <Tab
              sx={{ minHeight: "inherit" }}
              iconPosition="start"
              icon={<SettingsSuggestIcon />}
              label={t("TabGeneral")}
              value={TabValue.GENERAL}
            />
            {/*<Tab*/}
            {/*  sx={{ minHeight: "inherit" }}*/}
            {/*  iconPosition="start"*/}
            {/*  icon={<SecurityIcon />}*/}
            {/*  label={t("TabSecurity")}*/}
            {/*  value={TabValue.SECURITY}*/}
            {/*/>*/}
          </TabList>
        </Box>
        <TabPanel
          sx={{ p: 1, mt: 1 }}
          value={TabValue.PROFILE}
          keepMounted={false}
        >
          {tabs[0]}
        </TabPanel>
        <TabPanel
          sx={{ p: 1, mt: 1 }}
          value={TabValue.GENERAL}
          keepMounted={false}
        >
          {tabs[1]}
        </TabPanel>
        {/*<TabPanel sx={{ p: 1, mt: 1 }} value={TabValue.SECURITY}>*/}
        {/*  {tabs[1]}*/}
        {/*</TabPanel>*/}
      </TabContext>
    </Box>
  );
}
