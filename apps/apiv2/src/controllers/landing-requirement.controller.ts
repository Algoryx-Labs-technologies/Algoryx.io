import { Request, Response, NextFunction } from 'express';
import {
  createLandingRequirement,
  listLandingRequirements,
} from '@/services/landing-requirement.service';

export const postLandingRequirement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fullName, email, phone, companyOrg, message, haveSource } = req.body;

    const record = await createLandingRequirement({
      fullName,
      email,
      phone,
      companyOrg,
      message,
      haveSource,
    });

    res.status(201).json({
      success: true,
      data: {
        id: record._id,
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        companyOrg: record.companyOrg,
        message: record.message,
        haveSource: record.haveSource,
        createdAt: record.createdAt,
      },
      message: 'Requirement submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getLandingRequirements = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requirements = await listLandingRequirements();

    res.json({
      success: true,
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
};
