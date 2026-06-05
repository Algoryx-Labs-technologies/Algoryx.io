import { Request, Response, NextFunction } from 'express';
import { getDashboardSummary } from '@/services/dashboard.service';

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary = await getDashboardSummary();

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
