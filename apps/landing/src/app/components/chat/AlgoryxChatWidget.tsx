import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  sendLandingChatMessage,
  submitLandingEnquiry,
  submitSupportTicket,
} from '@/lib/api';
import { BookConsultationButton } from '../BookConsultationButton';
import { ScrollArea } from '../ui/scroll-area';
import { ConsultationCta } from './ConsultationCta';
import {
  type WidgetChatMessage,
  shouldShowConsultationCta,
  stripAssistantMarkers,
} from './chat-utils';
import {
  createFlowState,
  detectFlowIntent,
  getCurrentStepPrompt,
  getFlowIntro,
  getFlowPlaceholder,
  isFlowCancel,
  parseAiFlowMarker,
  processFlowAnswer,
  stripFlowMarkers,
  type ChatFlowState,
  type ChatFlowType,
} from './chat-flows';
import { MessageTextWithLinks } from './MessageTextWithLinks';

const WELCOME: WidgetChatMessage = {
  role: 'assistant',
  content:
    "Hi — I'm the Algoryx Labs assistant. Ask about services, Prime, or founders—or say **submit my requirement** or **raise a help ticket** and I'll collect your details here.",
};

const QUICK_PROMPTS = [
  'What services does Algoryx Labs offer?',
  'Submit my project requirement',
  'Raise a help ticket',
  'Who are the Algoryx founders?',
  'Tell me about Algoryx Prime',
] as const;

function MessageBubble({ message }: { message: WidgetChatMessage }) {
  const isUser = message.role === 'user';
  const body = isUser ? message.content : stripAssistantMarkers(message.content);

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-md'
            : 'bg-white/5 border border-white/10 text-gray-100 rounded-bl-md'
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5 text-cyan-400/90">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Algoryx</span>
          </div>
        )}
        <p className="whitespace-pre-wrap">
          {isUser ? body : <MessageTextWithLinks text={body} />}
        </p>
        {!isUser && message.showConsultationCta && <ConsultationCta />}
      </div>
    </div>
  );
}

function appendAssistant(messages: WidgetChatMessage[], content: string): WidgetChatMessage[] {
  return [...messages, { role: 'assistant', content }];
}

