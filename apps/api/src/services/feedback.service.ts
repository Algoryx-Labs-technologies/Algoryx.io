import { prisma } from '@/config/database';
import { Feedback } from '@prisma/client';

export class FeedbackService {
  async create(data: {
    userId?: string;
    clientId?: string;
    partnerId?: string;
    overallRating: number;
    serviceQuality?: number;
    communication?: number;
    timeliness?: number;
    valueForMoney?: number;
    feedback?: string;
    wouldRecommend?: boolean;
    improvements?: string;
    favoriteFeature?: string;
    userName?: string;
    email?: string;
  }): Promise<Feedback> {
    return prisma.feedback.create({
      data,
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
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
      },
    });
  }
}

export const feedbackService = new FeedbackService();

