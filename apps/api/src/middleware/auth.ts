import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/config/supabase';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers?.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.substring(7);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError(401, 'Invalid or expired token');
    }

    req.supabaseUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Admin authentication middleware - verifies user is an admin
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // First authenticate the user
    const authHeader = req.headers?.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.substring(7);
    
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      throw new AppError(401, 'Invalid or expired token');
    }

    req.supabaseUser = supabaseUser;

    // Find user in database using supabaseUserId (which is unique)
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: supabaseUser.id },
      include: { Admin: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Check if user is admin
    if (user.role !== 'admin' || !user.Admin) {
      throw new AppError(403, 'Admin access required');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers?.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.supabaseUser = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

