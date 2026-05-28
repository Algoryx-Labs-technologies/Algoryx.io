import {
  IClientMetadata,
  ISupportTicket,
  SupportCategory,
  SupportPriority,
  SupportSource,
  SupportTicket,
} from '@/models/support-ticket.model';
import { AppError } from '@/types';

export interface CreateSupportTicketInput {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  description: string;
  client: IClientMetadata;
  source?: SupportSource;
}

export interface SupportTicketListItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  description: string;
  source: SupportSource;
  client: IClientMetadata;
  createdAt: string;
  updatedAt: string;
}

export type SupportTicketDetail = SupportTicketListItem;

type TicketRecord = ISupportTicket & {
  _id: { toString(): string };
  source?: SupportSource;
};

const toListItem = (record: TicketRecord): SupportTicketListItem => ({
  id: String(record._id),
  name: record.name,
  email: record.email,
  subject: record.subject,
  category: record.category,
  priority: record.priority,
  description: record.description,
  source: record.source ?? 'landing_help',
  client: record.client ?? {},
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const createSupportTicket = async (
  data: CreateSupportTicketInput,
): Promise<ISupportTicket> => {
  return SupportTicket.create({
    ...data,
    source: data.source ?? 'landing_help',
  });
};

export interface ListSupportTicketsOptions {
  search?: string;
  category?: SupportCategory;
  priority?: SupportPriority;
  source?: SupportSource;
}

export const listSupportTickets = async (
  options: ListSupportTicketsOptions = {},
): Promise<SupportTicketListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.source === 'landing_help') {
    filter.$or = [{ source: 'landing_help' }, { source: { $exists: false } }];
  } else if (options.source) {
    filter.source = options.source;
  }

  if (options.category) {
    filter.category = options.category;
  }

  if (options.priority) {
    filter.priority = options.priority;
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { subject: regex },
      { description: regex },
    ];
  }

  const records = await SupportTicket.find(filter).sort({ createdAt: -1 }).lean();

  return records.map((record) => toListItem(record as unknown as TicketRecord));
};

export const getSupportTicketById = async (id: string): Promise<SupportTicketDetail> => {
  const record = await SupportTicket.findById(id).lean();

  if (!record) {
    throw new AppError(404, 'Support ticket not found');
  }

  return toListItem(record as unknown as TicketRecord);
};
