import { Request, Response, NextFunction } from 'express';
import { PAYMENT_STATUSES, PaymentStatus } from '@/models/payment.model';
import {
  createPayment,
  deletePayment,
  listPayments,
  updatePayment,
} from '@/services/payment.service';

export const getPayments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = req.query.status as PaymentStatus | undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const payments = await listPayments({ status, search });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const postPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, amount, currency, deadline, status, description } = req.body;

    const payment = await createPayment({
      projectId,
      amount,
      currency,
      deadline,
      status,
      description,
    });

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const patchPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const { projectId, amount, currency, deadline, status, description } = req.body;

    const payment = await updatePayment(id, {
      projectId,
      amount,
      currency,
      deadline,
      status,
      description,
    });

    res.json({
      success: true,
      data: payment,
      message: 'Payment updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deletePayment(id);

    res.json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatuses = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: PAYMENT_STATUSES,
  });
};
