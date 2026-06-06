import { Response } from 'express';
import { AppError } from '@/types';

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(error.field ? { field: error.field } : {}),
    });
  }

  if (error && typeof error === 'object' && 'issues' in error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      errors: (error as { issues: { path: (string | number)[]; message: string }[] }).issues.reduce(
        (acc, issue) => {
          const path = issue.path.join('.');
          if (!acc[path]) acc[path] = [];
          acc[path].push(issue.message);
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : (error as Error).message,
  });
};
