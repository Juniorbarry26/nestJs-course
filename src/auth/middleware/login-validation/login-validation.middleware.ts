import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const ValidationMiddleware = <TDto extends new (...args: any[]) => any>(
  DtoClass: TDto,
) => {
  @Injectable()
  class M implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
      const dto = plainToInstance(DtoClass, req.body);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length) {
        const errorMessage = errors.flatMap(
          (error) => Object.values(error.constraints ?? {}), // ✅ fix: safe fallback
        );
        throw new BadRequestException(errorMessage);
      }

      next();
    }
  }

  return M; // ✅ fix: return the class
};
