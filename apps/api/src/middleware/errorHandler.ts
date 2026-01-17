import { Request, Response, NextFunction } from 'express';
import { handleError } from '@/utils/errors';
import { logger } from '@/utils/logger';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', error);
  handleError(error, res);
};