export function AlgoryxChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<ChatFlowState | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const beginFlow = (type: ChatFlowType, introPrefix = '') => {
    const state = createFlowState(type);
    setActiveFlow(state);
    const intro = introPrefix || getFlowIntro(type);
    setMessages((prev) =>
      appendAssistant(prev, `${intro}${getCurrentStepPrompt(state)}`),
    );
  };

  const cancelFlow = () => {
    setActiveFlow(null);
    setMessages((prev) =>
      appendAssistant(
        prev,
        'Cancelled. Ask me anything else—or say **submit my requirement** or **raise a help ticket** to try again.',
      ),
    );
  };

  const submitCompletedFlow = async (
    kind: 'requirement' | 'support',
    payload: NonNullable<
      ReturnType<typeof processFlowAnswer>['requirement'] | ReturnType<typeof processFlowAnswer>['support']
    >,
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (kind === 'requirement' && payload && 'fullName' in payload) {
        const response = await submitLandingEnquiry({
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          companyOrg: payload.companyOrg,
          message: payload.message,
          haveSource: payload.haveSource,
        });
        setLoading(false);
        if (!response.success) {
          setError(response.error ?? 'Failed to submit requirement.');
          setMessages((prev) =>
            appendAssistant(
              prev,
              `Sorry, we could not submit your requirement: ${response.error ?? 'please try again.'} You can also use **Connect** on the homepage.`,
            ),
          );
          return;
        }
        setMessages((prev) =>
          appendAssistant(
            prev,
            `✅ **Requirement submitted successfully.** Our team will reach out at **${payload.email}**. Thank you!`,
          ),
        );
        return;
      }

      if (kind === 'support' && payload && 'subject' in payload) {
        const response = await submitSupportTicket(payload);
        setLoading(false);
        if (!response.success) {
          setError(response.error ?? 'Failed to submit ticket.');
          setMessages((prev) =>
            appendAssistant(
              prev,
              `Sorry, we could not submit your ticket: ${response.error ?? 'please try again.'} You can also use **Help** in the footer.`,
            ),
          );
          return;
        }
        setMessages((prev) =>
          appendAssistant(
            prev,
            `✅ **Support ticket submitted.** We'll respond within 24–48 hours at **${payload.email}**. Thank you!`,
          ),
        );
      }
    } catch {
      setLoading(false);
      setError('Network error. Please try again.');
      setMessages((prev) =>
        appendAssistant(prev, 'Something went wrong submitting your request. Please try again.'),
      );
    }
  };

  const handleFlowAnswer = async (trimmed: string) => {
    if (!activeFlow) return;

    if (isFlowCancel(trimmed)) {
      cancelFlow();
      return;
    }

    const userMessage: WidgetChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);

    const result = processFlowAnswer(activeFlow, trimmed);

    if (result.error) {
      setMessages((prev) =>
        appendAssistant(prev, `${result.error}\n\n${getCurrentStepPrompt(activeFlow)}`),
      );
      return;
    }

    if (result.complete) {
      setActiveFlow(null);
      if (result.requirement) {
        await submitCompletedFlow('requirement', result.requirement);
      } else if (result.support) {
        await submitCompletedFlow('support', result.support);
      }
      return;
    }

    setActiveFlow(result.state);
    setMessages((prev) => appendAssistant(prev, getCurrentStepPrompt(result.state)));
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);

    if (activeFlow) {
      setInput('');
      await handleFlowAnswer(trimmed);
      return;
    }

    const flowIntent = detectFlowIntent(trimmed);
    if (flowIntent) {
      const userMessage: WidgetChatMessage = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      beginFlow(flowIntent);
      return;
    }

    const userMessage: WidgetChatMessage = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const result = await sendLandingChatMessage(
      nextMessages.map(({ role, content }) => ({ role, content })),
    );

    setLoading(false);

    if (!result.success || !result.data?.message) {
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }

    const rawReply = result.data.message;
    const flowFromAi = parseAiFlowMarker(rawReply);

    if (flowFromAi) {
      const intro = stripFlowMarkers(rawReply);
      beginFlow(flowFromAi, intro ? `${intro}\n\n` : '');
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: rawReply,
        showConsultationCta: shouldShowConsultationCta(trimmed, rawReply),
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const handleFabClick = () => setOpen((prev) => !prev);

  const showQuickPrompts = messages.length <= 1 && !loading && !activeFlow;

  return (
    <div
      className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-[min(100vw-2.5rem,380px)] h-[min(72vh,520px)] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950/98 via-slate-900/98 to-slate-950/98 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-xl"
          >
            <div className="relative flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 shrink-0">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Algoryx Assistant</p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {activeFlow?.type === 'requirement'
                      ? 'Submitting requirement…'
                      : activeFlow?.type === 'support'
                        ? 'Raising support ticket…'
                        : 'Services · Prime · Trading · AI'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0 px-3 py-3">
              <div className="space-y-3 pr-2">
                {messages.map((msg, i) => (
                  <MessageBubble key={`${msg.role}-${i}-${msg.content.slice(0, 24)}`} message={msg} />
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm pl-1">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>{activeFlow ? 'Submitting…' : 'Thinking…'}</span>
                  </div>
                )}
                {error && (
                  <p className="text-xs text-red-400/90 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {showQuickPrompts && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:border-cyan-500/40 hover:text-cyan-200 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-white/10 p-3 bg-slate-950/80"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getFlowPlaceholder(activeFlow?.type ?? null)}
                  rows={1}
                  disabled={loading}
                  className="flex-1 min-h-[42px] max-h-28 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg disabled:opacity-40 hover:from-cyan-400 hover:to-blue-500 transition-all"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {activeFlow && (
                <p className="mt-1.5 text-[10px] text-gray-500 text-center">
                  Reply <span className="text-gray-400">cancel</span> to exit this form
                </p>
              )}
              {!activeFlow && (
                <BookConsultationButton className="mt-2 h-9 w-full text-xs">
                  Book a free consultation
                </BookConsultationButton>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            onClick={handleFabClick}
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/95 px-4 py-2.5 text-sm text-gray-200 shadow-lg backdrop-blur-md hover:border-cyan-500/30 hover:text-white transition-all"
          >
            <MessageCircle className="h-4 w-4 text-cyan-400" />
            <span>Ask Alryx</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleFabClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_8px_32px_rgba(34,211,238,0.35)] ring-2 ring-white/10"
        aria-label={open ? 'Close Algoryx chat' : 'Open Algoryx chat'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
