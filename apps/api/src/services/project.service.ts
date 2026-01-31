import { randomUUID } from 'crypto';
import { prisma } from '@/config/database';
import { Project } from '@prisma/client';
import { AppError } from '@/types';

export class ProjectService {
  async findByClientId(clientId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { clientId },
      include: {
        requirements: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findById(id: string, clientId?: string): Promise<Project | null> {
    const where: any = { id };
    if (clientId) {
      where.clientId = clientId;
    }

    return prisma.project.findFirst({
      where,
      include: {
        requirements: true,
      },
    });
  }

  async create(data: {
    clientId: string;
    projectName?: string;
    readMe?: string;
    techStack?: string;
    clientRequirement?: string;
    projectTimeline?: string;
    projectStatus?: string;
    projectFeatures?: string;
    priority?: string;
    progressStatus?: string;
  }): Promise<Project> {
    return prisma.project.create({
      data: {
        id: randomUUID(),
        ...data,
      },
      include: {
        requirements: true,
      },
    });
  }

  async update(
    id: string,
    clientId: string,
    data: Partial<{
      projectName: string;
      readMe: string;
      techStack: string;
      clientRequirement: string;
      projectTimeline: string;
      projectStatus: string;
      projectFeatures: string;
      priority: string;
      progressStatus: string;
    }>
  ): Promise<Project> {
    const project = await this.findById(id, clientId);
    
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    return prisma.project.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: {
        requirements: true,
      },
    });
  }

  async delete(id: string, clientId: string): Promise<void> {
    const project = await this.findById(id, clientId);
    
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    await prisma.project.delete({
      where: { id },
    });
  }
}

export const projectService = new ProjectService();

