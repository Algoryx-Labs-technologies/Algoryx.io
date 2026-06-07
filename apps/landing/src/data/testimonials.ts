export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rahul Mehta',
    quote:
      'Algoryx built our execution stack and risk layer with institutional discipline. Latency, monitoring, and handover were exactly what a live desk needs.',
    initials: 'RM',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    quote:
      'From strategy research to production ML pipelines, the team understood markets—not just code. Our backtesting and attribution workflows improved dramatically.',
    initials: 'PS',
  },
  {
    id: '3',
    name: 'Arjun Patel',
    quote:
      'They delivered a full trading platform MVP on time, with clean APIs and broker integrations. Transparent milestones made the engagement easy to manage.',
    initials: 'AP',
  },
  {
    id: '4',
    name: 'Sneha Iyer',
    quote:
      'Our fintech portal went from concept to launch-ready with thoughtful UX, secure auth, and scalable cloud setup. Support after go-live was genuinely helpful.',
    initials: 'SI',
  },
  {
    id: '5',
    name: 'Vikram Desai',
    quote:
      'Bespoke alpha research and risk architecture—not off-the-shelf templates. The desk feels purpose-built for how we actually trade.',
    initials: 'VD',
  },
  {
    id: '6',
    name: 'Ananya Krishnan',
    quote:
      'DevOps, observability, and cost-aware infrastructure were baked in from day one. We stopped juggling vendors for engineering and infra.',
    initials: 'AK',
  },
  {
    id: '7',
    name: 'Karan Singh',
    quote:
      'Their AI doubt-resolution and analytics hooks gave us real feedback loops in the product. Engineering quality matched the product vision.',
    initials: 'KS',
  },
  {
    id: '8',
    name: 'Meera Nair',
    quote:
      'Documentation, tests, and clear ownership transfer set them apart. Our internal team could extend the codebase without a black box.',
    initials: 'MN',
  },
  {
    id: '9',
    name: 'David Chen',
    quote:
      'Creative production and technical delivery under one roof saved us weeks. The brand and product story finally feel aligned.',
    initials: 'DC',
  },
];
