export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string[];
  highlight?: string;
  quote?: string;
  featured?: boolean;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'varun-pandya',
    name: 'Varun Pandya',
    role: 'CEO',
    initials: 'VP',
    featured: true,
    bio: [
      'Varun is a professional trader with an Electrical Engineering background and a postgraduate degree in Automation. A CFA Level 1 candidate, he combines technical expertise with hands-on trading experience.',
      'Varun leads the firm’s research and strategy, focused on disciplined, risk-aware investing. He is passionate about empowering clients with disciplined, research-backed strategies to grow and protect wealth in global financial markets.',
      'His unique background in automation allows Algoryx Labs to bridge the gap between algorithmic precision and fundamental financial principles.',
    ],
    quote:
      'Technology doesn\'t replace the human advisor; it liberates them to focus on what matters—the client\'s goals.',
  },
  {
    id: 'technology-lead',
    name: 'Technology Leadership',
    role: 'CTO',
    initials: 'TL',
    bio: [
      'Owns platform architecture, broker integrations, and production systems for traders and investors—from automation pipelines to observability and secure deployments.',
    ],
  },
  {
    id: 'delivery-lead',
    name: 'Client Delivery Leadership',
    role: 'Head of Client Success',
    initials: 'CD',
    bio: [
      'Partners with founders, funds, and desks through discovery, milestone delivery, and post-launch support so every engagement stays transparent and outcome-focused.',
    ],
  },
];
