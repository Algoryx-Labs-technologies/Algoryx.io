import { prisma } from '@/config/database';
import { AppError } from '@/types';

export class MessageService {
  /**
   * Generate a consistent conversation ID for two users
   */
  private generateConversationId(userId1: string, userId2: string): string {
    // Sort user IDs to ensure consistent conversation ID regardless of order
    const sortedIds = [userId1, userId2].sort();
    return `conv_${sortedIds[0]}_${sortedIds[1]}`;
  }

  /**
   * Get all conversations for a user (admin or client)
   */
  async getConversations(userId: string) {
    // Get all unique conversations where user is either sender or recipient
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
      include: {
        SenderUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        RecipientUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Group by conversationId and get the latest message for each conversation
    const conversationMap = new Map<string, typeof messages[0]>();
    
    for (const message of messages) {
      const convId = message.conversationId;
      const existing = conversationMap.get(convId);
      
      if (!existing || message.created_at > existing.created_at) {
        conversationMap.set(convId, message);
      }
    }

    // Get unread counts for each conversation
    const conversations = Array.from(conversationMap.values()).map((latestMessage) => {
      const otherUserId = latestMessage.senderId === userId 
        ? latestMessage.recipientId 
        : latestMessage.senderId;
      
      const otherUser = latestMessage.senderId === userId
        ? latestMessage.RecipientUser
        : latestMessage.SenderUser;

      return {
        conversationId: latestMessage.conversationId,
        otherUserId,
        otherUser: {
          id: otherUser.id,
          email: otherUser.email,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          role: otherUser.role,
        },
        lastMessage: {
          id: latestMessage.id,
          content: latestMessage.content,
          status: latestMessage.status,
          created_at: latestMessage.created_at,
        },
        unreadCount: 0, // Will be calculated separately
      };
    });

    // Calculate unread counts
    for (const conv of conversations) {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.conversationId,
          recipientId: userId,
          status: 'delivered',
        },
      });
      conv.unreadCount = unreadCount;
    }

    return conversations.sort((a, b) => 
      b.lastMessage.created_at.getTime() - a.lastMessage.created_at.getTime()
    );
  }

  /**
   * Get messages for a specific conversation
   */
  async getConversationMessages(conversationId: string, userId: string) {
    // Verify user is part of this conversation
    const conversation = await prisma.message.findFirst({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new AppError(404, 'Conversation not found or access denied');
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        SenderUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        RecipientUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return messages;
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(conversationId: string, userId: string) {
    const conversation = await prisma.message.findFirst({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
      include: {
        SenderUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        RecipientUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!conversation) {
      return null;
    }

    const otherUserId = conversation.senderId === userId 
      ? conversation.recipientId 
      : conversation.senderId;
    
    const otherUser = conversation.senderId === userId
      ? conversation.RecipientUser
      : conversation.SenderUser;

    return {
      conversationId,
      otherUserId,
      otherUser: {
        id: otherUser.id,
        email: otherUser.email,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        role: otherUser.role,
      },
    };
  }

  /**
   * Create a new message
   */
  async createMessage(data: {
    senderId: string;
    recipientId: string;
    content: string;
    conversationId?: string;
  }) {
    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: data.recipientId },
    });

    if (!recipient) {
      throw new AppError(404, 'Recipient not found');
    }

    // Verify sender exists
    const sender = await prisma.user.findUnique({
      where: { id: data.senderId },
    });

    if (!sender) {
      throw new AppError(404, 'Sender not found');
    }

    // Ensure only admin and client can message each other
    if (sender.role === 'partner' || recipient.role === 'partner') {
      throw new AppError(400, 'Partners cannot participate in direct messaging');
    }

    // Generate conversation ID if not provided
    const conversationId = data.conversationId || this.generateConversationId(data.senderId, data.recipientId);

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: data.senderId,
        recipientId: data.recipientId,
        content: data.content,
        status: 'delivered',
      },
      include: {
        SenderUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        RecipientUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return message;
  }

  /**
   * Mark messages as seen
   */
  async markAsSeen(conversationId: string, userId: string) {
    // Verify user is part of this conversation
    const conversation = await prisma.message.findFirst({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new AppError(404, 'Conversation not found or access denied');
    }

    // Mark all messages in this conversation that are sent to the user as seen
    const result = await prisma.message.updateMany({
      where: {
        conversationId,
        recipientId: userId,
        status: 'delivered',
      },
      data: {
        status: 'seen',
        readAt: new Date(),
      },
    });

    return result;
  }

  /**
   * Mark a specific message as seen
   */
  async markMessageAsSeen(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new AppError(404, 'Message not found');
    }

    if (message.recipientId !== userId) {
      throw new AppError(403, 'You can only mark your own received messages as seen');
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        status: 'seen',
        readAt: new Date(),
      },
    });

    return updated;
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.message.count({
      where: {
        recipientId: userId,
        status: 'delivered',
      },
    });

    return count;
  }

  /**
   * Get unread count for a specific conversation
   */
  async getConversationUnreadCount(conversationId: string, userId: string) {
    // Verify user is part of this conversation
    const conversation = await prisma.message.findFirst({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new AppError(404, 'Conversation not found or access denied');
    }

    const count = await prisma.message.count({
      where: {
        conversationId,
        recipientId: userId,
        status: 'delivered',
      },
    });

    return count;
  }
}

export const messageService = new MessageService();
