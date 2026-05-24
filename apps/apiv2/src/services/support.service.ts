import {
  IClientMetadata,
  ISupportAttachment,
  ISupportTicket,
  SupportCategory,
  SupportPriority,
  SupportTicket,
} from '@/models/support-ticket.model';

export interface CreateSupportTicketInput {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  description: string;
  attachment?: ISupportAttachment;
  client: IClientMetadata;
}

export const createSupportTicket = async (
  data: CreateSupportTicketInput,
): Promise<ISupportTicket> => {
  return SupportTicket.create(data);
};
