import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { HttpError } from '../../../common/util/http-error.util';
import { extractFromText } from '../../../common/util/regex.util';
import { DatabaseError } from '../../interface/database-error.interface';

@Catch(QueryFailedError)
export class DatabaseFilterFilter implements ExceptionFilter {
  catch(exception: DatabaseError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { code, detail, table } = exception;

    const { httpError, description } = this.createErrorData(code, detail);

    if (!httpError) {
      // fallback if no matching error code is handled
      response.status(500).json({
        statusCode: 500,
        message: detail,
        error: 'Internal Server Error',
        meta: { table },
      });
      return;
    }

    const { status, error } = httpError;
    const { fieldName, fieldvalue } = this.extractMessageData(detail);
    const meta = { description, fieldName, fieldvalue, table };

    response.status(status).json({
      statusCode: status,
      message: detail,
      error,
      meta,
    });
  }

  private extractMessageData(message: string) {
    const fieldName = extractFromText(message, this.FIELD_NAME_REGEX);
    const fieldvalue = extractFromText(message, this.FIELD_VALUE_REGEX);
    return { fieldName, fieldvalue };
  }

  private readonly FIELD_NAME_REGEX = /key \((\w+)=/;
  private readonly FIELD_VALUE_REGEX = /=\((.*?)\)/;

  private createErrorData(
    code: string,
    message: string,
  ): { httpError?: HttpError; description?: string } {
    let httpError: HttpError | undefined;
    let description: string | undefined;

    switch (code) {
      case this.DatabaseErrorCode.ASSOCIATION_NOT_FOUND_OR_NOT_NULL_VOILATION:
        if (message.includes(this.MessageSnippet.ASSOCIATION_NOT_FOUND)) {
          httpError = HttpError.NOT_FOUND;
          description = this.Description.ASSOCIATION_NOT_FOUND;
        } else if (message.includes(this.MessageSnippet.NOT_NULL_VOILATION)) {
          httpError = HttpError.CONFLICT;
          description = this.Description.NOT_NULL_VOILATION;
        }
        break;

      case this.DatabaseErrorCode.UNIQUE_VIOLATION:
        httpError = HttpError.CONFLICT;
        description = this.Description.UNIQUE_VIOLATION;
        break;
    }

    return { httpError, description };
  }

  private readonly DatabaseErrorCode = {
    ASSOCIATION_NOT_FOUND_OR_NOT_NULL_VOILATION: '23503',
    UNIQUE_VIOLATION: '23505', // fixed UNIQUE violation code (Postgres: 23505)
  } as const satisfies Record<string, string>;

  private readonly MessageSnippet = {
    ASSOCIATION_NOT_FOUND: 'is not present',
    NOT_NULL_VOILATION: 'is still references',
  } as const satisfies Record<string, string>;

  private readonly Description = {
    ASSOCIATION_NOT_FOUND: 'Associated entity not found',
    NOT_NULL_VOILATION: 'Cannot delete due to NOT NULL constraints',
    UNIQUE_VIOLATION: 'Unique constraint violation',
  } as const satisfies Record<string, string>;
}
