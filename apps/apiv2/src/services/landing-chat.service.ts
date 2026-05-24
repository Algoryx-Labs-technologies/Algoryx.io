import { buildAlgoryxSystemPrompt } from '@/data/algoryx-knowledge';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MODEL_FALLBACK_CHAIN = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
] as const;

const MAX_HISTORY_MESSAGES = 16;

function getGeminiConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY?.trim() ?? '',
    preferredModel: process.env.GEMINI_MODEL?.trim() || '',
  };
}

function getModelCandidates(): string[] {
  const { preferredModel } = getGeminiConfig();
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
    lower.includes('resource_exhausted') ||
    lower.includes('limit: 0') ||
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
    'Gemini free-tier quota exceeded for the model(s) tried.',
    retry,
    `Models attempted: ${models}.`,
    'Wait a minute and retry, or set GEMINI_MODEL=gemini-2.5-flash-lite in apps/apiv2/.env.',
    'If it persists: check usage in Google AI Studio or enable billing on the API key project.',
  ]
    .filter(Boolean)
    .join(' ');
}

type GeminiPayload = {
  error?: { message?: string };
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

async function generateWithModel(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<{ ok: true; text: string } | { ok: false; error: string; quota: boolean }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildAlgoryxSystemPrompt() }],
      },
      contents: trimHistory(messages).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 768,
      },
    }),
  });

  const payload = (await response.json()) as GeminiPayload;

  if (!response.ok) {
    const detail = payload.error?.message || response.statusText;
    return { ok: false, error: detail, quota: isQuotaError(detail) || response.status === 429 };
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    return { ok: false, error: 'Empty response from Gemini.', quota: false };
  }

  return { ok: true, text };
}

export function isLandingChatConfigured(): boolean {
  return Boolean(getGeminiConfig().apiKey);
}

export async function sendLandingChat(messages: ChatMessage[]): Promise<string> {
  const { apiKey } = getGeminiConfig();

  if (!apiKey) {
    throw new Error('GEMINI_NOT_CONFIGURED');
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
