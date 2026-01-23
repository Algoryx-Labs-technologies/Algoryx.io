import { prisma } from '@/config/database';
import { Requirement } from '@prisma/client';
import { AppError } from '@/types';

export class RequirementService {
  async findByClientId(clientId: string): Promise<Requirement[]> {
    // Get all requirements for projects belonging to this client
    return prisma.requirement.findMany({
      where: {
        Project: {
          clientId: clientId,
        },
      },
      include: {
        Project: {
          select: {
            id: true,
            description: true,
            projectStatus: true,
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
      where.Project = {
        clientId: clientId,
      };
    }

    return prisma.requirement.findFirst({
      where,
      include: {
        Project: {
          select: {
            id: true,
            description: true,
            projectStatus: true,
          },
        },
      },
    });
  }

  async create(data: {
    userId?: string;
    projectId?: string;
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
      data,
      include: {
        Project: {
          select: {
            id: true,
            description: true,
            projectStatus: true,
          },
        },
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
    clientId: string,
    data: Partial<{
      projectTitle: string;
      question: string;
      description: string;
      priority: string;
      answer: string;
      Budget: string;
    }>
  ): Promise<Requirement> {
    const requirement = await this.findById(uid, clientId);
    
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
        Project: {
          select: {
            id: true,
            description: true,
            projectStatus: true,
          },
        },
      },
    });
  }

  async delete(uid: string, clientId: string): Promise<void> {
    const requirement = await this.findById(uid, clientId);
    
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
    
    return requirements.map((req) => ({
      ...req,
      status: 'pending' as const,
    }));
  }
}

export const requirementService = new RequirementService();

