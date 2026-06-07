export type PortfolioCategory = 'recent' | 'ongoing' | 'past';

export interface PortfolioProject {
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

export interface UploadedPortfolioImage {
  url: string;
  publicId: string;
}

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  recent: 'Recent Projects',
  ongoing: 'Ongoing Projects',
  past: 'Selected Past Projects',
};
