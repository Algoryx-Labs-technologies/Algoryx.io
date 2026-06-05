import mongoose from 'mongoose';
import { AdminProject } from '@/models/admin-project.model';
import {
  AdminPayment,
  IAdminPayment,
  PAYMENT_STATUSES,
  PaymentStatus,
} from '@/models/payment.model';
import { AppError } from '@/types';

export interface PaymentProjectSummary {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}

export interface PaymentListItem {
  id: string;
  paymentCode: string;
  projectId: string;
  project: PaymentProjectSummary;
  amount: number;
  currency: string;
  deadline: string;
  status: PaymentStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentInput {
  projectId: string;
  amount: number;
  currency?: string;
  deadline: string;
  status?: PaymentStatus;
  description?: string;
}

export interface UpdatePaymentInput {
  projectId?: string;
  amount?: number;
  currency?: string;
  deadline?: string;
  status?: PaymentStatus;
  description?: string;
}

type PaymentRecord = IAdminPayment & {
  _id: { toString(): string };
  projectId: { toString(): string };
};

const parseDeadline = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'Invalid deadline date');
  }
  return date;
};

const getStartOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const isDeadlineMissed = (deadline: Date): boolean => deadline < getStartOfToday();

const resolveStatusForDeadline = (
  status: PaymentStatus,
  deadline: Date,
): PaymentStatus => {
  if (status === 'pending' && isDeadlineMissed(deadline)) {
    return 'delayed';
  }
  return status;
};

const syncOverduePayments = async (): Promise<void> => {
  await AdminPayment.updateMany(
    { status: 'pending', deadline: { $lt: getStartOfToday() } },
    { $set: { status: 'delayed' } },
  );
};

const resolveProjectId = async (projectId: string): Promise<mongoose.Types.ObjectId> => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new AppError(400, 'Invalid project id');
  }

  const project = await AdminProject.findById(projectId).select('_id').lean();
  if (!project) {
    throw new AppError(400, 'Project not found');
  }

  return new mongoose.Types.ObjectId(projectId);
};

const loadProjectMap = async (
  records: PaymentRecord[],
): Promise<Map<string, PaymentProjectSummary>> => {
  const projectIds = [...new Set(records.map((record) => String(record.projectId)))];

  if (!projectIds.length) {
    return new Map();
  }

  const projects = await AdminProject.find({ _id: { $in: projectIds } })
    .select('projectCode projectName clientName')
    .lean();

  return new Map(
    projects.map((project) => [
      String(project._id),
      {
        id: String(project._id),
        projectCode: project.projectCode,
        projectName: project.projectName,
        clientName: project.clientName,
      },
    ]),
  );
};

const toListItem = (
  record: PaymentRecord,
  projectMap: Map<string, PaymentProjectSummary>,
): PaymentListItem => {
  const projectId = String(record.projectId);
  const project = projectMap.get(projectId);

  if (!project) {
    throw new AppError(500, 'Payment project data missing');
  }

  return {
    id: String(record._id),
    paymentCode: record.paymentCode,
    projectId,
    project,
    amount: record.amount,
    currency: record.currency,
    deadline: record.deadline.toISOString(),
    status: record.status,
    description: record.description,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
};

const toListItems = async (records: PaymentRecord[]): Promise<PaymentListItem[]> => {
  const projectMap = await loadProjectMap(records);
  return records.map((record) => toListItem(record, projectMap));
};

export const generatePaymentCode = async (): Promise<string> => {
  const count = await AdminPayment.countDocuments();
  return `PY${String(count + 1).padStart(3, '0')}`;
};

export const createPayment = async (data: CreatePaymentInput): Promise<PaymentListItem> => {
  const requestedStatus = data.status ?? 'pending';

  if (!PAYMENT_STATUSES.includes(requestedStatus)) {
    throw new AppError(400, 'Invalid payment status');
  }

  const projectId = await resolveProjectId(data.projectId);
  const paymentCode = await generatePaymentCode();
  const deadline = parseDeadline(data.deadline);
  const status = resolveStatusForDeadline(requestedStatus, deadline);

  const record = await AdminPayment.create({
    paymentCode,
    projectId,
    amount: data.amount,
    currency: data.currency?.trim() || 'INR',
    deadline,
    status,
    description: data.description,
  });

  const [item] = await toListItems([record as unknown as PaymentRecord]);
  return item;
};

export interface ListPaymentsOptions {
  status?: PaymentStatus;
  search?: string;
}

export const listPayments = async (
  options: ListPaymentsOptions = {},
): Promise<PaymentListItem[]> => {
  await syncOverduePayments();

  const filter: Record<string, unknown> = {};

  if (options.status) {
    if (!PAYMENT_STATUSES.includes(options.status)) {
      throw new AppError(400, 'Invalid payment status filter');
    }
    filter.status = options.status;
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const matchingProjects = await AdminProject.find({
      $or: [{ projectName: regex }, { projectCode: regex }, { clientName: regex }],
    })
      .select('_id')
      .lean();

    const projectIds = matchingProjects.map((project) => project._id);

    filter.$or = [
      { paymentCode: regex },
      { description: regex },
      ...(projectIds.length ? [{ projectId: { $in: projectIds } }] : []),
    ];
  }

  const records = await AdminPayment.find(filter).sort({ updatedAt: -1 }).lean();

  return toListItems(records as unknown as PaymentRecord[]);
};

export const updatePayment = async (
  id: string,
  data: UpdatePaymentInput,
): Promise<PaymentListItem> => {
  if (data.status && !PAYMENT_STATUSES.includes(data.status)) {
    throw new AppError(400, 'Invalid payment status');
  }

  const update: Record<string, unknown> = {};

  if (data.projectId !== undefined) {
    update.projectId = await resolveProjectId(data.projectId);
  }
  if (data.amount !== undefined) {
    update.amount = data.amount;
  }
  if (data.currency !== undefined) {
    update.currency = data.currency;
  }
  if (data.deadline !== undefined) {
    update.deadline = parseDeadline(data.deadline);
  }
  if (data.status !== undefined) {
    update.status = data.status;
  }
  if (data.description !== undefined) {
    update.description = data.description;
  }

  const record = await AdminPayment.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!record) {
    throw new AppError(404, 'Payment not found');
  }

  if (record.status === 'pending' && isDeadlineMissed(record.deadline)) {
    record.status = 'delayed';
    await record.save();
  }

  const [item] = await toListItems([record as unknown as PaymentRecord]);
  return item;
};

export const deletePayment = async (id: string): Promise<void> => {
  const result = await AdminPayment.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Payment not found');
  }
};
