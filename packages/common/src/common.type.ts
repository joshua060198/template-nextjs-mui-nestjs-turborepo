import { z, ZodError } from "zod";
import { FileId } from "./entity/file.entity.type.js";
import { UserId } from "./entity/user.entity.type.js";
import { zod } from "./util/zod.js";

export type FailedValidation = {
  code: string;
  message?: string;
  details: ZodError["issues"];
};
export type FailedOther = {
  code: string;
  message?: string;
};

export class ApiResponse {
  constructor(public success: boolean) {}
}

export class ResponseFailed extends ApiResponse {
  constructor(public error: FailedOther | FailedValidation) {
    super(false);
  }
}

export class ResponseSuccess<T> extends ApiResponse {
  constructor(public data: T) {
    super(true);
  }
}

export class ErrorCode {
  code: string;
  message?: string;

  protected constructor(
    serviceCode: string,
    errorCode: string,
    message?: string,
  ) {
    this.code = `${serviceCode}${errorCode}`;
    this.message = message;
  }
}

export class GENERAL_ERROR extends ErrorCode {
  static readonly UNCAUGHT = new GENERAL_ERROR(
    "001",
    "Uncaught Exception! Please check related service.",
  );
  static readonly DATABASE_CONFLICT_ERROR = new GENERAL_ERROR(
    "002",
    "Database Unique Constraint Violation",
  );
  static readonly DATABASE_FK_ERROR = new GENERAL_ERROR(
    "003",
    "Foreign Key Violation",
  );
  static readonly DATABASE_NOT_NULL_ERROR = new GENERAL_ERROR(
    "004",
    "Not Null Constraint Error",
  );
  static readonly DATABASE_ENTITY_NOT_FOUND_ERROR = new GENERAL_ERROR(
    "005",
    "Entity Not Found",
  );

  static readonly TARGET_ENTITY_FOR_UPDATE_NOT_FOUND = new GENERAL_ERROR(
    "006",
    "Update command executed but with empty target",
  );

  static readonly FORBIDDEN_ERROR = new GENERAL_ERROR(
    "007",
    "Missing permissions!",
  );

  private constructor(errorCode: string, message?: string) {
    super("00", errorCode, message);
  }
}

export class ValidationError extends ErrorCode {
  private static MODULE_CODE = "00";

  constructor(private readonly details: FailedValidation["details"]) {
    super(ValidationError.MODULE_CODE, "002", "Validation Error!");
  }

  get detail() {
    return this.details;
  }
}

export const createSuccessResponseSchema = <
  T extends z.core.$ZodType<
    unknown,
    unknown,
    z.core.$ZodTypeInternals<unknown, unknown>
  >,
>(
  dataSchema: T,
) => {
  return zod.object({
    success: zod.boolean(),
    data: dataSchema,
    responseTime: zod.string().optional(),
    timestamp: zod.iso.datetime().optional(),
  });
};

export const FailedResponseSchema = zod.object({
  success: zod.boolean(),
  error: zod.object({
    code: zod.string().length(5),
    msg: zod.string().max(128).optional(),
  }),
});

export type FailedResponse = z.infer<typeof FailedResponseSchema>;

export const BooleanResponseSchema = createSuccessResponseSchema(zod.boolean());

export type BooleanResponse = z.infer<typeof BooleanResponseSchema>;

export const StringArrayResponseSchema = createSuccessResponseSchema(
  zod.array(zod.string()),
);

export type StringArrayResponse = z.infer<typeof StringArrayResponseSchema>;

export const StringResponseSchema = createSuccessResponseSchema(
  zod.string().required(),
);

export type StringResponse = z.infer<typeof StringResponseSchema>;

export const FILE_PROCESSING_QUEUE = "file_processing_queue";

export enum FileProcessingJobName {
  GENERATE_THUMBNAIL = "thumbnail.generate",
  REMOVE_FILE = "file.remove",
  IDLING_FILE = "file.idle",
}

export enum FileProcessingIdlingFileJobOrigin {}

export interface BaseFileProcessingJob {
  fileId: FileId;
}

export type CreateThumbnailJob = BaseFileProcessingJob;
export type RemoveFileJob = BaseFileProcessingJob;
export type IdlingFileJob = BaseFileProcessingJob & {
  userId?: UserId;
};

export interface FileProcessingJob {
  [FileProcessingJobName.GENERATE_THUMBNAIL]: CreateThumbnailJob;
  [FileProcessingJobName.REMOVE_FILE]: RemoveFileJob;
  [FileProcessingJobName.IDLING_FILE]: IdlingFileJob;
}

export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      itemsPerPage: z.number(),
      totalItems: z.number(),
      currentPage: z.number(),
      totalPages: z.number(),
      sortBy: z.array(z.tuple([z.string(), z.string()])).optional(),
      searchBy: z.array(z.string()).optional(),
      search: z.string().optional(),
      select: z.array(z.string()).optional(),
      filter: z
        .record(z.string(), z.union([z.string(), z.array(z.string())]))
        .optional(),
    }),
    links: z.object({
      first: z.string().optional(),
      previous: z.string().optional(),
      current: z.string(),
      next: z.string().optional(),
      last: z.string().optional(),
    }),
  });
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy?: [string, string][];
    searchBy?: string[];
    search?: string;
    select?: string[];
    filter?: Record<string, string | string[]>;
  };
};
