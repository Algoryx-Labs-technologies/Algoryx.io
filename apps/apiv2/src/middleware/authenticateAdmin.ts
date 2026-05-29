import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';
import { verifyAdminToken } from '@/services/admin-auth.service';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    role: 'admin';
  };
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    const token = authHeader.slice(7);
    const payload = verifyAdminToken(token);

    req.admin = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
