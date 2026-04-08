// "use client";
// import { Avatar, Button, Grid, Paper } from "@mui/material";
// import Box from "@mui/material/Box";
// import { DropzoneContainer } from "@web/components/dropzone/Dropzone.container";
// import { FormField } from "@web/components/native/form/Form";
// import { SettingsHeading } from "@web/components/page/settings/SettingsHeading";
// import { useAuth } from "@web/libs/hooks/api/auth.api.hooks";
// import { useDownloadFile } from "@web/libs/hooks/api/file.api.hooks";
// import { useUpdateProfile } from "@web/libs/hooks/api/user.api.hooks";
// import { useCompletedFileIds } from "@web/libs/hooks/useCompletedFileIds.hooks";
// import { useDialog } from "@web/libs/hooks/useDialog.hooks";
// import { MeResponseFrontend } from "@repo/common/auth.service.type";
// import { UploadItem } from "@repo/common/entity/file.entity.type";
// import { useTranslations } from "next-intl";
// import { useEffect, useState } from "react";
//
// function select(data: MeResponseFrontend) {
//   return {
//     userId: data.id,
//     fullName: data.fullName,
//     // avatar: data.avatar,
//     imageUrl: data.imageUrl,
//   };
// }
//
// export default function ProfilePictureComponent() {
//   const { data: userData } = useAuth({ select });
//   const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
//   const t = useTranslations("Page.Settings.UserProfile.ProfilePicture");
//   const [files, setFiles] = useState<UploadItem[]>([]);
//   const completedFileIds = useCompletedFileIds(files);
//   const { data: downloadFile } = useDownloadFile(userData?.avatar ?? undefined);
//
//   const { dialogConfirm } = useDialog();
//
//   useEffect(() => {
//     if (userData && completedFileIds.length > 0) {
//       updateProfile({
//         avatarId: completedFileIds[0],
//         fullName: userData.fullName,
//       }).then(() => {
//         setFiles([]);
//       });
//     }
//   }, [completedFileIds, updateProfile, userData]);
//
//   return (
//     <Grid
//       container
//       size={{ xs: 12, md: 6 }}
//       component={Paper}
//       elevation={3}
//       p={2}
//       spacing={2}
//     >
//       <FormField
//         slotProps={{
//           container: {
//             size: 12,
//           },
//         }}
//       >
//         <Box>
//           <SettingsHeading>{t("Title")}</SettingsHeading>
//           <Box
//             display="flex"
//             alignItems="flex-start"
//             sx={{ columnGap: 2 }}
//             mt={2}
//           >
//             <Box display="flex" alignItems="center" flexDirection="column">
//               <Avatar
//                 sx={{
//                   width: {
//                     xs: 80,
//                     sm: 96,
//                     md: 72,
//                     lg: 88,
//                     xl: 96,
//                   },
//                   height: {
//                     xs: 80,
//                     sm: 96,
//                     md: 72,
//                     lg: 88,
//                     xl: 96,
//                   },
//                   fontSize: {
//                     xs: "1.75rem",
//                     sm: "2rem",
//                     md: "1.5rem",
//                     lg: "2rem",
//                   },
//                 }}
//                 src={files[0]?.preview ?? downloadFile?.url ?? undefined}
//               >
//                 {userData?.avatar || files[0]?.preview
//                   ? ""
//                   : getFullNameDisplay(userData?.fullName ?? "")
//                       .split(" ")
//                       .map((v) => v.charAt(0))
//                       .join()}
//               </Avatar>
//               <Button
//                 sx={{ m: 2 }}
//                 disabled={
//                   userData === undefined ||
//                   userData.avatar === undefined ||
//                   userData.avatar === null
//                 }
//                 fullWidth
//                 size="small"
//                 variant="contained"
//                 color="error"
//                 onClick={async () => {
//                   if (userData) {
//                     const ok = await dialogConfirm({
//                       title: "Remove Profile Picture?",
//                       message: "This action cannot be undone.",
//                       confirmText: "Remove",
//                       cancelText: "Cancel",
//                       destructive: true,
//                     });
//
//                     if (!ok) return;
//
//                     await updateProfile({
//                       fullName: userData.fullName,
//                       avatarId: null,
//                     });
//                   }
//                 }}
//               >
//                 Remove
//               </Button>
//             </Box>
//             <DropzoneContainer
//               maxSize={10 * 1024 * 1024}
//               maxFiles={1}
//               accept={{
//                 "image/png": [".png"],
//                 "image/jpeg": [".jpeg", ".jpg"],
//               }}
//               files={files}
//               setFiles={setFiles}
//               dropzoneProps={{ disabled: isPending }}
//             />
//           </Box>
//         </Box>
//       </FormField>
//     </Grid>
//   );
// }
