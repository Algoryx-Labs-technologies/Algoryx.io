import { Response } from 'express';
import { AppError } from '@/types';
import { Prisma } from '@prisma/client';

export const handleError = (error: unknown, res: Response) => {
  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'A record with this value already exists',
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
      });
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

