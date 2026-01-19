import { Response } from 'express';
import { AuthenticatedRequest } from '@/types';
import { requirementService } from '@/services/requirement.service';
import { AppError } from '@/types';
import { prisma } from '@/config/database';

export class RequirementController {
  async getClientId(userId: string): Promise<string | null> {
    const client = await prisma.client.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return client?.uid || null;
  }

  async getAllRequirements(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const requirements = await requirementService.findWithStatus(clientId);

    res.json({
      success: true,
      data: requirements,
    });
  }

  async getRequirementById(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const requirement = await requirementService.findById(id, clientId);

    if (!requirement) {
      throw new AppError(404, 'Requirement not found');
    }

    // Add status
    let status: 'pending' | 'answered' | 'reviewed' = 'pending';
    if (requirement.answer && requirement.answer.trim()) {
      status = 'answered';
    }

    res.json({
      success: true,
      data: {
        ...requirement,
        status,
      },
    });
  }

  async createRequirement(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    // If projectId is provided, verify it belongs to the client
    if (req.body.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: req.body.projectId,
          clientId: clientId,
        },
      });

      if (!project) {
        throw new AppError(404, 'Project not found or access denied');
      }
    }

    const requirement = await requirementService.create(req.body);

    res.status(201).json({
      success: true,
      data: requirement,
      message: 'Requirement created successfully',
    });
  }

  async updateRequirement(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    const requirement = await requirementService.update(id, clientId, req.body);

    res.json({
      success: true,
      data: requirement,
      message: 'Requirement updated successfully',
    });
  }

  async deleteRequirement(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID
    const clientId = await this.getClientId(user.id);
    
    if (!clientId) {
      throw new AppError(404, 'Client profile not found');
    }

    await requirementService.delete(id, clientId);

    res.json({
      success: true,
      message: 'Requirement deleted successfully',
    });
  }
}

export const requirementController = new RequirementController();

