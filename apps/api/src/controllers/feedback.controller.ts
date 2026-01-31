import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { feedbackService } from '@/services/feedback.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export class FeedbackController {
  async getClientId(userId: string): Promise<string | null> {
    const client = await prisma.client.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return client?.uid || null;
  }

  async getPartnerId(userId: string): Promise<string | null> {
    const partner = await prisma.partner.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return partner?.uid || null;
  }

  async createFeedback(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID and partner ID
    const clientId = await this.getClientId(user.id);
    const partnerId = await this.getPartnerId(user.id);

    // Get user name from firstName and lastName
    const userName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || null;

    const feedbackData = {
      userId: user.id,
      userName: userName,
      email: user.email,
      overallRating: req.body.overallRating,
      serviceQuality: req.body.serviceQuality || undefined,
      communication: req.body.communication || undefined,
      timeliness: req.body.timeliness || undefined,
      valueForMoney: req.body.valueForMoney || undefined,
      feedback: req.body.feedback || undefined,
      wouldRecommend: req.body.wouldRecommend !== undefined ? req.body.wouldRecommend : undefined,
      improvements: req.body.improvements || undefined,
      favoriteFeature: req.body.favoriteFeature || undefined,
      ...(clientId && { clientId }),
      ...(partnerId && { partnerId }),
    };

    const feedback = await feedbackService.create(feedbackData);

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully',
    });
  }

  async getTopFeedback(req: AuthenticatedRequest, res: Response) {
    try {
      const topFeedbacks = await prisma.feedback.findMany({
        where: {
          isTopFeedback: true,
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
          Client: {
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
          },
          Partner: {
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
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      res.json({
        success: true,
        data: topFeedbacks,
        count: topFeedbacks.length,
      });
    } catch (error: any) {
      throw new AppError(500, `Failed to fetch top feedback: ${error.message}`);
    }
  }
}

export const feedbackController = new FeedbackController();

