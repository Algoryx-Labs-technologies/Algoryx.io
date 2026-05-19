import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Smartphone,
  Brain,
  CloudCog,
  Rocket,
  Clapperboard,
} from 'lucide-react';

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
};

export const SERVICES: Service[] = [
  {
    id: 'trading-bots',
    title: 'Trading Bot & Automated System Development',
    tagline: 'Systematic execution built for real markets',
    shortDescription:
      'Design, build, and deploy algorithmic trading systems, execution bots, and market automation tailored to your strategy and infrastructure.',
    overview:
      'We engineer production-grade trading automation—from signal generation and risk controls to broker integrations and low-latency execution. Whether you trade equities, derivatives, or crypto, our systems are built with observability, fail-safes, and Indian market realities in mind.',
    highlights: [
      'Strategy backtesting and paper-trading pipelines',
      'Broker and exchange API integrations (REST & WebSocket)',
      'Risk management, position sizing, and kill switches',
      'Real-time monitoring, alerts, and audit logs',
    ],
    deliverables: [
      'Architecture design & technical specification',
      'Bot codebase with configurable parameters',
      'Deployment on cloud or VPS with CI/CD',
      'Documentation and handover session',
    ],
    process: [
      'Discovery — goals, markets, brokers, and constraints',
      'Prototype — core logic, backtests, and paper trading',
      'Hardening — risk layers, monitoring, and staging deploy',
      'Go-live — production rollout and support window',
    ],
    icon: Bot,
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
  },
  {
    id: 'ai-ml',
    title: 'AI & ML Development',
    tagline: 'Intelligent systems that create measurable value',
    shortDescription:
      'Custom machine learning models, LLM integrations, and data pipelines for forecasting, automation, and decision support.',
    overview:
      'We build applied AI—not demos. From feature engineering and model training to MLOps and inference APIs, we help you embed intelligence into trading, operations, and customer experiences with clear evaluation metrics.',
    highlights: [
      'Predictive models for time series and classification',
      'LLM-powered assistants and RAG knowledge bases',
      'Data cleaning, labeling workflows, and feature stores',
      'Model monitoring, retraining, and versioning',
    ],
    deliverables: [
      'Problem framing and success metrics',
      'Trained models with evaluation reports',
      'Inference API or embedded integration',
      'MLOps setup and team knowledge transfer',
    ],
    process: [
      'Data audit — sources, quality, and feasibility',
      'Experiment — baselines, features, and model selection',
      'Productionize — APIs, latency, and guardrails',
      'Operate — monitoring, drift detection, and improvements',
    ],
    icon: Brain,
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
  },
];

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
