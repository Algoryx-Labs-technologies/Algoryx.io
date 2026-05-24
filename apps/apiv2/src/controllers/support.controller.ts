import { Request, Response, NextFunction } from 'express';
import { createSupportTicket } from '@/services/support.service';
import { ISupportAttachment } from '@/models/support-ticket.model';

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

export const postSupportTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, subject, category, priority, description } = req.body;

    let attachment: ISupportAttachment | undefined;
    if (req.file) {
      attachment = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      };
    }

    const record = await createSupportTicket({
      name,
      email,
      subject,
      category,
      priority,
      description,
      attachment,
      client: {
        ipAddress: getClientIp(req),
        userAgent: req.get('user-agent'),
        referer: req.get('referer'),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: record._id,
        name: record.name,
        email: record.email,
        subject: record.subject,
        category: record.category,
        priority: record.priority,
        description: record.description,
        hasAttachment: Boolean(record.attachment),
        createdAt: record.createdAt,
      },
      message: 'Support request submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};
