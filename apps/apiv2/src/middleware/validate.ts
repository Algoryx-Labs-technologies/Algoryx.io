import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { AppError } from '@/types';

type ValidationSchema = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const validate = (schema: ValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(error);
      } else {
        next(new AppError(400, 'Validation failed'));
      }
    }
  };
};
