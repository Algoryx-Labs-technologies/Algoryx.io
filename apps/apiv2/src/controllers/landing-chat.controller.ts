import { Request, Response, NextFunction } from 'express';
import {
  isLandingChatConfigured,
  sendLandingChat,
} from '@/services/landing-chat.service';
import { AppError } from '@/types';

export const postLandingChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isLandingChatConfigured()) {
      throw new AppError(
        503,
        'AI assistant is not configured. Set OPENAI_API_KEY in apps/apiv2/.env.',
      );
    }

    const { messages } = req.body as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    const reply = await sendLandingChat(messages);

    res.json({
      success: true,
      data: { message: reply },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    const message = error instanceof Error ? error.message : 'Chat failed';

    if (message === 'OPENAI_NOT_CONFIGURED') {
      return next(
        new AppError(
          503,
          'AI assistant is not configured. Set OPENAI_API_KEY in apps/apiv2/.env.',
        ),
      );
    }

    if (message.toLowerCase().includes('quota') || message.includes('Models attempted')) {
      return next(new AppError(429, message));
    }

    return next(
      new AppError(502, message || 'Unable to get a response from the assistant.'),
    );
  }
};
