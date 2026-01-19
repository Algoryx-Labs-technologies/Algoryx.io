import { prisma } from '@/config/database';
import { AppError } from '@/types';

// Note: Message model structure (to be added to schema)
// model Message {
//   id              String   @id @default(cuid())
//   clientId        String
//   Client          Client   @relation(fields: [clientId], references: [uid])
//   recipientId     String   // Admin or Partner userId
//   recipientRole   String   // 'admin' or 'partner'
//   conversationId  String?  // For grouping messages
//   subject         String?
//   content         String
//   isRead          Boolean  @default(false)
//   created_at      DateTime @default(now())
//   updated_at      DateTime @default(now())
// }

export class MessageService {
  // Get all conversations for a client
  async getConversations(clientId: string) {
    // TODO: Implement when Message model is added
    // This would group messages by recipient and return the latest message for each conversation
    // return prisma.message.groupBy({
    //   by: ['recipientId'],
    //   where: { clientId },
    //   _max: { created_at: true },
    //   orderBy: { _max: { created_at: 'desc' } },
    // });
    
    // For now, return empty array
    return [];
  }

  // Get messages for a specific conversation
  async getConversationMessages(conversationId: string, clientId: string) {
    // TODO: Implement when Message model is added
    // return prisma.message.findMany({
    //   where: {
    //     conversationId,
    //     clientId,
    //   },
    //   orderBy: {
    //     created_at: 'asc',
    //   },
    // });
    
    return [];
  }

  // Get conversation by ID
  async getConversationById(conversationId: string, clientId: string) {
    // TODO: Implement when Message model is added
    // const messages = await prisma.message.findFirst({
    //   where: {
    //     conversationId,
    //     clientId,
    //   },
    // });
    // return messages;
    
    return null;
  }

  // Create a new message
  async createMessage(data: {
    clientId: string;
    recipientId: string;
    recipientRole: 'admin' | 'partner';
    conversationId?: string;
    subject?: string;
    content: string;
  }) {
    // TODO: Implement when Message model is added
    // If conversationId is not provided, create a new conversation
    // const conversationId = data.conversationId || cuid();
    
    // return prisma.message.create({
    //   data: {
    //     clientId: data.clientId,
    //     recipientId: data.recipientId,
    //     recipientRole: data.recipientRole,
    //     conversationId,
    //     subject: data.subject,
    //     content: data.content,
    //     isRead: false,
    //   },
    // });
    
    // Mock return for now
    return {
      id: 'temp-id',
      ...data,
      isRead: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  // Mark messages as read
  async markAsRead(conversationId: string, clientId: string) {
    // TODO: Implement when Message model is added
    // return prisma.message.updateMany({
    //   where: {
    //     conversationId,
    //     clientId,
    //     isRead: false,
    //   },
    //   data: {
    //     isRead: true,
    //   },
    // });
    
    return { count: 0 };
  }

  // Get unread count for a client
  async getUnreadCount(clientId: string) {
    // TODO: Implement when Message model is added
    // return prisma.message.count({
    //   where: {
    //     clientId,
    //     isRead: false,
    //   },
    // });
    
    return 0;
  }
}

export const messageService = new MessageService();

