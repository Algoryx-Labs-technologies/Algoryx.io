import { CAL_BOOKING_URL } from '@/lib/cal';

export type WidgetChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  showConsultationCta?: boolean;
};

const BOOK_MARKER = /\[\[BOOK_CONSULTATION\]\]/gi;

const CONSULTATION_INTENT =
  /\b(book|schedule|set\s*up|arrange|reserve)\b.*\b(consult|consultation|meeting|call|demo|appointment|slot|time)\b|\b(consultation|meeting|call|demo|appointment)\b.*\b(book|schedule)\b|\bhow\s+(can|do)\s+i\s+(book|schedule|start)\b|\bbook\s+a\s+(free\s+)?(consult|consultation|call|meeting|demo)\b/i;

export function wantsConsultation(text: string): boolean {
  return CONSULTATION_INTENT.test(text);
}

export function stripBookMarker(content: string): string {
  return content.replace(BOOK_MARKER, '').trim();
}

export function hasBookMarker(content: string): boolean {
  return /\[\[BOOK_CONSULTATION\]\]/i.test(content);
}

export function shouldShowConsultationCta(
  userPrompt: string,
  assistantContent: string
): boolean {
  if (hasBookMarker(assistantContent)) return true;
  if (wantsConsultation(userPrompt)) return true;
  if (assistantContent.includes(CAL_BOOKING_URL)) return true;
  if (/cal\.com\/algoryx-labs/i.test(assistantContent)) return true;
  return false;
}
