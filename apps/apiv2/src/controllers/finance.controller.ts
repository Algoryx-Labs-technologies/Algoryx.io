import { Request, Response, NextFunction } from 'express';
import { getFinanceSummary, getLedger } from '@/services/finance.service';

export const getSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const summary = await getFinanceSummary();

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getFinanceLedger = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ledger = await getLedger();

    res.json({
      success: true,
      data: ledger,
    });
  } catch (error) {
    next(error);
  }
};
