import { Response } from 'express';
import { AppError } from '@/types';

export const handleError = (error: unknown, res: Response) => {
  // Prisma errors - detect by error code pattern (P####)
  // This works without importing Prisma, which may not be generated yet
  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = (error as any).code;
    if (typeof errorCode === 'string' && errorCode.startsWith('P')) {
      // Prisma error codes start with 'P'
      if (errorCode === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'A record with this value already exists',
        });
      }
      if (errorCode === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Record not found',
        });
      }
    }
  }

  // Custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  // Validation errors (Zod)
  if (error && typeof error === 'object' && 'issues' in error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      errors: (error as any).issues.reduce((acc: any, issue: any) => {
        const path = issue.path.join('.');
        if (!acc[path]) acc[path] = [];
        acc[path].push(issue.message);
        return acc;
      }, {}),
    });
  }

  // Unknown errors
  console.error('Unhandled error:', error);
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : (error as Error).message,
  });
};

