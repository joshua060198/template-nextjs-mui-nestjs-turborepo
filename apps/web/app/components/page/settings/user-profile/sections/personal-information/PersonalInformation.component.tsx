"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BoxProps, Chip, Grid, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { MeResponseFrontend } from "@repo/common/auth.service.type";
import { ResponseFailed } from "@repo/common/common.type";
import {
  UpdateUserProfile,
  UpdateUserProfileFormInput,
  UpdateUserProfileSchema,
} from "@repo/common/entity/user.entity.type";
import { RefreshIcon, SaveIcon } from "@web/components/IconCollection";
import {
  createFormControl,
  Form,
  FormField,
  FormSubmit,
} from "@web/components/native/form/Form";
import TextField from "@web/components/native/form/TextField";
import PersistentCooldownButton from "@web/components/native/PersistentCooldownButton";
import { SettingsHeading } from "@web/components/page/settings/SettingsHeading";
// import {
//   useCities,
//   useCountryCodes,
//   useGenderList,
//   useReligionList,
// } from "@web/libs/hooks/api/app-config.api.hooks";
import { useAuth } from "@web/libs/hooks/api/auth.api.hooks";
import {
  useEmailVerification,
  useUpdateProfile,
} from "@web/libs/hooks/api/user.api.hooks";
// import { PhoneCode } from "@web/libs/types/config/phone-code.type";
import {
  convertEmptyValueToNull,
  useApplyApiValidationErrorToFormError,
} from "@web/libs/utils/form.util";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

const FormControl = createFormControl<UpdateUserProfileFormInput>();

function select(data: MeResponseFrontend) {
  return {
    username: data.username ?? "",
    emailVerifiedAt: data.emailVerifiedAt,
    email: data.email ?? null,
    fullName: data.fullName ?? "",
    // middleName: data.middleName ?? "",
    // lastName: data.lastName ?? "",
    // phoneNumber: data.phoneNumber ?? null,
    // pob: data.pob ?? null,
    // dob: data.dob ?? null,
    // gender: data.gender ?? null,
    // religion: data.religion ?? null,
    // about: data.about ?? "",
    // address: data.address ?? null,
    avatar: data.avatar ?? null,
  };
}

