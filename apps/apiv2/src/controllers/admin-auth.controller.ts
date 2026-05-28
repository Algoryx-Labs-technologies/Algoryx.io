import { Request, Response, NextFunction } from 'express';
import { loginAdmin } from '@/services/admin-auth.service';
import { AuthenticatedRequest } from '@/middleware/authenticateAdmin';

export const adminLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = loginAdmin(req.body);
    res.json({
      success: true,
      message: 'Login successful',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const adminMe = (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      admin: req.admin,
    },
  });
};
