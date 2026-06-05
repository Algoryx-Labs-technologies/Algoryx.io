import { Request, Response, NextFunction } from 'express';
import { ExpenseType } from '@/models/expense.model';
import { createExpense, deleteExpense, listExpenses } from '@/services/expense.service';

export const getExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const type = req.query.type as ExpenseType | undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const expenses = await listExpenses({ type, search });

    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

export const postExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { type, projectId, title, description, amount, currency, expenseDate } = req.body;

    const expense = await createExpense({
      type,
      projectId,
      title,
      description,
      amount,
      currency,
      expenseDate,
    });

    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeExpense = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteExpense(id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
