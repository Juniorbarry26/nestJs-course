import { HttpStatus } from '@nestjs/common';

export const HttpError = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    error: 'not found',
  },
} as const satisfies Record<string, IhttpError>;

interface IhttpError {
  readonly status: HttpStatus;
  readonly error: string;
}
