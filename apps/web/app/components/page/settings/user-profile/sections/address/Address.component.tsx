// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { BoxProps, Button, Grid, Paper } from "@mui/material";
// import Box from "@mui/material/Box";
// import {
//   CloseIcon,
//   RefreshIcon,
//   SaveIcon,
// } from "@web/components/IconCollection";
// import AutoComplete from "@web/components/native/form/Autocomplete";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormSubmit,
// } from "@web/components/native/form/Form";
// import TextField from "@web/components/native/form/TextField";
// import { SettingsHeading } from "@web/components/page/settings/SettingsHeading";
// import { useAddressOptions } from "@web/libs/hooks/api/app-config.api.hooks";
// import { useAuth } from "@web/libs/hooks/api/auth.api.hooks";
// import { useUpdateProfile } from "@web/libs/hooks/api/user.api.hooks";
// import { MeResponseFrontend } from "@web/libs/types//auth.type";
// import { ResponseFailed } from "@web/libs/types//common.type";
// import { UserAddress, UserAddressSchema } from "@repo/common/entity/user.entity.type";
// import {
//   convertEmptyValueToNull,
//   useApplyApiValidationErrorToFormError,
// } from "@web/libs/utils/form.util";
// import { useDebouncedValue } from "@tanstack/react-pacer";
// import { useTranslations } from "next-intl";
// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// function select(data: MeResponseFrontend) {
//   return {
//     address: data.address,
//     firstName: data.firstName,
//   };
// }

// interface InputValueType {
//   province: string;
//   city: string;
//   district: string;
//   subDistrict: string;
//   postalCode: string;
// }

// export default function AddressComponent() {
//   const { data: { address: userAddress, firstName } = {} } = useAuth({
//     select,
//   });

//   const [inputValue, setInputValue] = useState<InputValueType>({
//     province: "",
//     city: "",
//     district: "",
//     subDistrict: "",
//     postalCode: "",
//   });

//   useEffect(() => {
//     setInputValue({
//       province: userAddress?.province ?? "",
//       city: userAddress?.city ?? "",
//       district: userAddress?.district ?? "",
//       subDistrict: userAddress?.subDistrict ?? "",
//       postalCode: userAddress?.postalCode ?? "",
//     });
//   }, [userAddress]);

//   const [searchTerm] = useDebouncedValue(inputValue, {
//     wait: 500,
//   });

//   const {
//     data: addressOptions = {
//       province: [],
//       city: [],
//       district: [],
//       subDistrict: [],
//       postalCode: [],
//     },
//     isLoading: addressLoading,
//   } = useAddressOptions({
//     ["filter.province"]: "$ilike:" + searchTerm.province,
//     ["filter.city"]: "$ilike:" + searchTerm.city,
//     ["filter.district"]: "$ilike:" + searchTerm.district,
//     ["filter.subDistrict"]: "$ilike:" + searchTerm.subDistrict,
//     ["filter.postalCode"]: "$ilike:" + searchTerm.postalCode,
//   });

//   console.log(addressOptions);

//   const {
//     mutateAsync: updateProfile,
//     error: apiError,
//     isPending,
//   } = useUpdateProfile();

//   const t = useTranslations("Page.Settings.UserProfile.Address");

//   // ZOD VALIDATION
//   const { errorMapper, fn } =
//     useApplyApiValidationErrorToFormError<UserAddress>();

//   const formMethods = useForm<UserAddress>({
//     resolver: zodResolver(UserAddressSchema, {
//       error: errorMapper,
//     }),
//     defaultValues: {
//       province: userAddress?.province ?? "",
//       city: userAddress?.city ?? "",
//       district: userAddress?.district ?? "",
//       subDistrict: userAddress?.subDistrict ?? "",
//       postalCode: userAddress?.postalCode ?? "",
//       street: userAddress?.street ?? "",
//     },
//   });

//   const {
//     handleSubmit,
//     setError,
//     setValue,
//     reset,
//     formState: { isDirty, dirtyFields },
//   } = formMethods;
//   console.log(isDirty, dirtyFields);
//   // COMPONENT STATE
//   const submitHandler = useCallback(
//     (data: UserAddress) => {
//       const convertedData = convertEmptyValueToNull(data);
//       updateProfile({
//         address: {
//           ...convertedData,
//         },
//         firstName: firstName ?? "",
//       }).then(() => reset(undefined, { keepDirty: false }));
//     },
//     [updateProfile, reset, firstName],
//   );

//   useEffect(() => {
//     fn(apiError as ResponseFailed, setError);
//   }, [apiError, fn, setError]);

//   useEffect(() => {
//     if (userAddress) {
//       reset({
//         province: userAddress.province ?? null,
//         city: userAddress.city ?? null,
//         district: userAddress.district ?? null,
//         subDistrict: userAddress.subDistrict ?? null,
//         postalCode: userAddress.postalCode ?? null,
//         street: userAddress.street ?? "",
//       });
//     }
//   }, [setValue, userAddress]);

//   const isTyping = inputValue !== searchTerm;

