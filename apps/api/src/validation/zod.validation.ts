import { BadRequestException } from "@nestjs/common";
import { ResponseFailed, ValidationError } from "@repo/common/common.type";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError } from "zod";

const CustomZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: unknown) => {
    if (error instanceof ZodError)
      throw new BadRequestException(
        new ResponseFailed(new ValidationError(error.issues)),
      );

    throw new Error("Unknown Error!");
  },
});

export default CustomZodValidationPipe;
