import * as z from 'zod';
import { dayjs } from './dayjs.js';

/* ------------------------------------------------ */
/*                   Custom Types                   */
/* ------------------------------------------------ */

type DateOptions = {
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: string;
  maxDate?: string;
};

export type AvailableUUIDBrand =
  | 'UserId'
  | 'LoginActivityId'
  | 'PermissionId'
  | 'RoleId'
  | 'UserPermissionId'
  | 'FileId'
  | 'FileShareId';

export type AvailableIntBrand = 'sample';

type AvailableBrand = AvailableUUIDBrand | AvailableIntBrand;

export type Brand<T, B extends AvailableBrand> = T & { readonly __brand: B };

export type BrandedId<B extends AvailableUUIDBrand> = Brand<string, B>;
export type BrandedIntId<B extends AvailableIntBrand> = Brand<number, B>;

/* ------------------------------------------------ */
/*            Enhanced String Interface             */
/* ------------------------------------------------ */

export type EnhancedZodString = z.ZodString & {
  required(message?: string): EnhancedZodString;
  phoneNumber(message?: string): EnhancedZodString;
  validUUID(message?: string): EnhancedZodString;
  dateString(options?: DateOptions): EnhancedZodString;
};

export type EnhancedZodObject<T extends z.ZodObject<any>> = T & {
  sameAs: <K extends keyof z.infer<T> & string>(
    field: K,
    compareTo: K,
    translationKey: string,
    message?: string,
  ) => EnhancedZodObject<T>;
  // extend: (shape: z.ZodRawShape) => EnhancedZodObject<z.ZodObject<any>>;
  // pick: (
  //   keys: (keyof z.infer<T> & string)[],
  // ) => EnhancedZodObject<z.ZodObject<any>>;
  // omit: (
  //   keys: (keyof z.infer<T> & string)[],
  // ) => EnhancedZodObject<z.ZodObject<any>>;
  // merge: <U extends z.ZodObject<any>>(
  //   other: U,
  // ) => EnhancedZodObject<z.ZodObject<any>>;
};

/* ------------------------------------------------ */
/*              Enhancement Function                */
/* ------------------------------------------------ */

function enhanceString(schema: z.ZodString): EnhancedZodString {
  const enhanced = schema as EnhancedZodString;

  enhanced.required = (message?: string) =>
    enhanceString(schema.min(1, message));

  enhanced.phoneNumber = () =>
    enhanceString(
      schema.superRefine((val: string, ctx) => {
        const phoneRegex = /^\+\d{1,3} \d{7,15}$/;
        if (!phoneRegex.test(val)) {
          ctx.addIssue({
            code: 'custom',
            params: { customCode: 'invalid_phone_number' },
          });
        }
      }),
    );

  enhanced.validUUID = () =>
    enhanceString(
      schema.superRefine((val: string, ctx) => {
        const result = z.uuid().safeParse(val);
        if (!result.success) {
          ctx.addIssue({
            code: 'invalid_format',
            format: 'uuid',
          });
        }
      }),
    );

  enhanced.dateString = (options: DateOptions = {}) =>
    enhanceString(
      schema.superRefine((val: string, ctx) => {
        const instance = dayjs(val, 'YYYY-MM-DD', true);
        const now = dayjs();

        if (!instance.isValid()) {
          ctx.addIssue({
            code: 'custom',
            params: { customCode: 'invalid_date_string' },
          });
          return;
        }

        if (options.disableFuture && instance.isAfter(now)) {
          ctx.addIssue({
            code: 'custom',
            params: { customCode: 'disable_future' },
          });
        }

        if (options.disablePast && instance.isBefore(now)) {
          ctx.addIssue({
            code: 'custom',
            params: { customCode: 'disable_past' },
          });
        }

        if (options.minDate) {
          const min = dayjs(options.minDate, 'YYYY-MM-DD', true);
          if (instance.isBefore(min)) {
            ctx.addIssue({
              code: 'custom',
              params: {
                customCode: 'min_date',
                minDate: min.format('DD-MM-YYYY'),
              },
            });
          }
        }

        if (options.maxDate) {
          const max = dayjs(options.maxDate, 'YYYY-MM-DD', true);
          if (instance.isAfter(max)) {
            ctx.addIssue({
              code: 'custom',
              params: {
                customCode: 'max_date',
                maxDate: max.format('DD-MM-YYYY'),
              },
            });
          }
        }
      }),
    );

  return enhanced;
}

function enhanceObject<T extends z.ZodObject<any>>(
  schema: T,
): EnhancedZodObject<T> {
  const enhanced = schema as EnhancedZodObject<T>;

  enhanced.sameAs = (field, compareTo, translationKey) =>
    enhanceObject(
      schema.superRefine((data, ctx) => {
        if (data[field] !== data[compareTo]) {
          ctx.addIssue({
            code: 'custom',
            path: [compareTo],
            params: {
              customCode: 'fields_not_match',
              field,
              compareTo,
              translationKey,
            },
          });
        }
      }),
    );
  // -----------------------------
  // wrap extend / pick / omit / merge
  // -----------------------------
  // const wrap =
  //   (fn: (...args: any[]) => any) =>
  //   (...args: any[]) =>
  //     enhanceObject(fn(...args));
  //
  // enhanced.extend = wrap(schema.extend.bind(schema));
  // enhanced.pick = wrap(schema.pick.bind(schema));
  // enhanced.omit = wrap(schema.omit.bind(schema));
  // enhanced.merge = wrap(schema.merge.bind(schema));

  return enhanced;
}

/* ------------------------------------------------ */
/*                  Exported API                    */
/* ------------------------------------------------ */

export const zod = {
  ...z,
  string: (): EnhancedZodString => enhanceString(z.string()),
  object: <T extends z.ZodRawShape>(shape: T) => enhanceObject(z.object(shape)),
};

/* ------------------------------------------------ */
/*                 Branded ID Helper                */
/* ------------------------------------------------ */

export function brandedUUIDId<B extends AvailableUUIDBrand>() {
  return zod
    .string()
    .required()
    .validUUID()
    .transform((val) => val as BrandedId<B>);
}

export function brandedIntId<B extends AvailableIntBrand>() {
  return zod.int().transform((val) => val as BrandedIntId<B>);
}

export const DateInputSchema = zod.preprocess((value) => {
  if (typeof value === 'string' || value instanceof Date) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
}, zod.date());
