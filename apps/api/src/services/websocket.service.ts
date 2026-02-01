import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { supabase } from '@/config/supabase';
import { prisma } from '@/config/database';
import { messageService } from './message.service';
import { logger } from '@/utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class WebSocketService {
  private io: SocketIOServer;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  constructor(httpServer: HTTPServer, corsOrigins: string[]) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', async (socket: AuthenticatedSocket) => {
      logger.info(`WebSocket connection attempt: ${socket.id}`);

      // Authenticate on connection
      socket.on('authenticate', async (data: { token: string }) => {
        try {
          const { token } = data;
          if (!token) {
            socket.emit('error', { message: 'Authentication token required' });
            socket.disconnect();
            return;
          }

          // Verify token with Supabase
          const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

          if (error || !supabaseUser) {
            socket.emit('error', { message: 'Invalid or expired token' });
            socket.disconnect();
            return;
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { supabaseUserId: supabaseUser.id },
          });

          if (!user) {
            socket.emit('error', { message: 'User not found' });
            socket.disconnect();
            return;
          }

          // Only allow admin and client
          if (user.role !== 'admin' && user.role !== 'client') {
            socket.emit('error', { message: 'Only admins and clients can use messaging' });
            socket.disconnect();
            return;
          }

          // Store user info in socket
          socket.userId = user.id;
          socket.userRole = user.role;

          // Join user to their personal room
          socket.join(`user:${user.id}`);

          // Track socket for this user
          if (!this.userSockets.has(user.id)) {
            this.userSockets.set(user.id, new Set());
          }
          this.userSockets.get(user.id)!.add(socket.id);

          logger.info(`User authenticated: ${user.id} (${user.role}) - Socket: ${socket.id}`);

          socket.emit('authenticated', { userId: user.id, role: user.role });

          // Send unread count on connection
          const unreadCount = await messageService.getUnreadCount(user.id);
          socket.emit('unread_count', { count: unreadCount });
        } catch (error: any) {
          logger.error('WebSocket authentication error:', error);
          socket.emit('error', { message: 'Authentication failed' });
          socket.disconnect();
        }
      });

      // Handle sending messages
      socket.on('message:send', async (data: {
        recipientId: string;
        content: string;
        conversationId?: string;
      }) => {
        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          const { recipientId, content, conversationId } = data;

          if (!recipientId || !content?.trim()) {
            socket.emit('error', { message: 'Recipient ID and content are required' });
            return;
          }

          // Create message using message service
          const message = await messageService.createMessage({
            senderId: socket.userId,
            recipientId,
            content: content.trim(),
            conversationId,
          });

          // Get sender and recipient info
          const sender = await prisma.user.findUnique({
            where: { id: socket.userId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
          });

          const recipient = await prisma.user.findUnique({
            where: { id: recipientId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
          });

          if (!sender || !recipient) {
            socket.emit('error', { message: 'User not found' });
            return;
          }

          // Prepare message data for client
          const messageData = {
            ...message,
            SenderUser: sender,
            RecipientUser: recipient,
          };

          // Emit to sender (confirmation)
          socket.emit('message:sent', messageData);

          // Emit to recipient (new message)
          this.io.to(`user:${recipientId}`).emit('message:received', messageData);

          // Update unread counts
          const senderUnread = await messageService.getUnreadCount(socket.userId);
          const recipientUnread = await messageService.getUnreadCount(recipientId);

          this.io.to(`user:${socket.userId}`).emit('unread_count', { count: senderUnread });
          this.io.to(`user:${recipientId}`).emit('unread_count', { count: recipientUnread });

          // Notify both users about conversation update
          this.io.to(`user:${socket.userId}`).emit('conversation:updated', {
            conversationId: message.conversationId,
          });
          this.io.to(`user:${recipientId}`).emit('conversation:updated', {
            conversationId: message.conversationId,
          });

          logger.info(`Message sent from ${socket.userId} to ${recipientId}`);
        } catch (error: any) {
          logger.error('Error sending message via WebSocket:', error);
          socket.emit('error', { message: error.message || 'Failed to send message' });
        }
      });

      // Handle marking messages as seen
      socket.on('message:mark_seen', async (data: { conversationId: string }) => {
        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          const { conversationId } = data;
          await messageService.markAsSeen(conversationId, socket.userId);

          // Notify other user that messages were seen
          const conversation = await messageService.getConversationById(conversationId, socket.userId);
          if (conversation) {
            this.io.to(`user:${conversation.otherUserId}`).emit('message:seen', {
              conversationId,
              seenBy: socket.userId,
            });
          }
        } catch (error: any) {
          logger.error('Error marking messages as seen:', error);
          socket.emit('error', { message: 'Failed to mark messages as seen' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          const userSockets = this.userSockets.get(socket.userId);
          if (userSockets) {
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
              this.userSockets.delete(socket.userId);
            }
          }
          logger.info(`User disconnected: ${socket.userId} - Socket: ${socket.id}`);
        } else {
          logger.info(`Unauthenticated socket disconnected: ${socket.id}`);
        }
      });
    });
  }

  // Method to emit to specific user
  emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Get IO instance for external use
  getIO() {
    return this.io;
  }
}

// Export class for instantiation
export default WebSocketService;

