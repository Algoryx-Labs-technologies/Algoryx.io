import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  CalendarCheck,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendLandingChatMessage } from '@/lib/api';
import { getCalButtonProps } from '@/lib/cal';
import { ScrollArea } from '../ui/scroll-area';
import { ConsultationCta } from './ConsultationCta';
import {
  type WidgetChatMessage,
  stripBookMarker,
  shouldShowConsultationCta,
} from './chat-utils';
import { MessageTextWithLinks } from './MessageTextWithLinks';

const WELCOME: WidgetChatMessage = {
  role: 'assistant',
  content:
    "Hi — I'm the Algoryx Labs assistant. Ask me about our services, Algoryx Prime, algo trading, AI/ML, DevOps, or how to start a project.",
};

const QUICK_PROMPTS = [
  'What services does Algoryx Labs offer?',
  'Tell me about Algoryx Prime',
  'Do you build trading bots for NSE/BSE?',
  'How do I start a project?',
  'Book a consultation',
] as const;

function MessageBubble({ message }: { message: WidgetChatMessage }) {
  const isUser = message.role === 'user';
  const body = isUser ? message.content : stripBookMarker(message.content);

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

export function AlgoryxChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
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
            {/* Header */}
            <div className="relative flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 shrink-0">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Algoryx Assistant</p>
                  <p className="text-[11px] text-gray-400 truncate">Services · Prime · Trading · AI</p>
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

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0 px-3 py-3">
              <div className="space-y-3 pr-2">
                {messages.map((msg, i) => (
                  <MessageBubble key={`${msg.role}-${i}-${msg.content.slice(0, 24)}`} message={msg} />
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm pl-1">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>Thinking…</span>
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

            {/* Quick prompts — only when conversation is fresh */}
            {messages.length <= 1 && !loading && (
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

            {/* Input */}
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
                  placeholder="Ask about Algoryx Labs…"
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
              <button
                type="button"
                className="mt-2 w-full flex items-center justify-center gap-1.5 text-[11px] text-cyan-400/90 hover:text-cyan-300 transition-colors"
                {...getCalButtonProps()}
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Book a free consultation
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed teaser when closed */}
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

      {/* FAB */}
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
