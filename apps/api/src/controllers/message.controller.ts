import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { messageService } from '@/services/message.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';
import { getWebSocketService } from '@/services/websocket-instance';

export class MessageController {
  /**
   * Get the current user from the request
   */
  private async getCurrentUser(req: AuthenticatedRequest) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  /**
   * Get all conversations for the current user (admin or client)
   */
  async getAllConversations(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);

    // Only admin and client can access conversations
    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can access conversations');
    }

    const conversations = await messageService.getConversations(user.id);

    res.json({
      success: true,
      data: conversations,
    });
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);
    const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can access conversations');
    }

    if (!conversationId) {
      throw new AppError(400, 'Conversation ID is required');
    }

    const conversation = await messageService.getConversationById(conversationId, user.id);

    if (!conversation) {
      throw new AppError(404, 'Conversation not found');
    }

    res.json({
      success: true,
      data: conversation,
    });
  }

  /**
   * Get messages for a specific conversation
   */
  async getConversationMessages(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);
    const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can access messages');
    }

    if (!conversationId) {
      throw new AppError(400, 'Conversation ID is required');
    }

    const messages = await messageService.getConversationMessages(conversationId, user.id);

    // Mark messages as seen when user views them
    await messageService.markAsSeen(conversationId, user.id);

    res.json({
      success: true,
      data: messages,
    });
  }

  /**
   * Create a new message
   */
  async createMessage(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);
    const { recipientId, content, conversationId } = req.body;

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can send messages');
    }

    if (!recipientId || !content) {
      throw new AppError(400, 'Missing required fields: recipientId, content');
    }

    // Verify recipient exists and is admin or client
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new AppError(404, 'Recipient not found');
    }

    if (recipient.role !== 'admin' && recipient.role !== 'client') {
      throw new AppError(400, 'Can only message admins and clients');
    }

    // Prevent users from messaging themselves
    if (user.id === recipientId) {
      throw new AppError(400, 'Cannot send message to yourself');
    }

    const message = await messageService.createMessage({
      senderId: user.id,
      recipientId,
      content,
      conversationId,
    });

    // Emit WebSocket events for real-time updates
    try {
      const wsService = getWebSocketService();
      if (wsService) {
        // Emit to recipient (new message)
        wsService.emitToUser(recipientId, 'message:received', message);
        
        // Update unread counts via WebSocket
        const senderUnread = await messageService.getUnreadCount(user.id);
        const recipientUnread = await messageService.getUnreadCount(recipientId);
        
        wsService.emitToUser(user.id, 'unread_count', { count: senderUnread });
        wsService.emitToUser(recipientId, 'unread_count', { count: recipientUnread });
        
        // Notify both users about conversation update
        wsService.emitToUser(user.id, 'conversation:updated', {
          conversationId: message.conversationId,
        });
        wsService.emitToUser(recipientId, 'conversation:updated', {
          conversationId: message.conversationId,
        });
      }
    } catch (wsError) {
      // WebSocket error shouldn't fail the HTTP request
      console.error('WebSocket emit error:', wsError);
    }

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    });
  }

  /**
   * Mark conversation as read/seen
   */
  async markConversationAsRead(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);
    const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can mark conversations as read');
    }

    if (!conversationId) {
      throw new AppError(400, 'Conversation ID is required');
    }

    await messageService.markAsSeen(conversationId, user.id);

    // Notify other user via WebSocket that messages were seen
    try {
      const wsService = getWebSocketService();
      if (wsService) {
        const conversation = await messageService.getConversationById(conversationId, user.id);
        if (conversation) {
          wsService.emitToUser(conversation.otherUserId, 'message:seen', {
            conversationId,
            seenBy: user.id,
          });
        }
      }
    } catch (wsError) {
      console.error('WebSocket emit error:', wsError);
    }

    res.json({
      success: true,
      message: 'Messages marked as seen',
    });
  }

  /**
   * Mark a specific message as seen
   */
  async markMessageAsSeen(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);
    const messageId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can mark messages as seen');
    }

    if (!messageId) {
      throw new AppError(400, 'Message ID is required');
    }

    await messageService.markMessageAsSeen(messageId, user.id);

    res.json({
      success: true,
      message: 'Message marked as seen',
    });
  }

  /**
   * Get unread count for the current user
   */
  async getUnreadCount(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can get unread count');
    }

    const count = await messageService.getUnreadCount(user.id);

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  }

  /**
   * Get unread count for a specific conversation
   */
  async getConversationUnreadCount(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);
    const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (user.role !== 'admin' && user.role !== 'client') {
      throw new AppError(403, 'Only admins and clients can get unread count');
    }

    if (!conversationId) {
      throw new AppError(400, 'Conversation ID is required');
    }

    const count = await messageService.getConversationUnreadCount(conversationId, user.id);

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  }

  /**
   * Get all clients (for admin to select who to message)
   */
  async getClients(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);

    if (user.role !== 'admin') {
      throw new AppError(403, 'Only admins can access client list');
    }

    const clients = await prisma.user.findMany({
      where: {
        role: 'client',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: clients,
    });
  }

  /**
   * Get all admins (for client to select who to message)
   */
  async getAdmins(req: AuthenticatedRequest, res: Response) {
    const user = await this.getCurrentUser(req);

    if (user.role !== 'client') {
      throw new AppError(403, 'Only clients can access admin list');
    }

    const admins = await prisma.user.findMany({
      where: {
        role: 'admin',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.json({
      success: true,
      data: admins,
    });
  }
}

export const messageController = new MessageController();
