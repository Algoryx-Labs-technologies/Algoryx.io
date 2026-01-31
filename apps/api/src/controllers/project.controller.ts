import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { projectService } from '@/services/project.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export class ProjectController {
  async getClientId(userId: string): Promise<string | null> {
    const client = await prisma.client.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return client?.uid || null;
  }

  async getAllProjects(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const projects = await projectService.findByClientId(clientId);

    // Transform projects to include payment and agreement status
    // Note: These would come from Payment and Agreement models when they exist
    const projectsWithStatus = projects.map((project) => ({
      ...project,
      // TODO: Fetch actual payment status from Payment model
      paymentStatus: 'pending' as const,
      // TODO: Fetch actual agreement status from Agreement model
      agreementStatus: 'pending' as const,
      // TODO: Calculate deadline from projectTimeline or fetch from separate field
      deadline: null as string | null,
    }));

    res.json({
      success: true,
      data: projectsWithStatus,
    });
  }

  async getProjectById(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const project = await projectService.findById(id, clientId);

    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    // Transform project to include payment and agreement status
    const projectWithStatus = {
      ...project,
      // TODO: Fetch actual payment status from Payment model
      paymentStatus: 'pending' as const,
      // TODO: Fetch actual agreement status from Agreement model
      agreementStatus: 'pending' as const,
      // TODO: Calculate deadline from projectTimeline or fetch from separate field
      deadline: null as string | null,
    };

    res.json({
      success: true,
      data: projectWithStatus,
    });
  }

  async createProject(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const project = await projectService.create({
      clientId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  }

  async updateProject(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const project = await projectService.update(id, clientId, req.body);

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  }

  async deleteProject(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { supabaseUserId: req.supabaseUser.id },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    await projectService.delete(id, clientId);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  }
}

export const projectController = new ProjectController();

