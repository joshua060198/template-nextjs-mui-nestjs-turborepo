/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CircularProgress,
  Autocomplete as MuiAutoComplete,
  AutocompleteProps as MuiAutoCompleteProps,
} from "@mui/material";
import { ChipTypeMap } from "@mui/material/Chip";
import TextField, {
  TextFieldProps,
} from "@web/components/native/form/TextField";
import * as React from "react";

interface AutocompleteProps<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
> extends Omit<
  MuiAutoCompleteProps<
    Value,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent
  >,
  "renderInput"
> {
  errorMsg?: string;
  textFieldProps?: TextFieldProps;
}

export default function AutoComplete<
  Value,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
>({
  errorMsg,
  textFieldProps,
  ...props
}: AutocompleteProps<
  Value,
  Multiple,
  DisableClearable,
  FreeSolo,
  ChipComponent
>) {
  return (
    <MuiAutoComplete
      fullWidth
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          errorMsg={errorMsg}
          variant="outlined"
          slotProps={{
            ...textFieldProps?.slotProps,
            input: {
              ...params.InputProps,
              ...textFieldProps?.slotProps?.input,
              endAdornment: (
                <>
                  {(textFieldProps?.slotProps?.input as any)?.endAdornment}
                  {params.InputProps.endAdornment}
                  {props.loading && <CircularProgress size={24} />}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
