import { Request, Response, NextFunction } from 'express';
import { SALES_LEAD_STAGES, SalesLeadStage } from '@/models/sales-lead.model';
import {
  createSalesLead,
  deleteSalesLead,
  listSalesLeads,
  updateSalesLead,
} from '@/services/sales-lead.service';

export const getSalesLeads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stage = req.query.stage as SalesLeadStage | undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const leads = await listSalesLeads({ stage, search });

    res.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

export const postSalesLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, phone, company, notes, stage } = req.body;

    const lead = await createSalesLead({
      name,
      email,
      phone,
      company,
      notes,
      stage,
    });

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const patchSalesLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    const { name, email, phone, company, notes, stage } = req.body;

    const lead = await updateSalesLead(id, {
      name,
      email,
      phone,
      company,
      notes,
      stage,
    });

    res.json({
      success: true,
      data: lead,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeSalesLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = String(req.params.id);
    await deleteSalesLead(id);

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesLeadStages = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: SALES_LEAD_STAGES,
  });
};
