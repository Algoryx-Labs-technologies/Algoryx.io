import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { supportTicketService } from '@/services/support-ticket.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';
import { Priority } from '@prisma/client';

export class SupportTicketController {
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

  async getAllTickets(req: AuthenticatedRequest, res: Response) {
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

    let tickets;
    if (clientId) {
      tickets = await supportTicketService.findByClientId(clientId);
    } else if (partnerId) {
      tickets = await supportTicketService.findByPartnerId(partnerId);
    } else {
      throw new AppError(404, 'Client or Partner profile not found');
    }

    res.json({
      success: true,
      data: tickets,
    });
  }

  async getTicketById(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const ticketId = Array.isArray(id) ? id[0] : id;

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

    const ticket = await supportTicketService.findById(ticketId, clientId || undefined, partnerId || undefined);

    if (!ticket) {
      throw new AppError(404, 'Support ticket not found');
    }

    res.json({
      success: true,
      data: ticket,
    });
  }

  async getTicketByTicketId(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { ticketId } = req.params;
    const ticketIdParam = Array.isArray(ticketId) ? ticketId[0] : ticketId;

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

    const ticket = await supportTicketService.findByTicketId(ticketIdParam, clientId || undefined, partnerId || undefined);

    if (!ticket) {
      throw new AppError(404, 'Support ticket not found');
    }

    res.json({
      success: true,
      data: ticket,
    });
  }

  async createTicket(req: AuthenticatedRequest, res: Response) {
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

    if (!clientId && !partnerId) {
      throw new AppError(404, 'Client or Partner profile not found');
    }

    // Prepare userName from firstName/lastName or email
    const userName = user.firstName 
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
      : user.email.split('@')[0];

    // Generate ticket ID
    const ticketId = supportTicketService.generateTicketId();

    // Validate priority
    const priority = req.body.priority as Priority;
    if (!priority || !['low', 'mid', 'high'].includes(priority)) {
      throw new AppError(400, 'Invalid priority. Must be low, mid, or high');
    }

    // Prepare ticket data
    const ticketData = {
      ticketId,
      userId: user.id,
      userName: userName,
      email: user.email,
      issueType: req.body.issueType,
      description: req.body.description,
      priority: priority,
      additionalDetails: req.body.additionalDetails,
      ...(clientId && { clientId }),
      ...(partnerId && { partnerId }),
    };

    const ticket = await supportTicketService.create(ticketData);

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Support ticket created successfully',
    });
  }

  async updateTicket(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const ticketId = Array.isArray(id) ? id[0] : id;

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

    const ticket = await supportTicketService.update(
      ticketId,
      req.body,
      clientId || undefined,
      partnerId || undefined
    );

    res.json({
      success: true,
      data: ticket,
      message: 'Support ticket updated successfully',
    });
  }

  async deleteTicket(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const ticketId = Array.isArray(id) ? id[0] : id;

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

    await supportTicketService.delete(ticketId, clientId || undefined, partnerId || undefined);

    res.json({
      success: true,
      message: 'Support ticket deleted successfully',
    });
  }
}

export const supportTicketController = new SupportTicketController();

