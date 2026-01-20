import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TicketQuestionnaire } from './chat/TicketQuestionnaire';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  showFeedback?: boolean;
  feedbackGiven?: boolean;
}

interface TicketForm {
  issueType: string;
  description: string;
  priority: string;
  additionalDetails?: string;
}

type ChatMode = 'chat' | 'questionnaire' | 'ticket-created';

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to **Algoryx Labs** support channel! 👋\n\nHello! How can I help you today? I can assist with account issues, payments, projects, technical problems, or general questions.',
      sender: 'support',
      timestamp: new Date(),
      showFeedback: false, // Don't show feedback on initial greeting
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<ChatMode>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [userMessageCount, setUserMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Show feedback after 2-3 questions (randomly between 2 and 3, set once)
  const [feedbackThreshold] = useState(() => Math.floor(Math.random() * 2) + 2); // 2 or 3

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when chat opens (only in chat mode)
      if (mode === 'chat') {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    } else {
      // Reset message count when chat is closed
      setUserMessageCount(0);
      setFeedbackGiven(new Set());
    }
  }, [isOpen, messages, mode]);

  // Reset message count when returning to chat mode after ticket creation
  useEffect(() => {
    if (mode === 'chat' && ticketId) {
      setUserMessageCount(0);
      setFeedbackGiven(new Set());
    }
  }, [mode, ticketId]);

  // Keyword-based auto-response system
  const getAutoResponse = (userMessage: string): { response: string; isHelpful: boolean } => {
    const message = userMessage.toLowerCase();
    
    // Payment related
    if (message.includes('payment') || message.includes('pay') || message.includes('invoice') || message.includes('billing') || message.includes('bill')) {
      return {
        response: 'For payment inquiries, please check the **Payments** section in your dashboard. You can view your payment history, invoices, and transaction details there. If you have a specific payment issue, please provide the transaction ID or invoice number.',
        isHelpful: true
      };
    }
    
    // Project related
    if (message.includes('project') || message.includes('status') || message.includes('deadline') || message.includes('progress')) {
      return {
        response: 'You can view all your projects and their status in the **Projects** section. Each project shows its progress, deadlines, and current status. For specific project questions, please mention the project name.',
        isHelpful: true
      };
    }
    
    // Account related
    if (message.includes('account') || message.includes('profile') || message.includes('settings') || message.includes('password') || message.includes('change')) {
      return {
        response: 'Account settings can be updated in your **Profile** section. For security-related changes like password updates, please use the Security tab. If you need to update your personal information, go to Profile > Edit.',
        isHelpful: true
      };
    }
    
    // Technical/Bug related
    if (message.includes('bug') || message.includes('error') || message.includes('broken') || message.includes('not working') || message.includes('issue') || message.includes('problem')) {
      return {
        response: 'I understand you\'re experiencing a technical issue. Could you please provide more details:\n\n1. What page or feature are you using?\n2. What were you trying to do when the issue occurred?\n3. Any error messages you see?\n\nThis will help us assist you better.',
        isHelpful: true
      };
    }
    
    // Feature request
    if (message.includes('feature') || message.includes('add') || message.includes('suggest') || message.includes('request')) {
      return {
        response: 'Thank you for your suggestion! We appreciate your feedback. Feature requests are reviewed by our team regularly. If you\'d like to provide more details about the feature you\'d like to see, please let us know.',
        isHelpful: true
      };
    }
    
    // Help/General
    if (message.includes('help') || message.includes('how') || message.includes('what') || message.includes('where') || message.length < 10) {
      return {
        response: 'I can help you with:\n\n• **Account** - Profile, settings, password\n• **Payments** - Invoices, billing, transactions\n• **Projects** - Status, deadlines, progress\n• **Technical Issues** - Bugs, errors, problems\n• **General Questions** - Platform usage, features\n\nWhat would you like help with?',
        isHelpful: true
      };
    }
    
    // Default - not helpful, will show ticket option
    return {
      response: 'I understand your concern. Let me help you get in touch with our support team who can assist you better with this matter.',
      isHelpful: false
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || mode !== 'chat') return;

    const userInput = inputValue.trim();
    setLastUserMessage(userInput);

    // Increment user message count
    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    // Add user message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Get auto-response based on keywords
    const autoResponse = getAutoResponse(userInput);
    
    // Simulate typing delay
    const delay = Math.min(userInput.length * 15, 1500);
    
    setTimeout(() => {
      setIsTyping(false);
      const messageId = (Date.now() + 1).toString();
      
      // Show feedback only after 2-3 questions
      const shouldShowFeedback = newCount >= feedbackThreshold;
      
      const supportResponse: ChatMessage = {
        id: messageId,
        text: autoResponse.response,
        sender: 'support',
        timestamp: new Date(),
        showFeedback: shouldShowFeedback, // Show feedback only after threshold
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, delay);
  };

  const handleFeedback = (messageId: string, isHelpful: boolean) => {
    // Mark feedback as given for this message
    setFeedbackGiven((prev) => new Set(prev).add(messageId));
    
    // Update the message to hide feedback buttons
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedbackGiven: true, showFeedback: false }
          : msg
      )
    );

    if (!isHelpful) {
      // If not helpful, show questionnaire
      setMode('questionnaire');
    } else {
      // If helpful, show thank you message
      const thankYouMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Great! I\'m glad I could help. Is there anything else you need assistance with?',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, thankYouMessage]);
    }
  };

  const handleQuestionnaireSubmit = (formData: TicketForm) => {
    // Generate ticket ID
    const newTicketId = `TKT-${Date.now().toString().slice(-8)}`;
    setTicketId(newTicketId);
    
    // Simulate API call (replace with actual API later)
    // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
    // await fetch(`${API_BASE_URL}/support/tickets`, { ... });
    
    // Add confirmation message
    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `✅ **Support ticket created successfully!**\n\n**Ticket Number:** ${newTicketId}\n**Issue Type:** ${formData.issueType}\n**Priority:** ${formData.priority}\n\nOur team will review your ticket and get back to you soon. You'll receive notifications here when we respond.`,
      sender: 'support',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, confirmationMessage]);
    setMode('ticket-created');
  };

  const handleQuestionnaireCancel = () => {
    setMode('chat');
    // Add a message encouraging them to try again
    const encouragementMessage: ChatMessage = {
      id: Date.now().toString(),
      text: 'No problem! Feel free to ask me anything else. I\'m here to help!',
      sender: 'support',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, encouragementMessage]);
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
        <div className="fixed bottom-6 right-6 z-50 w-[450px] h-[650px] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {mode === 'questionnaire' ? (
              <TicketQuestionnaire
                onSubmit={handleQuestionnaireSubmit}
                onCancel={handleQuestionnaireCancel}
                originalMessage={lastUserMessage}
              />
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
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
                          {message.text.split('**').map((part, i) => 
                            i % 2 === 1 ? (
                              <strong key={i} className="font-semibold">{part}</strong>
                            ) : (
                              part
                            )
                          )}
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
                    
                    {/* Feedback Buttons */}
                    {message.showFeedback && !message.feedbackGiven && mode === 'chat' && (
                      <div className="flex justify-start pl-11 space-x-2">
                        <span className="text-xs text-gray-400 font-footer self-center mr-2">Was this helpful?</span>
                        <button
                          onClick={() => handleFeedback(message.id, true)}
                          className="px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 hover:text-green-300 transition-all text-xs font-footer flex items-center gap-1"
                        >
                          <span>✓ Yes</span>
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, false)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all text-xs font-footer flex items-center gap-1"
                        >
                          <span>✗ No</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/70 to-slate-800/50 border border-white/10 rounded-2xl p-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input - Only show in chat mode */}
          {mode === 'chat' && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
          
          {/* Ticket Created Info */}
          {mode === 'ticket-created' && ticketId && (
            <div className="p-4 border-t border-white/10 bg-gradient-to-br from-green-600/10 to-emerald-500/10">
              <p className="text-xs text-gray-400 font-footer text-center">
                Ticket <span className="text-green-400 font-semibold">{ticketId}</span> is being reviewed. You can continue chatting or close this window.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

