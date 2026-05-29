import {
  ISalesLead,
  SALES_LEAD_STAGES,
  SalesLead,
  SalesLeadStage,
} from '@/models/sales-lead.model';
import { AppError } from '@/types';

export interface CreateSalesLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  stage?: SalesLeadStage;
}

export interface UpdateSalesLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  stage?: SalesLeadStage;
}

export interface SalesLeadListItem {
  id: string;
  leadCode: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  stage: SalesLeadStage;
  createdAt: string;
  updatedAt: string;
}

const toListItem = (record: ISalesLead | Record<string, unknown>): SalesLeadListItem => {
  const doc = record as ISalesLead & { _id: { toString(): string } };
  return {
    id: String(doc._id),
    leadCode: doc.leadCode,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    company: doc.company,
    notes: doc.notes,
    stage: doc.stage,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};

export const generateLeadCode = async (): Promise<string> => {
  const count = await SalesLead.countDocuments();
  return `SL${String(count + 1).padStart(3, '0')}`;
};

export const createSalesLead = async (
  data: CreateSalesLeadInput,
): Promise<SalesLeadListItem> => {
  const leadCode = await generateLeadCode();
  const stage = data.stage ?? 'discovery';

  if (!SALES_LEAD_STAGES.includes(stage)) {
    throw new AppError(400, 'Invalid pipeline stage');
  }

  const record = await SalesLead.create({
    leadCode,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    notes: data.notes,
    stage,
  });

  return toListItem(record);
};

export interface ListSalesLeadsOptions {
  stage?: SalesLeadStage;
  search?: string;
}

export const listSalesLeads = async (
  options: ListSalesLeadsOptions = {},
): Promise<SalesLeadListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.stage) {
    if (!SALES_LEAD_STAGES.includes(options.stage)) {
      throw new AppError(400, 'Invalid pipeline stage filter');
    }
    filter.stage = options.stage;
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { company: regex },
      { leadCode: regex },
      { phone: regex },
    ];
  }

  const records = await SalesLead.find(filter).sort({ updatedAt: -1 }).lean();

  return records.map((record) => toListItem(record as unknown as ISalesLead));
};

export const updateSalesLead = async (
  id: string,
  data: UpdateSalesLeadInput,
): Promise<SalesLeadListItem> => {
  if (data.stage && !SALES_LEAD_STAGES.includes(data.stage)) {
    throw new AppError(400, 'Invalid pipeline stage');
  }

  const record = await SalesLead.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!record) {
    throw new AppError(404, 'Lead not found');
  }

  return toListItem(record);
};

export const deleteSalesLead = async (id: string): Promise<void> => {
  const result = await SalesLead.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Lead not found');
  }
};
