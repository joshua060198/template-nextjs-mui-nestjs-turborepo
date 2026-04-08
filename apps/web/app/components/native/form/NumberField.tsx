import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as React from "react";

/**
 * This component is a placeholder for FormControl to correctly set the shrink label state on SSR.
 */
function SSRInitialFilled(_: BaseNumberField.Root.Props) {
  return null;
}
SSRInitialFilled.muiName = "Input";

export default function NumberField({
  id: idProp,
  label,
  errorMsg,
  size = "medium",
  onStepClick,
  ...other
}: BaseNumberField.Root.Props & {
  label?: React.ReactNode;
  size?: "small" | "medium";
  errorMsg?: string;
  onStepClick?: (newValue: number) => void;
}) {
  let id = React.useId();
  if (idProp) {
    id = idProp;
  }
  return (
    <BaseNumberField.Root
      {...other}
      render={(props, state) => (
        <FormControl
          size={size}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={Boolean(errorMsg)}
          variant="outlined"
        >
          {props.children}
        </FormControl>
      )}
    >
      <SSRInitialFilled {...other} />
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(props, state) => (
          <OutlinedInput
            label={label}
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            slotProps={{
              input: props,
            }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  flexDirection: "column",
                  maxHeight: "unset",
                  alignSelf: "stretch",
                  borderLeft: "1px solid",
                  borderColor: "divider",
                  ml: 0,
                  "& button": {
                    py: 0,
                    flex: 1,
                    borderRadius: 0.5,
                  },
                }}
              >
                <BaseNumberField.Increment
                  render={
                    <IconButton
                      size={size}
                      aria-label="Increase"
                      onClick={() => {
                        let finalStep = 1;
                        if (other.step) {
                          if (other.step !== "any") finalStep = other.step;
                        }
                        const input = Number(state.inputValue);
                        if (
                          (other.max && input + finalStep <= other.max) ||
                          other.max === undefined
                        ) {
                          if (onStepClick) {
                            onStepClick(Number(state.inputValue) + finalStep);
                          }
                        }
                      }}
                    />
                  }
                >
                  <KeyboardArrowUpIcon
                    fontSize={size}
                    sx={{ transform: "translateY(2px)" }}
                  />
                </BaseNumberField.Increment>

                <BaseNumberField.Decrement
                  render={
                    <IconButton
                      size={size}
                      aria-label="Decrease"
                      onClick={() => {
                        let finalStep = 1;
                        if (other.step) {
                          if (other.step !== "any") finalStep = other.step;
                        }
                        const input = Number(state.inputValue);
                        if (
                          (other.min && input - finalStep <= other.min) ||
                          other.max === undefined
                        ) {
                          if (onStepClick) {
                            onStepClick(Number(state.inputValue) - finalStep);
                          }
                        }
                      }}
                    />
                  }
                >
                  <KeyboardArrowDownIcon
                    fontSize={size}
                    sx={{ transform: "translateY(-2px)" }}
                  />
                </BaseNumberField.Decrement>
              </InputAdornment>
            }
            sx={{ pr: 0 }}
          />
        )}
      />
      {errorMsg && (
        <FormHelperText sx={{ ml: 0, "&:empty": { mt: 0 } }}>
          {errorMsg}
        </FormHelperText>
      )}
    </BaseNumberField.Root>
  );
}
