import type { IconName } from 'tech-stack-icons';

/** Homepage services marquee — unique icons only */
export const SERVICE_MARQUEE_ICONS: IconName[] = [
  'vitejs',
  'wordpress',
  'supabase',
  'openai',
  'nvidia',
  'mongodb',
  'meta',
  'lovable',
  'kotlin',
  'jira',
  'groq',
  'graphql',
  'grok',
  'gemma',
  'firebase',
  'figma',
  'faunadb',
  'electron',
  'ec2',
  'docker',
  'deepseek',
  'deepmind',
  'deepinfra',
  'datadog',
  'copilotgithub',
];

export const SERVICE_STACK_BY_ID: Record<string, IconName[]> = {
  'trading-bots': ['python', 'docker', 'mongodb', 'graphql', 'datadog', 'ec2', 'nvidia'],
  'web-app': ['vitejs', 'supabase', 'firebase', 'graphql', 'kotlin', 'electron', 'figma', 'wordpress'],
  'ai-ml': [
    'openai',
    'groq',
    'grok',
    'gemma',
    'deepseek',
    'deepmind',
    'deepinfra',
    'nvidia',
    'copilotgithub',
  ],
  'devops': ['docker', 'kubernetes', 'aws', 'ec2', 'datadog', 'github', 'jira', 'terraform'],
  'mvp': ['vitejs', 'firebase', 'supabase', 'lovable', 'figma', 'jira'],
  'video-editing': ['figma', 'meta'],
};
