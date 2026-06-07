import { Request, Response, NextFunction } from 'express';
import {
  createPortfolioProject,
  deletePortfolioProject,
  getPortfolioCategories,
  getPublicPortfolio,
  listPortfolioProjects,
  updatePortfolioProject,
} from '@/services/portfolio.service';
import { uploadPortfolioImage } from '@/services/cloudinary.service';
import { PortfolioCategory } from '@/models/portfolio-project.model';
import { AppError } from '@/types';

export const getPublicPortfolioProjects = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getPublicPortfolio();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioProjectList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = req.query.category as PortfolioCategory | undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const projects = await listPortfolioProjects({ category, search });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioCategoryList = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({
      success: true,
      data: getPortfolioCategories(),
    });
  } catch (error) {
    next(error);
  }
};

export const postPortfolioProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await createPortfolioProject(req.body);

    res.status(201).json({
      success: true,
      data: project,
      message: 'Portfolio project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const patchPortfolioProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const project = await updatePortfolioProject(id, req.body);

    res.json({
      success: true,
      data: project,
      message: 'Portfolio project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removePortfolioProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deletePortfolioProject(id);

    res.json({
      success: true,
      message: 'Portfolio project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const postPortfolioImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file;

    if (!file) {
      throw new AppError(400, 'Image file is required');
    }

    const uploaded = await uploadPortfolioImage(file.buffer);

    res.status(201).json({
      success: true,
      data: uploaded,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};
