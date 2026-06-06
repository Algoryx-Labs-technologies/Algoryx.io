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
      'Varun is a professional trader with a B.Tech in Electrical Engineering, a postgraduate degree in Automation Engineering, and CFA Level 1 candidacy.',
      'He founded Squareoff Investtech and joined Algoryx in 2026 as a stakeholder and CEO to lead sales—bringing client relationships and market credibility to the firm.',
      'Varun aligns Algoryx’s engineering with what funds and businesses need—clarity on risk, execution, and growth at the point of adoption.',
    ],
    quote:
      'The best partnerships start with listening—then aligning technology to how clients actually trade, invest, and scale.',
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
      'He handled tech on a UAE hedge-fund-style platform—maintaining financial data and HNI reporting aligned with 2cents Capital cross-border wealth focus.',
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
      'Previously at Valura.ai he built multi-market trade systems, Lean-based ATS, and AWS backends—applied today to Algoryx’s audit-ready platforms.',
    ],
    quote:
      'Regulation and global reach only work when the backend is institutional—idempotent orders, broker truth, and systems that stay up when markets move.',
  },
];
