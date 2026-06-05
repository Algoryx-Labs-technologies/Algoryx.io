import { Request, Response, NextFunction } from 'express';
import {
  createSupportTicket,
  deleteSupportTicket,
  getSupportTicketById,
  listSupportTickets,
} from '@/services/support.service';
import { SupportCategory, SupportPriority, SupportSource } from '@/models/support-ticket.model';

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

    const record = await createSupportTicket({
      name,
      email,
      subject,
      category,
      priority,
      description,
      client: {
        ipAddress: getClientIp(req),
        userAgent: req.get('user-agent'),
        referer: req.get('referer'),
      },
      source: 'landing_help',
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
        source: record.source,
        createdAt: record.createdAt,
      },
      message: 'Support request submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getSupportTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const category = req.query.category as SupportCategory | undefined;
    const priority = req.query.priority as SupportPriority | undefined;
    const source = req.query.source as SupportSource | undefined;

    const tickets = await listSupportTickets({
      search,
      category,
      priority,
      source,
    });

    res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getSupportTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const ticket = await getSupportTicketById(id);

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSupportTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteSupportTicket(id);

    res.json({
      success: true,
      message: 'Support ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
