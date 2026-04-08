import { Button, ButtonProps, Grid, GridProps } from "@mui/material";
import {
  ComponentProps,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  FormProvider,
  Path,
  useForm,
  useFormContext,
} from "react-hook-form";

interface FormProps<T extends FieldValues, K> {
  children: ReactNode;
  submitHandler: () => void;
  slotProps?: {
    container?: Omit<K, "children">;
    form?: ComponentProps<"form">;
  };
  providers: ReturnType<typeof useForm<T>>;
  slot?: {
    Container?: React.ComponentType<PropsWithChildren<K>>;
  };
}

export function Form<T extends FieldValues, K = GridProps>({
  children,
  submitHandler,
  slotProps,
  providers,
  slot,
}: FormProps<T, K>) {
  return (
    <FormProvider {...providers}>
      <form noValidate onSubmit={submitHandler} {...slotProps?.form}>
        {slot?.Container ? (
          <slot.Container {...(slotProps?.container as PropsWithChildren<K>)}>
            {children}
          </slot.Container>
        ) : (
          <Grid container spacing={2} {...slotProps?.container}>
            {children}
          </Grid>
        )}
      </form>
    </FormProvider>
  );
}

interface FormFieldProps {
  children: ReactNode;
  slotProps?: {
    container?: GridProps;
  };
}

export function FormField({ children, slotProps }: FormFieldProps) {
  return (
    <Grid size={12} {...slotProps?.container}>
      {children}
    </Grid>
  );
}

interface FormControlProps<T extends FieldValues, N extends Path<T> = Path<T>> {
  name: N;
  render: (props: {
    field: ControllerRenderProps<T, N>;
    error?: string;
  }) => ReactElement;
}

export function FormControl<
  T extends FieldValues,
  N extends Path<T> = Path<T>,
>({ name, render }: FormControlProps<T, N>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) =>
        render({
          field,
          error: fieldState.error?.message as string | undefined,
        })
      }
    />
  );
}

interface FormSubmitProps {
  children: ReactNode;
  isLoading?: boolean;
}

export function FormSubmit({
  isLoading,
  ...props
}: FormSubmitProps & ButtonProps) {
  return (
    <Button
      loading={isLoading}
      fullWidth
      variant="contained"
      color="success"
      type="submit"
      {...props}
    >
      {props.children}
    </Button>
  );
}

export function PositiveFormSubmit(props: FormSubmitProps) {
  return (
    <FormSubmit color="success" {...props}>
      {props.children}
    </FormSubmit>
  );
}

export function NegativeFormSubmit(props: FormSubmitProps) {
  return (
    <FormSubmit color="error" variant="outlined" {...props}>
      {props.children}
    </FormSubmit>
  );
}

export function createFormControl<T extends FieldValues>() {
  return function FormControl<N extends Path<T> = Path<T>>({
    name,
    render,
  }: FormControlProps<T, N>) {
    const { control } = useFormContext<T>();
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) =>
          render({ field, error: fieldState.error?.message })
        }
      />
    );
  };
}
