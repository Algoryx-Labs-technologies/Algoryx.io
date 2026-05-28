import { Request, Response, NextFunction } from 'express';
import {
  createTeamMember,
  deleteTeamMember,
  listTeamMembers,
} from '@/services/team.service';

export const getTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const members = await listTeamMembers({ search });

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const postTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, role } = req.body;
    const member = await createTeamMember({ name, email, role });

    res.status(201).json({
      success: true,
      data: member,
      message: 'Member added successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteTeamMember(id);

    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
