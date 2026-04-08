import { Alert, AlertProps, FormHelperTextProps } from "@mui/material";

export default function AlertBelowFormField(
  props: FormHelperTextProps & AlertProps,
) {
  return <Alert {...props}>{props.children}</Alert>;
}
