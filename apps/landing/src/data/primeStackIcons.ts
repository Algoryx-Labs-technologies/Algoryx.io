import type { IconName } from 'tech-stack-icons';

/** Trading & automation stack — homepage marquee on Prime */
export const PRIME_MARQUEE_ICONS: IconName[] = [
  'python',
  'docker',
  'postgresql',
  'mongodb',
  'react',
  'vitejs',
  'graphql',
  'nvidia',
  'datadog',
  'ec2',
  'vercel',
  'supabase',
  'kubernetes',
  'posthog',
  'openai',
];

export const PRIME_STACK_BY_ID: Record<string, IconName[]> = {
  'broker-integration': ['python', 'docker', 'postgresql', 'graphql', 'datadog', 'ec2', 'kubernetes'],
  'strategy-automation': ['python', 'docker', 'nvidia', 'postgresql', 'datadog', 'graphql', 'ec2'],
  'strategy-backtesting': ['python', 'postgresql', 'mongodb', 'nvidia', 'docker', 'datadog'],
  'strategy-optimization': ['python', 'nvidia', 'postgresql', 'mongodb', 'docker'],
  'custom-screener': ['python', 'docker', 'postgresql', 'graphql', 'datadog', 'mongodb'],
  'custom-dashboard': ['react', 'vitejs', 'vercel', 'supabase', 'postgresql', 'graphql', 'posthog'],
  'strategy-alerts': ['python', 'docker', 'postgresql', 'graphql', 'datadog', 'vercel'],
  'paper-trading': ['python', 'docker', 'postgresql', 'datadog', 'mongodb', 'nvidia'],
};

export function getPrimeStackIcons(serviceId: string): IconName[] {
  return PRIME_STACK_BY_ID[serviceId] ?? ['python', 'docker', 'postgresql'];
}
