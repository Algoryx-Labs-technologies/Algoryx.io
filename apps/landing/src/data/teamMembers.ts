export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string[];
  highlight?: string;
  quote?: string;
  /** Renders full editorial leadership layout on the About page */
  expandedProfile?: boolean;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'varun-pandya',
    name: 'Varun Pandya',
    role: 'CEO',
    initials: 'VP',
    expandedProfile: true,
    bio: [
      'Varun is a professional trader with an Electrical Engineering background and a postgraduate degree in Automation. A CFA Level 1 candidate, he combines technical expertise with hands-on trading experience.',
      'Varun leads the firm’s research and strategy, focused on disciplined, risk-aware investing. He is passionate about empowering clients with disciplined, research-backed strategies to grow and protect wealth in global financial markets.',
      'His unique background in automation allows Algoryx Labs to bridge the gap between algorithmic precision and fundamental financial principles.',
    ],
    quote:
      'Technology doesn\'t replace the human advisor; it liberates them to focus on what matters—the client\'s goals.',
  },
  {
    id: 'abhishek-gupta',
    name: 'Abhishek Gupta',
    role: 'Co-Founder',
    initials: 'AG',
    expandedProfile: true,
    bio: [
      'Abhishek brings a fintech foundation in financial backends, modelling, and market terminology—along with scalable SaaS built for growing usage and data.',
      'Since 2022 he has analysed Indian equities, shaping platform decisions around real sector, index, and risk dynamics.',
      'He handled tech on a UAE hedge-fund-style platform—maintaining financial data and HNI reporting aligned with Algoryx’s cross-border wealth focus.',
    ],
    quote:
      'Strong products in finance start with models and terms everyone trusts—and backends that scale without breaking when portfolios do.',
  },
  {
    id: 'pratyush-birole',
    name: 'Pratyush Birole',
    role: 'CTO',
    initials: 'PB',
    expandedProfile: true,
    bio: [
      'Pratyush is a Computer Science engineer with production trading and wealth-tech experience across Dubai and India.',
      'He lead engineering for Valura.ai’s GIFT City platform under IFSCA—regulated cross-border access for NRIs and LRS investors through institutional broker integration.',
      'Previously at Valura.ai and 2Cents Capital he built multi-market trade systems, Lean-based ATS, and AWS backends—applied today to Algoryx’s audit-ready platforms.',
    ],
    quote:
      'Regulation and global reach only work when the backend is institutional—idempotent orders, broker truth, and systems that stay up when markets move.',
  },
];