export default function PersonalInformationComponent() {
  // const locale = useLocale();
  const { data } = useAuth({ select });

  // component state
  const t = useTranslations("Page.Settings.UserProfile.PersonalInformation");

  // ZOD VALIDATION
  const { errorMapper, fn } =
    useApplyApiValidationErrorToFormError<UpdateUserProfileFormInput>();

  const formMethods = useForm<
    UpdateUserProfileFormInput,
    undefined,
    UpdateUserProfile
  >({
    resolver: zodResolver(UpdateUserProfileSchema, {
      error: errorMapper,
    }),
    defaultValues: {
      email: data?.email ?? null,
      fullName: data?.fullName ?? "",
      // middleName: data?.middleName ?? "",
      // lastName: data?.lastName ?? "",
      // phoneNumber: data?.phoneNumber ?? null,
      // pob: data?.pob ?? null,
      // dob: data?.dob ?? null,
      // about: data?.about ?? "",
      // address: data?.address ?? null,
      // avatarId: data?.avatar?.id ?? null,
      // genderId: data?.gender?.id ?? null,
      // religionId: data?.religion?.id ?? null,
    },
    // values: {
    //     email: data?.email,
    //     firstName: data?.firstName ?? '',
    //     middleName: data?.middleName,
    //     lastName: data?.lastName,
    //     phoneNumber: data?.phoneNumber,
    //     pob: data?.pob,
    //     dob: data?.dob,
    //     about: data?.about,
    //     address: data?.address,
    //     avatarId: data?.avatar?.id,
    //     genderId: data?.gender?.id,
    //     religionId: data?.religion?.id,
    // },
  });

  const {
    handleSubmit,
    setError,
    setValue,
    // getValues,
    reset,
    formState: { isDirty },
  } = formMethods;
  //
  const {
    mutateAsync: updateProfile,
    error: apiError,
    isPending,
  } = useUpdateProfile();
  const { mutate: sendEmailVerification } = useEmailVerification();

  // // COMPONENT STATE
  const submitHandler = useCallback(
    (data: UpdateUserProfile) => {
      const convertedData = convertEmptyValueToNull(data);
      updateProfile({
        ...convertedData,
        // genderId: data.genderId,
        // religionId: data.religionId,
        avatarId: data.avatarId,
      }).then(() => reset(undefined, { keepDirty: false }));
    },
    [updateProfile, reset],
  );

  useEffect(() => {
    fn(apiError as ResponseFailed, setError);
  }, [apiError, fn, setError]);

  useEffect(() => {
    if (data) {
      setValue("email", data.email ?? null, { shouldDirty: false });
      setValue("fullName", data.fullName ?? "", { shouldDirty: false });
      // setValue("middleName", data.middleName ?? "", {
      //   shouldDirty: false,
      // });
      // setValue("lastName", data.lastName ?? "", { shouldDirty: false });
      // setValue("phoneNumber", data.phoneNumber ?? null, {
      //   shouldDirty: false,
      // });
      // setValue("pob", data.pob ?? null, { shouldDirty: false });
      // setValue("dob", data.dob ?? null, { shouldDirty: false });
      // setValue("about", data.about ?? null, { shouldDirty: false });
      // setValue("address", data.address ?? null, { shouldDirty: false });
      // setValue("genderId", data.gender?.id ?? null, {
      //   shouldDirty: false,
      // });
      // setValue("religionId", data.religion?.id ?? null, {
      //   shouldDirty: false,
      // });
    }
  }, [setValue, data]);

  // PHONE NUMBER FIELD
  // const userPhoneNumber = data?.phoneNumber;
  // const [selectedCountryCode, setSelectedCountryCode] = useState<
  //   PhoneCode | null | undefined
  // >(undefined);
  // const [currentPhoneNumber, setCurrentPhoneNumber] = useState<
  //   string | undefined
  // >(undefined);

  // const {
  //   data: countryCodes,
  //   isError: errorCountryCode,
  //   refetch: refetchCountryCode,
  // } = useCountryCodes();

  // const defaultCountryCode =
  //   !userPhoneNumber || !countryCodes?.length
  //     ? null
  //     : (countryCodes.find((c) => userPhoneNumber.startsWith(c.code)) ?? null);

  // const countryCode =
  //   selectedCountryCode === undefined
  //     ? defaultCountryCode
  //     : selectedCountryCode;

  // const defaultPhoneNumber = useMemo(() => {
  //   return userPhoneNumber?.split(" ")[1];
  // }, [userPhoneNumber]);

  // const phoneNumber =
  //   currentPhoneNumber === undefined ? defaultPhoneNumber : currentPhoneNumber;

  // // CITY FIELD
  // const [searchCityInput, setSearchCityInput] = useState("");

  // const [searchCityTerm] = useDebouncedValue(searchCityInput, {
  //   wait: 500,
  // });

  // const {
  //   data: cities,
  //   isLoading: cityLoading,
  //   isError: errorCities,
  // } = useCities(searchCityTerm);

  // const isTypingCity = searchCityInput !== searchCityTerm;

  // // GENDER FIELD
  // const { data: genderList } = useGenderList(locale);

  // // RELIGION FIELD
  // const { data: religionList } = useReligionList(locale);

  const resetHandler = () => {
    reset(
      {
        email: data?.email ?? null,
        fullName: data?.fullName ?? "",
        // middleName: data?.middleName ?? "",
        // lastName: data?.lastName ?? "",
        // phoneNumber: data?.phoneNumber ?? null,
        // pob: data?.pob ?? null,
        // dob: data?.dob ?? null,
        // about: data?.about ?? "",
        // address: data?.address ?? null,
        // avatarId: data?.avatar?.id ?? null,
        // genderId: data?.gender?.id ?? null,
        // religionId: data?.religion?.id ?? null,
      },
      { keepDirty: false },
    );
    // if (data && data.phoneNumber) {
    //   setSelectedCountryCode(
    //     countryCodes?.find((c) => data.phoneNumber!.startsWith(c.code)) ?? null,
    //   );
    //   setCurrentPhoneNumber(data.phoneNumber!.split(" ")[1]);
    // }
  };

  return (
    <Form<UpdateUserProfileFormInput, BoxProps>
      submitHandler={handleSubmit(submitHandler)}
      providers={formMethods}
      slot={{ Container: Box }}
      slotProps={{
        form: {
          noValidate: true,
        },
      }}
    >
      <Grid
        container
        size={{ xs: 12, md: 6 }}
        component={Paper}
        elevation={3}
        p={2}
        spacing={2}
      >
        <FormField slotProps={{ container: { size: 12 } }}>
          <SettingsHeading>{t("Title")}</SettingsHeading>
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <TextField
            value={data?.username || ""}
            label={t("Form.Username.Label")}
            disabled
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <FormControl
            name="email"
            render={({ field, error }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  if (e.target.value) {
                    setValue("email", e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  } else {
                    setValue("email", null, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
                label={
                  <Box>
                    {t("Form.Email.Label")}
                    {data?.email && (
                      <Chip
                        sx={{
                          ml: 1,
                          borderRadius: 1,
                          fontWeight: "bold",
                        }}
                        label={
                          data?.emailVerifiedAt
                            ? t("Form.Email.Verified")
                            : t("Form.Email.NotVerified")
                        }
                        color={data?.emailVerifiedAt ? "success" : "warning"}
                        size="small"
                      />
                    )}
                  </Box>
                }
                type="email"
                disabled={isPending}
                errorMsg={error}
                helperText={
                  data?.email && !data?.emailVerifiedAt ? (
                    <PersistentCooldownButton
                      savedKey="email-verification"
                      size="small"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{ mt: 1 }}
                      waitTime={300000}
                      onClick={() => sendEmailVerification()}
                    >
                      {t("Form.Email.SendVerificationEmail")}
                    </PersistentCooldownButton>
                  ) : undefined
                }
              />
            )}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12 },
            },
          }}
        >
          <FormControl
            name="fullName"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Form.FullName.Label")}
                type="text"
                required
                disabled={isPending}
                errorMsg={error}
              />
            )}
          />
        </FormField>
        {/* <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 4 },
            },
          }}
        >
          <FormControl
            name="middleName"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Form.MiddleName.Label")}
                type="text"
                disabled={isPending}
                errorMsg={error}
              />
            )}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 4 },
            },
          }}
        >
          <FormControl
            name="lastName"
            render={({ field, error }) => (
              <TextField
                {...field}
                label={t("Form.LastName.Label")}
                type="text"
                disabled={isPending}
                errorMsg={error}
              />
            )}
          />
        </FormField>
        <FormField>
          <SettingsSubHeading sx={{ mb: 0 }}>
            {t("Form.PhoneNumber.Label")}
          </SettingsSubHeading>
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <AutoComplete
            textFieldProps={{
              label: t("Form.PhoneNumber.CountryCodes"),
              slotProps: {
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => refetchCountryCode()}
                        disabled={!errorCountryCode}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
            }}
            errorMsg={
              errorCountryCode
                ? t("Form.PhoneNumber.FailedLoadCountryCodes")
                : undefined
            }
            onChange={(e, value) => {
              if (value === null) {
                setCurrentPhoneNumber("");
                setValue("phoneNumber", null, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              } else
                setValue("phoneNumber", value.code + " " + phoneNumber, {
                  shouldDirty: true,
                  shouldValidate: false,
                });
              setSelectedCountryCode(value);
            }}
            options={countryCodes ?? []}
            getOptionLabel={(option) =>
              `${option.flag} (${option.code}) ${option.name}`
            }
            disabled={isPending}
            value={countryCode}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <FormControl
            name="phoneNumber"
            render={({ field, error }) => (
              <TextField
                {...field}
                value={phoneNumber ?? ""}
                disabled={countryCode === null || isPending}
                label={t("Form.PhoneNumber.Number")}
                type="number"
                errorMsg={
                  countryCode && !phoneNumber
                    ? t("Form.PhoneNumber.EmptyPhoneNumber")
                    : error
                }
                onChange={(e) => {
                  setValue(
                    "phoneNumber",
                    countryCode
                      ? countryCode!.code + " " + e.target.value
                      : null,
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                  setCurrentPhoneNumber(e.target.value);
                }}
                slotProps={{
                  input: {
                    startAdornment: countryCode ? (
                      <InputAdornment position="start">
                        {countryCode.code}
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
              />
            )}
          />
        </FormField>
        <FormField>
          <SettingsSubHeading sx={{ mb: 0 }}>
            {t("Form.Birthday.Label")}
          </SettingsSubHeading>
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <FormControl
            name="pob"
            render={({ field: { onChange, ...field }, error }) => (
              <AutoComplete
                {...field}
                options={isTypingCity ? [] : (cities ?? [])}
                onChange={(e, value) => {
                  onChange(value ?? "");
                }}
                loading={isTypingCity || cityLoading}
                onInputChange={(e, value) => {
                  setSearchCityInput(value);
                }}
                errorMsg={
                  errorCities
                    ? t("Form.Birthday.POB.FailedLoadCities")
                    : error
                      ? error
                      : undefined
                }
                value={(field.value as string) ?? null}
                textFieldProps={{
                  label: t("Form.Birthday.POB.Label"),
                }}
                disabled={isPending}
              />
            )}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <FormControl
            name="dob"
            render={({ field, error }) => {
              const value =
                field.value &&
                dayjs(field.value as string, "YYYY-MM-DD", true).isValid()
                  ? dayjs(field.value as string, "YYYY-MM-DD")
                  : null;
              return (
                <DatePicker
                  {...field}
                  label={t("Form.Birthday.DOB.Label")}
                  errorMsg={error}
                  disabled={isPending}
                  disableFuture
                  value={value}
                  minDate={dayjs("1940-01-01")}
                  onChange={(newValue) => {
                    field.onChange(
                      newValue && newValue.isValid()
                        ? newValue.format("YYYY-MM-DD")
                        : null,
                    );
                  }}
                />
              );
            }}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <FormControl
            name="genderId"
            render={({ field, error }) => (
              <AutoComplete
                {...field}
                textFieldProps={{
                  label: t("Form.Gender.Label"),
                }}
                value={genderList?.find((o) => o.id === field.value) ?? null}
                onChange={(e, value) => field.onChange(value?.id ?? null)}
                errorMsg={error}
                options={genderList ?? []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                disabled={isPending}
              />
            )}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: { xs: 12, sm: 6, md: 12, lg: 6 },
            },
          }}
        >
          <FormControl
            name="religionId"
            render={({ field, error }) => (
              <AutoComplete
                {...field}
                textFieldProps={{
                  label: t("Form.Religion.Label"),
                }}
                value={religionList?.find((o) => o.id === field.value) ?? null}
                onChange={(e, value) => field.onChange(value?.id ?? null)}
                errorMsg={error}
                options={religionList ?? []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                disabled={isPending}
              />
            )}
          />
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: 12,
            },
          }}
        >
          <FormControl
            name="about"
            render={({ field, error }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                multiline
                maxRows={5}
                minRows={3}
                label={t("Form.About.Label")}
                errorMsg={error}
                disabled={isPending}
              />
            )}
          />
        </FormField> */}
        <FormField
          slotProps={{
            container: {
              sx: { display: { sm: "none" } },
            },
          }}
        >
          <FormSubmit
            color="error"
            type="reset"
            disabled={!isDirty}
            isLoading={isPending}
            variant="outlined"
            sx={{ borderRadius: 3 }}
            onClick={resetHandler}
            startIcon={<RefreshIcon />}
          >
            {t("ResetButton")}
          </FormSubmit>
        </FormField>
        <FormField
          slotProps={{
            container: {
              sx: { display: { sm: "none" } },
            },
          }}
        >
          <FormSubmit
            disabled={!isDirty}
            isLoading={isPending}
            sx={{ borderRadius: 3 }}
            startIcon={<SaveIcon />}
          >
            {t("SaveButton")}
          </FormSubmit>
        </FormField>
        <FormField
          slotProps={{
            container: {
              size: 12,
              justifyContent: "flex-end",
              columnGap: 2,
              sx: { display: { xs: "none", sm: "flex" } },
            },
          }}
        >
          <FormSubmit
            color="error"
            type="reset"
            disabled={!isDirty}
            isLoading={isPending}
            variant="outlined"
            sx={{ borderRadius: 3 }}
            onClick={resetHandler}
            fullWidth={false}
            startIcon={<RefreshIcon />}
          >
            {t("ResetButton")}
          </FormSubmit>
          <FormSubmit
            disabled={!isDirty}
            isLoading={isPending}
            sx={{ borderRadius: 3 }}
            startIcon={<SaveIcon />}
            fullWidth={false}
          >
            {t("SaveButton")}
          </FormSubmit>
        </FormField>
      </Grid>
    </Form>
  );
}
