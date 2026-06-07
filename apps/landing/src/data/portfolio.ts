export type PortfolioCategory = 'recent' | 'ongoing' | 'past';

export interface PortfolioProject {
  id: string;
  title: string;
  description?: string;
  category: PortfolioCategory;
  imageUrl: string;
  techStack: string[];
  clientName?: string;
}

export const PORTFOLIO_SECTIONS: {
  key: PortfolioCategory;
  title: string;
  description: string;
}[] = [
  {
    key: 'recent',
    title: 'Recent Projects',
    description: 'Fresh builds and launches from our latest client engagements.',
  },
  {
    key: 'ongoing',
    title: 'Ongoing Projects',
    description: 'Active partnerships we are shipping right now across product and engineering.',
  },
  {
    key: 'past',
    title: 'Selected Past Projects',
    description: 'Highlight work from our archive that best represents Algoryx Labs craftsmanship.',
  },
];
