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
            projectTitle: true,
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
            projectTitle: true,
          },
        },
      },
    });
  }

  async create(data: {
    projectId?: string;
    projectTitle?: string;
    question?: string;
    description?: string;
    priority?: string;
    answer?: string;
  }): Promise<Requirement> {
    return prisma.requirement.create({
      data,
      include: {
        Project: {
          select: {
            id: true,
            projectTitle: true,
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
            projectTitle: true,
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
    
    return requirements.map((req) => {
      let status: 'pending' | 'answered' | 'reviewed' = 'pending';
      
      if (req.answer && req.answer.trim()) {
        status = 'answered';
      }
      
      return {
        ...req,
        status,
      };
    });
  }
}

export const requirementService = new RequirementService();

