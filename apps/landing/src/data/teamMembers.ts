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
    id: 'pratyush-birole',
    name: 'Pratyush Birole',
    role: 'CTO',
    initials: 'PB',
    expandedProfile: true,
    bio: [
      'Pratyush is a Computer Science engineer who has built production trading and wealth-tech platforms in Dubai and India. He leads engineering for Valura.ai’s global investment platform from GIFT City under the IFSCA free-zone—enabling regulated cross-border access for NRIs and LRS investors through institutional broker connectivity and event-driven backend systems.',
      'Previously he engineered multi-market trade infrastructure and RM operations modules architected algorithmic trading and wallet systems on the Lean Engine at 2Cents Capital, and shipped high-volume registration and payment backends on AWS—experience he applies so Algoryx clients get reliable, audit-ready technology under regulatory constraints.',
    ],
    quote:
      'Regulation and global reach only work when the backend is institutional—idempotent orders, broker truth, and systems that stay up when markets move.',
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