//   useEffect(() => {
//     if (addressOptions.province.length === 1) {
//       setValue("province", addressOptions.province[0], {
//         shouldValidate: true,
//       });
//     }
//     if (addressOptions.city.length === 1) {
//       setValue("city", addressOptions.city[0], { shouldValidate: true });
//     }
//     if (addressOptions.district.length === 1) {
//       setValue("district", addressOptions.district[0], {
//         shouldValidate: true,
//       });
//     }
//     if (addressOptions.subDistrict.length === 1) {
//       setValue("subDistrict", addressOptions.subDistrict[0], {
//         shouldValidate: true,
//       });
//     }
//     if (addressOptions.postalCode.length === 1) {
//       setValue("postalCode", addressOptions.postalCode[0], {
//         shouldValidate: true,
//       });
//     }
//   }, [addressOptions, setValue]);

//   const resetHandler = () => {
//     setInputValue({
//       province: userAddress?.province ?? "",
//       city: userAddress?.city ?? "",
//       district: userAddress?.district ?? "",
//       subDistrict: userAddress?.subDistrict ?? "",
//       postalCode: userAddress?.postalCode ?? "",
//     });
//     reset(undefined, { keepDirty: false });
//   };

//   // const defaultRegion = useMemo(() => {
//   //     return regionList?.filter((v) => v.name === userData?.province)[0];
//   // }, [userData?.province, regionList]);
//   //
//   // const region =
//   //     selectedRegion === undefined ? defaultRegion : selectedRegion;
//   //
//   // const { data: regionDetail } = useRegionDetail(region?.code);
//   //
//   // const defaultCity = useMemo(() => {
//   //     return regionDetail?.cities?.filter(
//   //         (v) => v.name === userData?.city
//   //     )[0];
//   // }, [userData?.city, regionDetail]);
//   //
//   // const city = selectedCity === undefined ? defaultCity : selectedCity;
//   //
//   // const defaultDistrict = useMemo(() => {
//   //     return regionDetail?.cities
//   //         ?.filter((v) => v.name === userData?.city)[0]
//   //         ?.districts?.filter((v) => v.name === userData?.district)[0];
//   // }, [userData?.city, userData?.district, regionDetail]);
//   //
//   // const district =
//   //     selectedDistrict === undefined ? defaultDistrict : selectedDistrict;

//   return (
//     <Form<UserAddress, BoxProps>
//       submitHandler={handleSubmit(submitHandler)}
//       providers={formMethods}
//       slot={{ Container: Box }}
//       slotProps={{
//         form: {
//           noValidate: true,
//         },
//       }}
//     >
//       <Grid
//         container
//         size={{ xs: 12, md: 6 }}
//         component={Paper}
//         elevation={3}
//         p={2}
//         spacing={2}
//       >
//         <FormField slotProps={{ container: { size: 12 } }}>
//           <SettingsHeading>{t("Title")}</SettingsHeading>
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: { xs: 12, sm: 6, md: 12, lg: 6 },
//             },
//           }}
//         >
//           <FormControl<UserAddress>
//             name="province"
//             render={({ field, error }) => (
//               <AutoComplete
//                 {...field}
//                 options={isTyping ? [] : (addressOptions.province ?? [])}
//                 onChange={(e, value) => {
//                   field.onChange(value ?? "");
//                 }}
//                 loading={isTyping || addressLoading}
//                 onInputChange={(e, value) => {
//                   setInputValue((prev) => ({
//                     ...prev,
//                     province: value ?? "",
//                   }));
//                 }}
//                 errorMsg={error}
//                 value={field.value ?? null}
//                 textFieldProps={{
//                   label: t("Form.Province.Label"),
//                 }}
//                 disabled={isPending}
//               />
//             )}
//           />
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: { xs: 12, sm: 6, md: 12, lg: 6 },
//             },
//           }}
//         >
//           <FormControl<UserAddress>
//             name="city"
//             render={({ field, error }) => (
//               <AutoComplete
//                 {...field}
//                 options={isTyping ? [] : (addressOptions.city ?? [])}
//                 onChange={(e, value) => {
//                   field.onChange(value ?? "");
//                 }}
//                 loading={isTyping || addressLoading}
//                 onInputChange={(e, value) => {
//                   setInputValue((prev) => ({
//                     ...prev,
//                     city: value ?? "",
//                   }));
//                 }}
//                 errorMsg={error}
//                 value={field.value ?? null}
//                 textFieldProps={{
//                   label: t("Form.City.Label"),
//                 }}
//                 disabled={isPending}
//               />
//             )}
//           />
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: { xs: 12, sm: 6, md: 12, lg: 6 },
//             },
//           }}
//         >
//           <FormControl<UserAddress>
//             name="district"
//             render={({ field, error }) => (
//               <AutoComplete
//                 {...field}
//                 options={isTyping ? [] : (addressOptions.district ?? [])}
//                 onChange={(e, value) => {
//                   field.onChange(value ?? "");
//                 }}
//                 loading={isTyping || addressLoading}
//                 onInputChange={(e, value) => {
//                   setInputValue((prev) => ({
//                     ...prev,
//                     district: value ?? "",
//                   }));
//                 }}
//                 errorMsg={error}
//                 value={field.value ?? null}
//                 textFieldProps={{
//                   label: t("Form.District.Label"),
//                 }}
//                 disabled={isPending}
//               />
//             )}
//           />
//         </FormField>

