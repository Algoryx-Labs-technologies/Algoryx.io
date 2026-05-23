import type { LucideIcon } from 'lucide-react';
import type { IconName } from 'tech-stack-icons';
import {
  Layers,
  Smartphone,
  Brain,
  CloudCog,
  Rocket,
  Clapperboard,
} from 'lucide-react';
import { SERVICE_STACK_BY_ID } from './serviceStackIcons';

export type Service = {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  highlights: string[];
  deliverables: string[];
  process: string[];
  icon: LucideIcon;
  stackIcons: IconName[];
};

export const SERVICES: Service[] = [
  {
    id: 'saas-development',
    title: 'SaaS Development Agency',
    tagline: 'Build software for companies',
    shortDescription:
      'We design and deliver custom SaaS products that help teams manage customers, operations, and revenue—from first wireframe to production launch.',
    overview:
      'Algoryx Labs acts as your SaaS development partner for business-critical software. We build multi-tenant platforms, role-based admin experiences, and integrations your teams rely on daily—scoped for maintainability and ready to grow with your company.',
    highlights: [
      'CRM systems',
      'ERP systems',
      'Dashboards',
      'Admin portals',
      'Inventory systems',
      'Booking platforms',
      'Marketplace apps',
    ],
    deliverables: [
      'Product discovery, user flows, and technical architecture',
      'Production-ready SaaS codebase with auth, roles, and APIs',
      'Admin panels, reporting, and third-party integrations',
      'Deployment, documentation, and handover to your team',
    ],
    process: [
      'Discover — workflows, users, integrations, and success metrics',
      'Design — UX, data model, and phased delivery roadmap',
      'Build — iterative sprints with staging demos and QA',
      'Launch — production rollout, training, and support window',
    ],
    icon: Layers,
    stackIcons: SERVICE_STACK_BY_ID['saas-development'],
  },
  {
    id: 'web-app',
    title: 'Web & App Development',
    tagline: 'Fast, reliable products users love',
    shortDescription:
      'Full-stack web and mobile applications—from customer-facing platforms to internal dashboards—with modern stacks and scalable architecture.',
    overview:
      'Algoryx Labs delivers end-to-end product engineering: UX-minded interfaces, secure APIs, databases, and deployments that scale. We work with startups and enterprises on fintech portals, SaaS products, admin panels, and customer apps.',
    highlights: [
      'React, Next.js, and modern frontend patterns',
      'REST & GraphQL APIs with robust auth',
      'Responsive design and accessibility best practices',
      'Performance optimization and SEO-ready builds',
    ],
    deliverables: [
      'UI/UX implementation aligned to your brand',
      'Backend services and database schema',
      'Authentication, roles, and admin tooling',
      'Production deployment and maintenance plan',
    ],
    process: [
      'Scope — requirements, wireframes, and milestones',
      'Build — iterative sprints with demos',
      'QA — testing, security review, and fixes',
      'Launch — deploy, monitor, and iterate',
    ],
    icon: Smartphone,
    stackIcons: SERVICE_STACK_BY_ID['web-app'],
  },
  {
    id: 'ai-ml',
    title: 'AI & Automation Services',
    tagline: 'Huge global demand right now',
    shortDescription:
      'Deploy AI chatbots, support agents, voice assistants, and workflow automation that reduce manual work and improve how your team serves customers.',
    overview:
      'We help companies adopt practical AI—not slide decks. From customer-facing chatbots and sales assistants to internal copilots and document automation, we design, integrate, and ship systems that plug into your stack, respect your data, and deliver measurable time savings.',
    highlights: [
      'AI chatbots',
      'AI customer support agents',
      'Voice AI',
      'AI sales assistants',
      'Workflow automation',
      'AI document processing',
      'AI-powered analytics',
      'Internal company copilots',
    ],
    deliverables: [
      'Use-case discovery, prompts, and integration architecture',
      'Production AI agents connected to your CRM, helpdesk, or internal tools',
      'Workflow automations, document pipelines, and analytics dashboards',
      'Monitoring, guardrails, documentation, and team handover',
    ],
    process: [
      'Assess — workflows, data sources, compliance, and ROI targets',
      'Prototype — pilot bots, automations, or copilots on real scenarios',
      'Integrate — APIs, auth, logging, and human-in-the-loop fallbacks',
      'Scale — rollout, tuning, analytics, and ongoing improvements',
    ],
    icon: Brain,
    stackIcons: SERVICE_STACK_BY_ID['ai-ml'],
  },
  {
    id: 'devops',
    title: 'DevOps Services',
    tagline: 'Ship faster with stable, secure infrastructure',
    shortDescription:
      'Cloud infrastructure, CI/CD pipelines, container orchestration, and site reliability practices so your team can deploy with confidence.',
    overview:
      'Our DevOps practice covers the full delivery lifecycle: infrastructure as code, automated testing in pipelines, secrets management, logging, and cost-aware cloud design on AWS, GCP, or Azure—or bare-metal and VPS setups when that fits best.',
    highlights: [
      'Docker, Kubernetes, and containerized workloads',
      'GitHub Actions, GitLab CI, or Jenkins pipelines',
      'Terraform / CloudFormation infrastructure as code',
      'Centralized logging, metrics, and on-call alerting',
    ],
    deliverables: [
      'Infrastructure architecture diagram',
      'IaC repositories and environment separation',
      'CI/CD pipelines with staging and production gates',
      'Runbooks, backups, and incident playbooks',
    ],
    process: [
      'Assess — current stack, pain points, and SLAs',
      'Design — target architecture and migration plan',
      'Implement — pipelines, clusters, and observability',
      'Enable — train your team and hand off operations',
    ],
    icon: CloudCog,
    stackIcons: SERVICE_STACK_BY_ID['devops'],
  },
  {
    id: 'mvp',
    title: 'MVP Development',
    tagline: 'Validate ideas quickly without cutting corners',
    shortDescription:
      'Lean, launch-ready minimum viable products that prove market fit while keeping a clean foundation for what comes next.',
    overview:
      'We help founders and product teams go from concept to live MVP in weeks—not months. Scope is ruthlessly prioritized, but code quality and architecture choices still support growth so you are not rebuilding from scratch after traction.',
    highlights: [
      'Rapid prototyping with clear milestone demos',
      'Core features only—no scope creep by default',
      'Analytics hooks and feedback loops built in',
      'Technical roadmap for post-MVP scaling',
    ],
    deliverables: [
      'Product scope document and timeline',
      'Working MVP on staging and production URLs',
      'Basic admin and user flows',
      'Post-launch iteration backlog',
    ],
    process: [
      'Workshop — problem, users, and must-have features',
      'Sprint build — weekly demos and adjustments',
      'Beta launch — limited users and instrumentation',
      'Learn — metrics review and v2 planning',
    ],
    icon: Rocket,
    stackIcons: SERVICE_STACK_BY_ID['mvp'],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    tagline: 'Polished visuals for brands and educators',
    shortDescription:
      'Professional video editing for explainers, course content, social campaigns, and product demos—with motion graphics and consistent brand styling.',
    overview:
      'From raw footage to publish-ready assets, we handle cuts, color, captions, sound design, and motion overlays. Ideal for ed-tech, fintech marketing, YouTube series, and launch campaigns that need a premium, cohesive look.',
    highlights: [
      'Long-form and short-form editing workflows',
      'Motion graphics, lower thirds, and branded templates',
      'Subtitle/caption tracks and multi-aspect exports',
      'Platform-ready outputs (YouTube, Reels, LinkedIn)',
    ],
    deliverables: [
      'Edit brief and style guide alignment',
      'First cut, revisions, and final master',
      'Exported formats per platform',
      'Project files and asset archive (on request)',
    ],
    process: [
      'Brief — audience, tone, length, and references',
      'Assembly — rough cut and structure approval',
      'Polish — color, audio, graphics, and captions',
      'Delivery — finals and format variations',
    ],
    icon: Clapperboard,
    stackIcons: SERVICE_STACK_BY_ID['video-editing'],
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
