import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

export type TextFieldProps = MuiTextFieldProps & {
  errorMsg?: string;
};

export default function TextField({ errorMsg, ...props }: TextFieldProps) {
  return (
    <MuiTextField
      {...props}
      variant="outlined"
      fullWidth
      error={errorMsg !== undefined && errorMsg !== ""}
      helperText={errorMsg ? errorMsg : props.helperText}
    />
  );
}
