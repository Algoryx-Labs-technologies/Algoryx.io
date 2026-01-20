import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate support response
    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team will get back to you shortly. Is there anything specific you need help with?',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110',
          isOpen && 'hidden'
        )}
        aria-label="Open support chat"
      >
        <MessageCircle className="h-6 w-6" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
        )}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white font-hero">Support Chat</h3>
                <p className="text-xs text-gray-400 font-footer">We're here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'support' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl p-3',
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30'
                      : 'bg-gradient-to-br from-slate-800/70 to-slate-800/50 border border-white/10'
                  )}
                >
                  <p className="text-sm text-gray-100 font-footer whitespace-pre-wrap leading-relaxed">
                    {message.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-footer">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">U</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
              />
              <Button
                type="submit"
                className="bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

