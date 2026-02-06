import { randomUUID } from 'crypto';
import { prisma } from '@/config/database';
import { Requirement, RequirementStatus } from '@prisma/client';
import { AppError } from '@/types';

export class RequirementService {
  async findByClientId(clientId: string): Promise<Requirement[]> {
    // Get all requirements for this client
    return prisma.requirement.findMany({
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

  async findByUserId(userId: string): Promise<Requirement[]> {
    return prisma.requirement.findMany({
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

  async findById(uid: string, clientId?: string): Promise<Requirement | null> {
    const where: any = { uid };
    
    if (clientId) {
      where.clientId = clientId;
    }

    return prisma.requirement.findFirst({
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
    userId?: string;
    clientId?: string;
    partnerId?: string;
    projectTitle?: string;
    question?: string;
    description?: string;
    priority?: string;
    answer?: string;
    Budget?: string;
    userName?: string;
    email?: string;
  }): Promise<Requirement> {
    return prisma.requirement.create({
      data: {
        uid: randomUUID(),
        ...data,
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
    });
  }

  async update(
    uid: string,
    userId: string,
    data: Partial<{
      projectTitle: string;
      question: string;
      description: string;
      priority: string;
      answer: string;
      Budget: string;
      status: RequirementStatus;
    }>
  ): Promise<Requirement> {
    // Verify the requirement belongs to the user
    const requirement = await prisma.requirement.findFirst({
      where: {
        uid,
        userId: userId,
      },
    });
    
    if (!requirement) {
      throw new AppError(404, 'Requirement not found');
    }

    return prisma.requirement.update({
      where: { uid },
      data: {
        ...data,
        updated_at: new Date(),
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
    });
  }

  async delete(uid: string, userId: string): Promise<void> {
    // Verify the requirement belongs to the user
    const requirement = await prisma.requirement.findFirst({
      where: {
        uid,
        userId: userId,
      },
    });
    
    if (!requirement) {
      throw new AppError(404, 'Requirement not found');
    }

    await prisma.requirement.delete({
      where: { uid },
    });
  }

  // Get requirements with status
  async findWithStatus(clientId: string) {
    const requirements = await this.findByClientId(clientId);
    
    // Status is now stored in the database, so we just return the requirements as-is
    return requirements;
  }

  // Get requirements by userId with status
  async findWithStatusByUserId(userId: string) {
    const requirements = await this.findByUserId(userId);
    
    // Status is now stored in the database, so we just return the requirements as-is
    return requirements;
  }
}

export const requirementService = new RequirementService();

