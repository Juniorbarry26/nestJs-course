import { applyDecorators } from '@nestjs/common';
import {
  IsBoolean as DEFAULTIsBoolean,
  ValidationOptions,
} from 'class-validator';
import { ToBoolean } from '../transformers/to-boolean.decorator';

/**
 *
 * Checks if the value is boolean. Works with query params
 */
export const IsBoolean = (
  validationOptions: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(DEFAULTIsBoolean(validationOptions), ToBoolean());
