import {
  IPortfolioProject,
  PortfolioCategory,
  PortfolioProject,
  PORTFOLIO_CATEGORIES,
} from '@/models/portfolio-project.model';
import { AppError } from '@/types';
import { deletePortfolioImage } from '@/services/cloudinary.service';

export interface PortfolioProjectItem {
  id: string;
  title: string;
  description?: string;
  category: PortfolioCategory;
  imageUrl: string;
  imagePublicId?: string;
  techStack: string[];
  clientName?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioProjectInput {
  title: string;
  description?: string;
  category: PortfolioCategory;
  imageUrl: string;
  imagePublicId?: string;
  techStack?: string[];
  clientName?: string;
  isPublished?: boolean;
}

export interface UpdatePortfolioProjectInput {
  title?: string;
  description?: string;
  category?: PortfolioCategory;
  imageUrl?: string;
  imagePublicId?: string;
  techStack?: string[];
  clientName?: string;
  isPublished?: boolean;
}

export interface PublicPortfolioResponse {
  recent: PortfolioProjectItem[];
  ongoing: PortfolioProjectItem[];
  past: PortfolioProjectItem[];
}

export interface ListPortfolioOptions {
  category?: PortfolioCategory;
  search?: string;
  publishedOnly?: boolean;
}

const toItem = (record: IPortfolioProject): PortfolioProjectItem => ({
  id: String(record._id),
  title: record.title,
  description: record.description,
  category: record.category,
  imageUrl: record.imageUrl,
  imagePublicId: record.imagePublicId,
  techStack: record.techStack ?? [],
  clientName: record.clientName,
  isPublished: record.isPublished,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

const buildFilter = (options: ListPortfolioOptions): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (options.category) {
    filter.category = options.category;
  }

  if (options.publishedOnly) {
    filter.isPublished = true;
  }

  if (options.search?.trim()) {
    const term = options.search.trim();
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { clientName: regex },
      { techStack: regex },
    ];
  }

  return filter;
};

export const listPortfolioProjects = async (
  options: ListPortfolioOptions = {},
): Promise<PortfolioProjectItem[]> => {
  const records = await PortfolioProject.find(buildFilter(options))
    .sort({ createdAt: -1 })
    .lean();

  return records.map((record) => toItem(record as unknown as IPortfolioProject));
};

export const getPublicPortfolio = async (): Promise<PublicPortfolioResponse> => {
  const records = await PortfolioProject.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();

  const grouped: PublicPortfolioResponse = {
    recent: [],
    ongoing: [],
    past: [],
  };

  for (const record of records) {
    const item = toItem(record as unknown as IPortfolioProject);
    grouped[item.category].push(item);
  }

  return grouped;
};

export const createPortfolioProject = async (
  data: CreatePortfolioProjectInput,
): Promise<PortfolioProjectItem> => {
  const record = await PortfolioProject.create({
    title: data.title,
    description: data.description,
    category: data.category,
    imageUrl: data.imageUrl,
    imagePublicId: data.imagePublicId,
    techStack: data.techStack ?? [],
    clientName: data.clientName,
    isPublished: data.isPublished ?? true,
  });

  return toItem(record);
};

export const updatePortfolioProject = async (
  id: string,
  data: UpdatePortfolioProjectInput,
): Promise<PortfolioProjectItem> => {
  const existing = await PortfolioProject.findById(id);

  if (!existing) {
    throw new AppError(404, 'Portfolio project not found');
  }

  if (
    data.imagePublicId &&
    existing.imagePublicId &&
    data.imagePublicId !== existing.imagePublicId
  ) {
    try {
      await deletePortfolioImage(existing.imagePublicId);
    } catch {
      // Keep update path resilient if old asset cleanup fails.
    }
  }

  const record = await PortfolioProject.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    throw new AppError(404, 'Portfolio project not found');
  }

  return toItem(record);
};

export const deletePortfolioProject = async (id: string): Promise<void> => {
  const record = await PortfolioProject.findById(id);

  if (!record) {
    throw new AppError(404, 'Portfolio project not found');
  }

  if (record.imagePublicId) {
    try {
      await deletePortfolioImage(record.imagePublicId);
    } catch {
      // Proceed with DB delete even if Cloudinary cleanup fails.
    }
  }

  await PortfolioProject.findByIdAndDelete(id);
};

export const getPortfolioCategories = (): PortfolioCategory[] => [...PORTFOLIO_CATEGORIES];
