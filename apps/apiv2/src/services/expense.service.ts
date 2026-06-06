import mongoose from 'mongoose';
import { AdminProject } from '@/models/admin-project.model';
import {
  Expense,
  EXPENSE_TYPES,
  ExpenseType,
  IExpense,
} from '@/models/expense.model';
import { AppError } from '@/types';

export interface ExpenseProjectSummary {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
}

export interface ExpenseListItem {
  id: string;
  expenseCode: string;
  type: ExpenseType;
  projectId?: string;
  project?: ExpenseProjectSummary;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  type: ExpenseType;
  projectId?: string;
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  expenseDate: string;
}

type ExpenseRecord = IExpense & {
  _id: { toString(): string };
  projectId?: { toString(): string };
};

const parseExpenseDate = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'Invalid expense date');
  }
  return date;
};

const resolveProjectId = async (
  type: ExpenseType,
  projectId?: string,
): Promise<mongoose.Types.ObjectId | undefined> => {
  if (type === 'company') {
    if (projectId?.trim()) {
      throw new AppError(400, 'Company expenses cannot be linked to a project');
    }
    return undefined;
  }

  if (!projectId?.trim()) {
    throw new AppError(400, 'Project is required for project expenses');
  }

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
  records: ExpenseRecord[],
): Promise<Map<string, ExpenseProjectSummary>> => {
  const projectIds = [
    ...new Set(
      records
        .filter((record) => record.projectId)
        .map((record) => String(record.projectId)),
    ),
  ];

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
  record: ExpenseRecord,
  projectMap: Map<string, ExpenseProjectSummary>,
): ExpenseListItem => {
  const projectId = record.projectId ? String(record.projectId) : undefined;
  const project = projectId ? projectMap.get(projectId) : undefined;

  if (record.type === 'project' && projectId && !project) {
    throw new AppError(500, 'Expense project data missing');
  }

  return {
    id: String(record._id),
    expenseCode: record.expenseCode,
    type: record.type,
    projectId,
    project,
    title: record.title,
    description: record.description,
    amount: record.amount,
    currency: record.currency,
    expenseDate: record.expenseDate.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
};

const toListItems = async (records: ExpenseRecord[]): Promise<ExpenseListItem[]> => {
  const projectMap = await loadProjectMap(records);
  return records.map((record) => toListItem(record, projectMap));
};

export const generateExpenseCode = async (): Promise<string> => {
  const count = await Expense.countDocuments();
  return `EX${String(count + 1).padStart(3, '0')}`;
};

export const createExpense = async (data: CreateExpenseInput): Promise<ExpenseListItem> => {
  if (!EXPENSE_TYPES.includes(data.type)) {
    throw new AppError(400, 'Invalid expense type');
  }

  const projectId = await resolveProjectId(data.type, data.projectId);
  const expenseCode = await generateExpenseCode();

  const record = await Expense.create({
    expenseCode,
    type: data.type,
    projectId,
    title: data.title,
    description: data.description,
    amount: data.amount,
    currency: data.currency?.trim() || 'INR',
    expenseDate: parseExpenseDate(data.expenseDate),
  });

  const [item] = await toListItems([record as unknown as ExpenseRecord]);
  return item;
};

export interface ListExpensesOptions {
  type?: ExpenseType;
  search?: string;
  limit?: number;
}

export const listExpenses = async (
  options: ListExpensesOptions = {},
): Promise<ExpenseListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.type) {
    if (!EXPENSE_TYPES.includes(options.type)) {
      throw new AppError(400, 'Invalid expense type filter');
    }
    filter.type = options.type;
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
      { expenseCode: regex },
      { title: regex },
      { description: regex },
      ...(projectIds.length ? [{ projectId: { $in: projectIds } }] : []),
    ];
  }

  let query = Expense.find(filter).sort({ expenseDate: -1, updatedAt: -1 });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const records = await query.lean();
  return toListItems(records as unknown as ExpenseRecord[]);
};

export const deleteExpense = async (id: string): Promise<void> => {
  const result = await Expense.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Expense not found');
  }
};
