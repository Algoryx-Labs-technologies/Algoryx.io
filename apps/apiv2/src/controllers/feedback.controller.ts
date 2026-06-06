import { Request, Response, NextFunction } from 'express';
import {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  listFeedback,
} from '@/services/feedback.service';
import { FeedbackSource, FeedbackType } from '@/models/feedback.model';

const getClientIp = (req: Request): string | undefined => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].trim();
  }
  return req.ip || req.socket.remoteAddress;
};

export const postFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, type, rating, message } = req.body;

    const record = await createFeedback({
      name,
      email,
      type,
      rating,
      message,
      client: {
        ipAddress: getClientIp(req),
        userAgent: req.get('user-agent'),
        referer: req.get('referer'),
      },
      source: 'landing_feedback',
    });

    res.status(201).json({
      success: true,
      data: {
        id: record._id,
        name: record.name,
        email: record.email,
        type: record.type,
        rating: record.rating,
        message: record.message,
        source: record.source,
        createdAt: record.createdAt,
      },
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const type = req.query.type as FeedbackType | undefined;
    const source = req.query.source as FeedbackSource | undefined;

    const items = await listFeedback({
      search,
      type,
      source,
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const item = await getFeedbackById(id);

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    await deleteFeedback(id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
