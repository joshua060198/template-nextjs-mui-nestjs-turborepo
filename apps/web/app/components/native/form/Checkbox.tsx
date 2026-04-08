import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { ReactNode } from "react";

interface CheckboxContainerProps {
  children: ReactNode;
  title?: string;
  errorMsg?: string;
  slotProps?: {
    container?: FormControlProps;
  };
}

export function CheckboxContainer({
  children,
  title,
  errorMsg,
  slotProps,
}: CheckboxContainerProps) {
  return (
    <FormControl
      error={Boolean(errorMsg)}
      component="fieldset"
      {...slotProps?.container}
    >
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup>{children}</FormGroup>
      <FormHelperText>{errorMsg}</FormHelperText>
    </FormControl>
  );
}

interface CheckboxProps {
  label?: string | ReactNode;
  slotProps?: {
    container?: Omit<FormControlLabelProps, "control" | "label">;
  };
}

export function Checkbox({
  label,
  slotProps,
  ...props
}: CheckboxProps & MuiCheckboxProps): ReactNode {
  return (
    <FormControlLabel
      {...slotProps?.container}
      control={<MuiCheckbox {...props} />}
      label={label}
    />
  );
}
