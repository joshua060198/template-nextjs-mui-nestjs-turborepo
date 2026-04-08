import Box from "@mui/material/Box";
import PersonalInformationComponent from "@web/components/page/settings/user-profile/sections/personal-information/PersonalInformation.component";

export default function SettingsUserProfileContainer() {
  return (
    <Box mt={2}>
      <Box
        sx={{
          columnGap: 3,
          columnCount: { xs: 1, md: 2 },
          "& > *": {
            breakInside: "avoid",
            marginBottom: 3,
          },
        }}
      >
        <PersonalInformationComponent />
        {/*<ProfilePictureComponent />*/}
        {/* <AddressComponent /> */}
      </Box>
    </Box>
  );
}
