import type { SubmitSupportTicketInput, SupportCategory, SupportPriority } from '@/lib/api';

export type ChatFlowType = 'requirement' | 'support';

export type ChatFlowState = {
  type: ChatFlowType;
  stepIndex: number;
  data: Record<string, string>;
};

export type RequirementPayload = {
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource: string;
};

type FlowStep = {
  key: string;
  prompt: string;
  optional?: boolean;
  validate: (value: string) => string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEAR_ABOUT_OPTIONS: { value: string; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google Search' },
  { value: 'friend', label: 'Friend / Referral' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'community', label: 'Community / WhatsApp' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_OPTIONS: { value: SupportCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'feature-request', label: 'Feature request' },
  { value: 'account', label: 'Account' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS: { value: SupportPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

function formatNumberedOptions(options: { value: string; label: string }[]): string {
  return options.map((o, i) => `${i + 1}. ${o.label} (\`${o.value}\`)`).join('\n');
}

function isSkipAnswer(value: string): boolean {
  return /^(skip|none|n\/a|na|-)$/i.test(value.trim());
}

function matchOption<T extends string>(
  input: string,
  options: { value: T; label: string }[],
): T | null {
  const trimmed = input.trim().toLowerCase();
  const byNumber = trimmed.match(/^(\d+)$/);
  if (byNumber) {
    const idx = parseInt(byNumber[1], 10) - 1;
    if (idx >= 0 && idx < options.length) return options[idx].value;
  }
  const exact = options.find((o) => o.value === trimmed);
  if (exact) return exact.value;
  const byLabel = options.find((o) => o.label.toLowerCase() === trimmed);
  if (byLabel) return byLabel.value;
  const partial = options.find(
    (o) =>
      o.label.toLowerCase().includes(trimmed) ||
      trimmed.includes(o.label.toLowerCase()) ||
      o.value.replace(/-/g, ' ').includes(trimmed),
  );
  return partial?.value ?? null;
}

const REQUIREMENT_STEPS: FlowStep[] = [
  {
    key: 'fullName',
    prompt: "Let's submit your **project requirement**. What's your full name?",
    validate: (v) => (v.trim().length < 2 ? 'Please enter your full name (at least 2 characters).' : null),
  },
  {
    key: 'email',
    prompt: 'What email should we use to reach you?',
    validate: (v) => (!EMAIL_RE.test(v.trim()) ? 'Please enter a valid email address.' : null),
  },
  {
    key: 'phone',
    prompt: 'Your phone number (with country code if outside India)?',
    validate: (v) => (v.trim().length < 6 ? 'Please enter a valid phone number.' : null),
  },
  {
    key: 'companyOrg',
    prompt: 'Company or organization? Reply **skip** if none.',
    optional: true,
    validate: () => null,
  },
  {
    key: 'message',
    prompt:
      'Describe your project or requirement in as much detail as you like (goals, timeline, tech stack, budget range, etc.).',
    validate: (v) => (v.trim().length < 10 ? 'Please add a bit more detail (at least 10 characters).' : null),
  },
  {
    key: 'haveSource',
    prompt: `How did you hear about Algoryx Labs?\n\n${formatNumberedOptions(HEAR_ABOUT_OPTIONS)}\n\nReply with the number or name (e.g. \`linkedin\`).`,
    validate: (v) =>
      matchOption(v, HEAR_ABOUT_OPTIONS) ? null : 'Pick one option from the list (number or name).',
  },
];

const SUPPORT_STEPS: FlowStep[] = [
  {
    key: 'name',
    prompt: "I'll help you **raise a support ticket**. What's your name?",
    validate: (v) => (v.trim().length < 2 ? 'Please enter your name.' : null),
  },
  {
    key: 'email',
    prompt: 'Your email address?',
    validate: (v) => (!EMAIL_RE.test(v.trim()) ? 'Please enter a valid email address.' : null),
  },
  {
    key: 'subject',
    prompt: 'Brief subject for this ticket?',
    validate: (v) => (v.trim().length < 3 ? 'Subject should be at least 3 characters.' : null),
  },
  {
    key: 'category',
    prompt: `Category:\n\n${formatNumberedOptions(CATEGORY_OPTIONS)}\n\nReply with number or name (e.g. \`technical\`).`,
    validate: (v) => (matchOption(v, CATEGORY_OPTIONS) ? null : 'Choose a category from the list.'),
  },
  {
    key: 'priority',
    prompt: `Priority:\n\n${formatNumberedOptions(PRIORITY_OPTIONS)}\n\nReply with number or name (e.g. \`high\`).`,
    validate: (v) => (matchOption(v, PRIORITY_OPTIONS) ? null : 'Choose a priority from the list.'),
  },
  {
    key: 'description',
    prompt: 'Describe the issue or request in detail.',
    validate: (v) => (v.trim().length < 10 ? 'Please add more detail (at least 10 characters).' : null),
  },
];

function getSteps(type: ChatFlowType): FlowStep[] {
  return type === 'requirement' ? REQUIREMENT_STEPS : SUPPORT_STEPS;
}

export function createFlowState(type: ChatFlowType): ChatFlowState {
  return { type, stepIndex: 0, data: {} };
}

export function getFlowIntro(type: ChatFlowType): string {
  if (type === 'requirement') {
    return "I'll collect your project details step by step. Reply **cancel** anytime to stop.\n\n";
  }
  return "I'll collect your support ticket details step by step. Reply **cancel** anytime to stop.\n\n";
}

export function getCurrentStepPrompt(state: ChatFlowState): string {
  const step = getSteps(state.type)[state.stepIndex];
  return step?.prompt ?? '';
}

export function isFlowCancel(text: string): boolean {
  return /^(cancel|stop|exit|quit|nevermind|never mind)$/i.test(text.trim());
}

const REQUIREMENT_INTENT =
  /\b(submit|send|share|post|start|create)\b.*\b(requirement|requirements|project\s*enquiry|enquiry|inquiry|proposal|rfp)\b|\b(project\s*)?requirement\b|\bwork\s+with\s+algoryx\b.*\b(form|submit)\b|\bi\s+want\s+to\s+(hire|work\s+with)\b/i;

const SUPPORT_INTENT =
  /\b(raise|open|create|submit|file)\b.*\b(support\s*)?ticket\b|\bhelp\s*(and\s*)?support\b|\bsupport\s*request\b|\btechnical\s*issue\b|\bneed\s+help\s+with\b/i;

export function detectFlowIntent(text: string): ChatFlowType | null {
  const t = text.trim();
  if (SUPPORT_INTENT.test(t) && !REQUIREMENT_INTENT.test(t)) return 'support';
  if (REQUIREMENT_INTENT.test(t)) return 'requirement';
  if (/^submit\s+(a\s+)?requirement$/i.test(t)) return 'requirement';
  if (/^raise\s+(a\s+)?(help\s+)?ticket$/i.test(t)) return 'support';
  return null;
}

const FLOW_MARKERS = {
  requirement: /\[\[START_REQUIREMENT_FLOW\]\]/i,
  support: /\[\[START_SUPPORT_FLOW\]\]/i,
};

export function parseAiFlowMarker(content: string): ChatFlowType | null {
  if (FLOW_MARKERS.requirement.test(content)) return 'requirement';
  if (FLOW_MARKERS.support.test(content)) return 'support';
  return null;
}

export function stripFlowMarkers(content: string): string {
  return content
    .replace(/\[\[START_REQUIREMENT_FLOW\]\]/gi, '')
    .replace(/\[\[START_SUPPORT_FLOW\]\]/gi, '')
    .trim();
}

function normalizeStepValue(type: ChatFlowType, key: string, raw: string): string {
  const trimmed = raw.trim();
  if (type === 'requirement' && key === 'haveSource') {
    return matchOption(trimmed, HEAR_ABOUT_OPTIONS) ?? trimmed;
  }
  if (type === 'support' && key === 'category') {
    return matchOption(trimmed, CATEGORY_OPTIONS) ?? trimmed;
  }
  if (type === 'support' && key === 'priority') {
    return matchOption(trimmed, PRIORITY_OPTIONS) ?? trimmed;
  }
  return trimmed;
}

export function processFlowAnswer(
  state: ChatFlowState,
  answer: string,
): {
  state: ChatFlowState;
  error?: string;
  complete?: boolean;
  requirement?: RequirementPayload;
  support?: SubmitSupportTicketInput;
} {
  const steps = getSteps(state.type);
  const step = steps[state.stepIndex];
  if (!step) {
    return { state, error: 'Something went wrong. Say **cancel** and try again.' };
  }

  let value = answer.trim();
  if (step.optional && isSkipAnswer(value)) {
    value = '';
  } else {
    const validationError = step.validate(value);
    if (validationError) {
      return { state, error: validationError };
    }
    value = normalizeStepValue(state.type, step.key, value);
  }

  const data = { ...state.data, [step.key]: value };
  const nextIndex = state.stepIndex + 1;

  if (nextIndex >= steps.length) {
    if (state.type === 'requirement') {
      return {
        state: { ...state, data, stepIndex: nextIndex },
        complete: true,
        requirement: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          companyOrg: data.companyOrg || undefined,
          message: data.message,
          haveSource: data.haveSource,
        },
      };
    }
    return {
      state: { ...state, data, stepIndex: nextIndex },
      complete: true,
      support: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        category: data.category as SupportCategory,
        priority: data.priority as SupportPriority,
        description: data.description,
      },
    };
  }

  return {
    state: { type: state.type, stepIndex: nextIndex, data },
  };
}

export function getFlowPlaceholder(type: ChatFlowType | null): string {
  if (type === 'requirement') return 'Answer to submit your requirement…';
  if (type === 'support') return 'Answer to submit your ticket…';
  return 'Ask about Algoryx Labs…';
}
