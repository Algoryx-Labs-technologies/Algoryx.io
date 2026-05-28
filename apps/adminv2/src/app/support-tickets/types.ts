export type SupportCategory =
  | 'general'
  | 'technical'
  | 'billing'
  | 'feature-request'
  | 'account'
  | 'other';

export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';

export type SupportSource = 'landing_help';

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  description: string;
  source: SupportSource;
  hasAttachment: boolean;
  attachmentName?: string;
  client: {
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const SOURCE_LABELS: Record<SupportSource, string> = {
  landing_help: 'Landing · Help & Support',
};

export const CATEGORY_LABELS: Record<SupportCategory, string> = {
  general: 'General',
  technical: 'Technical',
  billing: 'Billing',
  'feature-request': 'Feature request',
  account: 'Account',
  other: 'Other',
};

export const PRIORITY_LABELS: Record<SupportPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
