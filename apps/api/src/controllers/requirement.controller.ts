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

  async getPartnerId(userId: string): Promise<string | null> {
    const partner = await prisma.partner.findUnique({
      where: { userId },
      select: { uid: true },
    });
    return partner?.uid || null;
  }

  async getAllRequirements(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findFirst({
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

  async getRequirementsByUserId(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    const { userId } = req.params;
    const userIdParam = Array.isArray(userId) ? userId[0] : userId;

    // Verify the userId belongs to the authenticated user or user has permission
    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Check if the requested userId matches the authenticated user's ID
    if (userIdParam !== user.id) {
      throw new AppError(403, 'You can only view your own requirements');
    }

    const requirements = await requirementService.findWithStatusByUserId(userIdParam);

    res.json({
      success: true,
      data: requirements,
    });
  }

  async createRequirement(req: AuthenticatedRequest, res: Response) {
    if (!req.supabaseUser) {
      throw new AppError(401, 'Unauthorized');
    }

    // Find user in database
    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get client ID and partner ID
    const clientId = await this.getClientId(user.id);
    const partnerId = await this.getPartnerId(user.id);

    // If projectId is provided, verify it belongs to the client or partner
    if (req.body.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: req.body.projectId,
          OR: [
            ...(clientId ? [{ clientId }] : []),
            ...(partnerId ? [{ partnerId }] : []),
          ],
        },
      });

      if (!project) {
        throw new AppError(404, 'Project not found or access denied');
      }
    }

    // Prepare userName from firstName/lastName or email
    const userName = user.firstName 
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
      : user.email.split('@')[0];

    // Prepare requirement data with user, client, and partner IDs
    const requirementData = {
      ...req.body,
      userId: user.id,
      userName: userName,
      email: user.email,
      ...(clientId && { clientId }),
      ...(partnerId && { partnerId }),
    };

    const requirement = await requirementService.create(requirementData);

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
    const requirementId = Array.isArray(id) ? id[0] : id;

    // Find user in database
    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const requirement = await requirementService.update(requirementId, user.id, req.body);

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
    const requirementId = Array.isArray(id) ? id[0] : id;

    // Find user in database
    const user = await prisma.user.findFirst({
      where: { email: req.supabaseUser.email! },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await requirementService.delete(requirementId, user.id);

    res.json({
      success: true,
      message: 'Requirement deleted successfully',
    });
  }
}

export const requirementController = new RequirementController();

