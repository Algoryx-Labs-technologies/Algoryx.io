import { prisma } from '@/config/database';
import { SupportTicket, Priority, TicketStatus } from '@prisma/client';
import { AppError } from '@/types';

export class SupportTicketService {
  async findByClientId(clientId: string): Promise<SupportTicket[]> {
    return prisma.supportTicket.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByPartnerId(partnerId: string): Promise<SupportTicket[]> {
    return prisma.supportTicket.findMany({
      where: {
        partnerId: partnerId,
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<SupportTicket[]> {
    return prisma.supportTicket.findMany({
      where: {
        userId: userId,
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findById(uid: string, clientId?: string, partnerId?: string): Promise<SupportTicket | null> {
    const where: any = { uid };
    
    if (clientId) {
      where.clientId = clientId;
    }
    
    if (partnerId) {
      where.partnerId = partnerId;
    }

    return prisma.supportTicket.findFirst({
      where,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
      },
    });
  }


  async create(data: {
    ticketId: string;
    userId?: string;
    clientId?: string;
    partnerId?: string;
    issueType: string;
    description: string;
    priority: Priority;
    additionalDetails?: string;
    userName?: string;
    email?: string;
  }): Promise<SupportTicket> {
    return prisma.supportTicket.create({
      data,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
      },
    });
  }


  async update(uid: string, data: {
    status?: TicketStatus;
    priority?: Priority;
    issueType?: string;
    description?: string;
    additionalDetails?: string;
  }): Promise<SupportTicket> {
    const ticket = await prisma.supportTicket.findUnique({
      where: { uid },
    });

    if (!ticket) {
      throw new AppError(404, 'Support ticket not found');
    }

    return prisma.supportTicket.update({
      where: { uid },
      data,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        Client: {
          select: {
            uid: true,
          },
        },
        Partner: {
          select: {
            uid: true,
            companyName: true,
          },
        },
        TicketReply: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
  }

  async delete(uid: string, clientId?: string, partnerId?: string): Promise<void> {
    const ticket = await this.findById(uid, clientId, partnerId);
    
    if (!ticket) {
      throw new AppError(404, 'Support ticket not found');
    }

    await prisma.supportTicket.delete({
      where: { uid },
    });
  }

  // Generate unique ticket ID
  generateTicketId(): string {
    const timestamp = Date.now().toString().slice(-8);
    return `TKT-${timestamp}`;
  }
}

export const supportTicketService = new SupportTicketService();

