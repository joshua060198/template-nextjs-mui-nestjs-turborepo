import Box from "@mui/material/Box";
import PageContentComponent from "@web/components/page/PageContent.component";
import PageHeaderComponent from "@web/components/page/PageHeader.component";
import SettingPageContainer from "@web/components/page/settings/SettingPage.container";
import ThemeSwitcherContainer from "@web/components/page/settings/theme-switcher/ThemeSwitcher.container";
import SettingsUserProfileContainer from "@web/components/page/settings/user-profile/SettingsUserProfile.container";

export default function SettingsPage() {
  return (
    <Box>
      <PageHeaderComponent page="Settings" />
      <PageContentComponent>
        <SettingPageContainer
          tabs={[
            <SettingsUserProfileContainer key="user-profile" />,
            <ThemeSwitcherContainer key="general" />,
            <ThemeSwitcherContainer key="security" />,
          ]}
        />
      </PageContentComponent>
    </Box>
  );
}
