import { buildAlgoryxSystemPrompt } from '@/data/algoryx-knowledge';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MODEL_FALLBACK_CHAIN = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-3.5-turbo',
] as const;

const MAX_HISTORY_MESSAGES = 16;

function getOpenAIConfig() {
  return {
    apiKey: process.env.OPENAI_API_KEY?.trim() ?? '',
    preferredModel: process.env.OPENAI_MODEL?.trim() || '',
  };
}

function getModelCandidates(): string[] {
  const { preferredModel } = getOpenAIConfig();
  if (!preferredModel) return [...MODEL_FALLBACK_CHAIN];
  return [preferredModel, ...MODEL_FALLBACK_CHAIN.filter((m) => m !== preferredModel)];
}

function trimHistory(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= MAX_HISTORY_MESSAGES) return messages;
  return messages.slice(-MAX_HISTORY_MESSAGES);
}

function isQuotaError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('insufficient_quota') ||
    lower.includes('billing') ||
    lower.includes('too many requests')
  );
}

function parseRetryHint(message: string): string | null {
  const match = message.match(/retry in ([\d.]+)s/i);
  if (!match) return null;
  const seconds = Math.ceil(parseFloat(match[1]));
  return `Try again in about ${seconds} seconds.`;
}

function formatQuotaError(raw: string, triedModels: string[]): string {
  const retry = parseRetryHint(raw);
  const models = triedModels.join(', ');

  return [
    'OpenAI rate or quota limit reached for the model(s) tried.',
    retry,
    `Models attempted: ${models}.`,
    'Wait a minute and retry, or set OPENAI_MODEL=gpt-4o-mini in apps/apiv2/.env.',
    'If it persists: check usage and billing in the OpenAI dashboard.',
  ]
    .filter(Boolean)
    .join(' ');
}

type OpenAIPayload = {
  error?: { message?: string };
  choices?: Array<{
    message?: { content?: string | null };
  }>;
};

async function generateWithModel(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<{ ok: true; text: string } | { ok: false; error: string; quota: boolean }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildAlgoryxSystemPrompt() },
        ...trimHistory(messages).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.5,
      max_tokens: 1024,
    }),
  });

  const payload = (await response.json()) as OpenAIPayload;

  if (!response.ok) {
    const detail = payload.error?.message || response.statusText;
    return { ok: false, error: detail, quota: isQuotaError(detail) || response.status === 429 };
  }

  const text = payload.choices?.[0]?.message?.content?.trim();

  if (!text) {
    return { ok: false, error: 'Empty response from OpenAI.', quota: false };
  }

  return { ok: true, text };
}

export function isLandingChatConfigured(): boolean {
  return Boolean(getOpenAIConfig().apiKey);
}

export async function sendLandingChat(messages: ChatMessage[]): Promise<string> {
  const { apiKey } = getOpenAIConfig();

  if (!apiKey) {
    throw new Error('OPENAI_NOT_CONFIGURED');
  }

  const candidates = getModelCandidates();
  const tried: string[] = [];
  let lastError = '';

  for (const model of candidates) {
    tried.push(model);
    const result = await generateWithModel(apiKey, model, messages);

    if (result.ok) {
      return result.text;
    }

    lastError = result.error;

    if (!result.quota) {
      throw new Error(result.error);
    }
  }

  throw new Error(formatQuotaError(lastError, tried));
}
