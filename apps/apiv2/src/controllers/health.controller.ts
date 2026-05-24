import { Request, Response, NextFunction } from 'express';
import { getHealthStatus } from '@/services/health.service';

export const getHealth = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const health = getHealthStatus();
    res.json({
      success: true,
      message: 'API is running',
      data: health,
    });
  } catch (error) {
    next(error);
  }
};
