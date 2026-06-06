import {
  Feedback,
  FeedbackRating,
  FeedbackSource,
  FeedbackType,
  IClientMetadata,
  IFeedback,
} from '@/models/feedback.model';
import { AppError } from '@/types';

export interface CreateFeedbackInput {
  name: string;
  email: string;
  type: FeedbackType;
  rating?: FeedbackRating;
  message: string;
  client: IClientMetadata;
  source?: FeedbackSource;
}

export interface FeedbackListItem {
  id: string;
  name: string;
  email: string;
  type: FeedbackType;
  rating?: FeedbackRating;
  message: string;
  source: FeedbackSource;
  client: IClientMetadata;
  createdAt: string;
  updatedAt: string;
}

export type FeedbackDetail = FeedbackListItem;

type FeedbackRecord = IFeedback & {
  _id: { toString(): string };
  source?: FeedbackSource;
};

const toListItem = (record: FeedbackRecord): FeedbackListItem => ({
  id: String(record._id),
  name: record.name,
  email: record.email,
  type: record.type,
  rating: record.rating,
  message: record.message,
  source: record.source ?? 'landing_feedback',
  client: record.client ?? {},
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const createFeedback = async (data: CreateFeedbackInput): Promise<IFeedback> => {
  return Feedback.create({
    ...data,
    source: data.source ?? 'landing_feedback',
  });
};

export interface ListFeedbackOptions {
  search?: string;
  type?: FeedbackType;
  source?: FeedbackSource;
}

export const listFeedback = async (
  options: ListFeedbackOptions = {},
): Promise<FeedbackListItem[]> => {
  const filter: Record<string, unknown> = {};

  if (options.source === 'landing_feedback') {
    filter.$or = [{ source: 'landing_feedback' }, { source: { $exists: false } }];
  } else if (options.source) {
    filter.source = options.source;
  }

  if (options.type) {
    filter.type = options.type;
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const searchFilter = {
      $or: [{ name: regex }, { email: regex }, { message: regex }],
    };

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, searchFilter];
      delete filter.$or;
    } else {
      Object.assign(filter, searchFilter);
    }
  }

  const records = await Feedback.find(filter).sort({ createdAt: -1 }).lean();

  return records.map((record) => toListItem(record as unknown as FeedbackRecord));
};

export const getFeedbackById = async (id: string): Promise<FeedbackDetail> => {
  const record = await Feedback.findById(id).lean();

  if (!record) {
    throw new AppError(404, 'Feedback not found');
  }

  return toListItem(record as unknown as FeedbackRecord);
};

export const deleteFeedback = async (id: string): Promise<void> => {
  const result = await Feedback.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Feedback not found');
  }
};
