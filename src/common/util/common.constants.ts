import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export const DEFAULT_PAGE_SIZE = {
  USERS: 10,
  ORDERS: 5,
  CATEGORIES: 30,
  PRODUCTS: 20,
} as const satisfies Record<string, number>;
