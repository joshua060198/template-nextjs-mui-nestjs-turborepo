import { ResponseFailed } from "@repo/common/common.type";
import { useZodErrorMap } from "@web/libs/hooks/useZodErrorMap.hooks";
import { FieldValues, Path, useForm } from "react-hook-form";

export function useApplyApiValidationErrorToFormError<
  FormInput extends FieldValues,
>() {
  const errorMapper = useZodErrorMap();

  return {
    fn: (
      apiError: ResponseFailed | null,
      setError: ReturnType<typeof useForm<FormInput>>["setError"],
    ) => {
      if (apiError && apiError.error) {
        if ("details" in apiError.error) {
          for (const [key, value] of Object.entries(apiError.error.details)) {
            setError(key as `root.${string}` | "root" | Path<FormInput>, {
              message: errorMapper(value),
            });
          }
        }
      }
    },
    errorMapper,
  };
}

export function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char: string) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397),
        )
    : isoCode;
}

type Nullify<T> = T extends string
  ? T extends ""
    ? null
    : T
  : T extends undefined
    ? null
    : T extends object
      ? { [K in keyof T]: Nullify<T[K]> }
      : T;

export function convertEmptyValueToNull<T>(input: T): Nullify<T> {
  // Handle empty string and undefined directly
  if (input === "" || input === undefined) {
    return null as Nullify<T>;
  }

  // Handle arrays
  if (Array.isArray(input)) {
    return input.map(convertEmptyValueToNull) as unknown as Nullify<T>;
  }

  // Handle objects (and not null, since typeof null is 'object')
  if (input !== null && typeof input === "object") {
    const result = {} as Record<string, unknown>;
    for (const [key, value] of Object.entries(input)) {
      result[key] = convertEmptyValueToNull(value);
    }
    return result as Nullify<T>;
  }

  // Return primitives (number, boolean, null) as is
  return input as Nullify<T>;
}

/**
 import * as React from "react";
 import Autocomplete from "@mui/material/Autocomplete";
 import TextField from "@mui/material/TextField";
 import Box from "@mui/material/Box";
 import countries from "./countries";
 import { countryToFlag } from "./countryToFlag";

 export default function PhoneNumberInput() {
 const [country, setCountry] = React.useState(countries[0]);
 const [phone, setPhone] = React.useState("");

 return (
 <Box display="flex" gap={2}>

<Autocomplete
  options={countries}
autoHighlight
value={country}
onChange={(e, newValue) => setCountry(newValue)}
getOptionLabel={(option) =>
`+${option.phone} ${option.label}`
}
sx={{ width: 300 }}
renderOption={(props, option) => (
  <Box component="li" {...props}>
<span style={{ marginRight: 8 }}>
{countryToFlag(option.code)}
</span>
{option.label} (+{option.phone})
</Box>
)}
renderInput={(params) => (
  <TextField
    {...params}
label="Country"
inputProps={{
...params.inputProps,
      autoComplete: "new-password",
}}
/>
)}
/>

<TextField
  label="Phone Number"
value={phone}
onChange={(e) => setPhone(e.target.value)}
fullWidth
InputProps={{
    startAdornment: (
      <Box sx={{ mr: 1, fontWeight: "bold" }}>
    +{country?.phone}
    </Box>
),
}}
/>
</Box>
);
}


*/
