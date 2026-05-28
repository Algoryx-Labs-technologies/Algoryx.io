import { Request, Response, NextFunction } from 'express';
import {
  ADMIN_PROJECT_STAGES,
  AdminProjectStage,
} from '@/models/admin-project.model';
import {
  createAdminProject,
  deleteAdminProject,
  listAdminProjects,
  updateAdminProject,
} from '@/services/admin-project.service';

export const getAdminProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stage = req.query.stage as AdminProjectStage | undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const projects = await listAdminProjects({ stage, search });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const postAdminProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      projectName,
      clientName,
      clientEmail,
      description,
      budget,
      deadline,
      stage,
      teamMemberIds,
    } = req.body;

    const project = await createAdminProject({
      projectName,
      clientName,
      clientEmail,
      description,
      budget,
      deadline,
      stage,
      teamMemberIds,
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const patchAdminProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const {
      projectName,
      clientName,
      clientEmail,
      description,
      budget,
      deadline,
      stage,
      teamMemberIds,
    } = req.body;

    const project = await updateAdminProject(id, {
      projectName,
      clientName,
      clientEmail,
      description,
      budget,
      deadline,
      stage,
      teamMemberIds,
    });

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeAdminProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteAdminProject(id);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProjectStages = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: ADMIN_PROJECT_STAGES,
  });
};
