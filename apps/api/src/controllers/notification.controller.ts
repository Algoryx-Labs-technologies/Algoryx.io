import { Response } from 'express';
import { randomUUID } from 'crypto';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export class NotificationController {
  /**
   * Create a notification
   * - If userId is provided: creates a user-specific notification
   * - If userId is null/not provided: creates a universal notification for all users
   */
  async createNotification(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { title, message, type, userId } = req.body;

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        id: randomUUID(),
        title,
        message,
        type: type || 'info',
        userId: userId || null, // null = universal notification for all users
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: userId 
        ? 'User-specific notification created successfully' 
        : 'Universal notification created successfully',
    });
  }

  /**
   * Get all notifications
   * - For admins: Returns ALL notifications (universal + all user-specific)
   * - For regular users: Returns universal notifications + their own user-specific notifications
   * - If userId query param is provided, filters to show only that user's notifications + universal ones
   */
  async getNotifications(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Get the user from database to check their role and userId
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
      select: { 
        id: true,
        role: true,
        Admin: {
          select: { uid: true }
        }
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const { userId } = req.query;

    // Build where clause
    const where: any = {};
    
    // Check if user is admin - admins should see ALL notifications
    const isAdmin = user.role === 'admin' && user.Admin !== null;
    
    if (userId && typeof userId === 'string') {
      // If userId query param is provided, filter to that user's notifications + universal
      where.OR = [
        { userId: null }, // Universal notifications
        { userId: userId }, // User-specific notifications for the specified user
      ];
    } else if (isAdmin) {
      // Admin users see ALL notifications (no filter)
      // Don't set where clause, so it returns everything
    } else {
      // Regular users see universal notifications + their own user-specific notifications
      where.OR = [
        { userId: null }, // Universal notifications
        { userId: user.id }, // Notifications for current user
      ];
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  }
}

export const notificationController = new NotificationController();

