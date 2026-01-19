import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { messageService } from '@/services/message.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export class MessageController {
  async getClientId(userId: string): Promise<string | null> {
    const client = await prisma.client.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return client?.uid || null;
  }

  async getAllConversations(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const conversations = await messageService.getConversations(clientId);

    // TODO: Transform conversations to include recipient info
    // This would require joining with User/Admin/Partner tables
    const conversationsWithRecipient = conversations.map((conv: any) => ({
      ...conv,
      recipientName: 'Technical Analyst', // Would come from User table
      recipientEmail: 'analyst@algoryx.com', // Would come from User table
    }));

    res.json({
      success: true,
      data: conversationsWithRecipient,
    });
  }

  async getConversationById(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const conversation = await messageService.getConversationById(id, clientId);

    if (!conversation) {
      throw new AppError(404, 'Conversation not found');
    }

    // TODO: Include recipient info
    res.json({
      success: true,
      data: {
        ...conversation,
        recipientName: 'Technical Analyst',
        recipientEmail: 'analyst@algoryx.com',
      },
    });
  }

  async getConversationMessages(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const messages = await messageService.getConversationMessages(id, clientId);

    // Mark messages as read
    await messageService.markAsRead(id, clientId);

    // TODO: Include sender/recipient info
    const messagesWithUsers = messages.map((msg: any) => ({
      ...msg,
      senderName: msg.senderRole === 'client' ? 'You' : 'Technical Analyst',
      recipientName: msg.recipientRole === 'client' ? 'You' : 'Technical Analyst',
    }));

    res.json({
      success: true,
      data: messagesWithUsers,
    });
  }

  async createMessage(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const { recipientId, recipientRole, conversationId, subject, content } = req.body;

    if (!recipientId || !recipientRole || !content) {
      throw new AppError(400, 'Missing required fields: recipientId, recipientRole, content');
    }

    // Validate recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new AppError(404, 'Recipient not found');
    }

    if (recipient.role !== recipientRole) {
      throw new AppError(400, 'Recipient role mismatch');
    }

    const message = await messageService.createMessage({
      clientId,
      recipientId,
      recipientRole,
      conversationId,
      subject,
      content,
    });

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    });
  }

  async markConversationAsRead(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    await messageService.markAsRead(id, clientId);

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  }

  async getUnreadCount(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const count = await messageService.getUnreadCount(clientId);

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  }
}

export const messageController = new MessageController();

