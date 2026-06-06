export type FeedbackType =
  | 'website'
  | 'product'
  | 'service'
  | 'suggestion'
  | 'content'
  | 'support'
  | 'pricing'
  | 'bug'
  | 'partnership'
  | 'praise'
  | 'other';

export type FeedbackSource = 'landing_feedback';

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  type: FeedbackType;
  rating?: 1 | 2 | 3 | 4 | 5;
  message: string;
  source: FeedbackSource;
  client: {
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const SOURCE_LABELS: Record<FeedbackSource, string> = {
  landing_feedback: 'Landing · Share Feedback',
};

export const TYPE_LABELS: Record<FeedbackType, string> = {
  website: 'Website experience',
  product: 'Product or platform',
  service: 'Services & delivery',
  suggestion: 'Feature suggestion',
  content: 'Content & documentation',
  support: 'Support experience',
  pricing: 'Pricing & plans',
  bug: 'Bug or issue report',
  partnership: 'Partnership inquiry',
  praise: 'Compliment or praise',
  other: 'Other',
};