//         <FormField
//           slotProps={{
//             container: {
//               size: { xs: 12, sm: 6, md: 12, lg: 6 },
//             },
//           }}
//         >
//           <FormControl<UserAddress>
//             name="subDistrict"
//             render={({ field, error }) => (
//               <AutoComplete
//                 {...field}
//                 options={isTyping ? [] : (addressOptions.subDistrict ?? [])}
//                 onChange={(e, value) => {
//                   field.onChange(value ?? "");
//                 }}
//                 loading={isTyping || addressLoading}
//                 onInputChange={(e, value) => {
//                   setInputValue((prev) => ({
//                     ...prev,
//                     subDistrict: value ?? "",
//                   }));
//                 }}
//                 errorMsg={error}
//                 value={field.value ?? null}
//                 textFieldProps={{
//                   label: t("Form.SubDistrict.Label"),
//                 }}
//                 disabled={isPending}
//               />
//             )}
//           />
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: { xs: 12, sm: 6, md: 12, lg: 6 },
//             },
//           }}
//         >
//           <FormControl<UserAddress>
//             name="postalCode"
//             render={({ field, error }) => (
//               <AutoComplete
//                 {...field}
//                 options={isTyping ? [] : (addressOptions.postalCode ?? [])}
//                 onChange={(e, value) => {
//                   field.onChange(value ?? "");
//                 }}
//                 loading={isTyping || addressLoading}
//                 onInputChange={(e, value) => {
//                   setInputValue((prev) => ({
//                     ...prev,
//                     postalCode: value ?? "",
//                   }));
//                 }}
//                 errorMsg={error}
//                 value={field.value ?? null}
//                 textFieldProps={{
//                   label: t("Form.PostalCode.Label"),
//                 }}
//                 disabled={isPending}
//               />
//             )}
//           />
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: { xs: 12, sm: 6, md: 12, lg: 6 },
//               alignItems: "center",
//               display: "flex",
//             },
//           }}
//         >
//           <Button
//             onClick={() => {
//               setInputValue({
//                 province: "",
//                 city: "",
//                 district: "",
//                 subDistrict: "",
//                 postalCode: "",
//               });
//               setValue("province", null);
//               setValue("city", null);
//               setValue("district", null);
//               setValue("subDistrict", null);
//               setValue("postalCode", null);
//             }}
//             startIcon={<CloseIcon />}
//             color="warning"
//             variant="outlined"
//           >
//             Clear Address
//           </Button>
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: 12,
//             },
//           }}
//         >
//           <FormControl<UserAddress>
//             name="street"
//             render={({ field, error }) => (
//               <TextField
//                 {...field}
//                 multiline
//                 maxRows={5}
//                 minRows={3}
//                 label={t("Form.Address.Label")}
//                 errorMsg={error}
//                 disabled={isPending}
//               />
//             )}
//           />
//         </FormField>

//         <FormField
//           slotProps={{
//             container: {
//               sx: { display: { sm: "none" } },
//             },
//           }}
//         >
//           <FormSubmit
//             color="error"
//             type="reset"
//             disabled={!isDirty}
//             isLoading={isPending}
//             variant="outlined"
//             sx={{ borderRadius: 3 }}
//             onClick={resetHandler}
//             startIcon={<RefreshIcon />}
//           >
//             {t("ResetButton")}
//           </FormSubmit>
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               sx: { display: { sm: "none" } },
//             },
//           }}
//         >
//           <FormSubmit
//             disabled={!isDirty}
//             isLoading={isPending}
//             sx={{ borderRadius: 3 }}
//             startIcon={<SaveIcon />}
//           >
//             {t("SaveButton")}
//           </FormSubmit>
//         </FormField>
//         <FormField
//           slotProps={{
//             container: {
//               size: 12,
//               justifyContent: "flex-end",
//               columnGap: 2,
//               sx: { display: { xs: "none", sm: "flex" } },
//             },
//           }}
//         >
//           <FormSubmit
//             color="error"
//             type="reset"
//             disabled={!isDirty}
//             isLoading={isPending}
//             variant="outlined"
//             sx={{ borderRadius: 3 }}
//             onClick={resetHandler}
//             fullWidth={false}
//             startIcon={<RefreshIcon />}
//           >
//             {t("ResetButton")}
//           </FormSubmit>
//           <FormSubmit
//             disabled={!isDirty}
//             isLoading={isPending}
//             sx={{ borderRadius: 3 }}
//             startIcon={<SaveIcon />}
//             fullWidth={false}
//           >
//             {t("SaveButton")}
//           </FormSubmit>
//         </FormField>
//       </Grid>
//     </Form>
//   );
// }
