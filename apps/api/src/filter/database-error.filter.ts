import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { GENERAL_ERROR, ResponseFailed } from "@repo/common/common.type";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

@Catch(QueryFailedError, EntityNotFoundError)
export class DatabaseErrorFilter implements ExceptionFilter {
  catch(exception: any) {
    if (exception instanceof QueryFailedError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const driverError: any = exception.driverError;
      // PostgreSQL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      switch (driverError.code) {
        case "23505": // unique_violation
          throw new ConflictException(
            new ResponseFailed(GENERAL_ERROR.DATABASE_CONFLICT_ERROR),
          );
        case "23503": // foreign_key_violation
          throw new BadRequestException(
            new ResponseFailed(GENERAL_ERROR.DATABASE_FK_ERROR),
          );
        case "23502": // not_null_violation
          throw new BadRequestException(
            new ResponseFailed(GENERAL_ERROR.DATABASE_NOT_NULL_ERROR),
          );
      }

      throw new InternalServerErrorException();
    }

    if (exception instanceof EntityNotFoundError) {
      throw new NotFoundException(
        new ResponseFailed(GENERAL_ERROR.DATABASE_ENTITY_NOT_FOUND_ERROR),
      );
    }

    throw new InternalServerErrorException();
  }
}
