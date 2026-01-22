import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Send, 
  User, 
  Clock,
  MessageSquare,
  Paperclip
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin' | 'partner';
  recipientId: string;
  recipientName: string;
  recipientRole: 'client' | 'admin' | 'partner';
  content: string;
  subject?: string;
  isRead: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientRole: 'admin' | 'partner';
  recipientEmail?: string;
  subject?: string;
  created_at: string;
  updated_at: string;
}

export function MessageConversationPage() {
  const { isCollapsed } = useSidebar();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        // TODO: Replace with actual API endpoint when backend is ready
        // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
        
        // Uncomment when API is ready:
        // const token = localStorage.getItem('auth_token');
        // Fetch the single conversation for the user (1-to-1 chat)
        // const [convResponse, messagesResponse] = await Promise.all([
        //   fetch(`${API_BASE_URL}/messages/conversation`, {
        //     headers: {
        //       'Authorization': `Bearer ${token}`,
        //       'Content-Type': 'application/json',
        //     },
        //   }),
        //   fetch(`${API_BASE_URL}/messages/conversation/messages`, {
        //     headers: {
        //       'Authorization': `Bearer ${token}`,
        //       'Content-Type': 'application/json',
        //     },
        //   }),
        // ]);
        // const convData = await convResponse.json();
        // const messagesData = await messagesResponse.json();
        // if (convData.success) setConversation(convData.data);
        // if (messagesData.success) setMessages(messagesData.data || []);
        
        // Mock data for now - single 1-to-1 conversation
        setConversation({
          id: '1',
          recipientId: 'admin1',
          recipientName: 'Technical Support Team',
          recipientRole: 'admin',
          recipientEmail: 'support@algoryx.com',
          subject: 'Project Support',
          created_at: '2024-11-15T09:00:00Z',
          updated_at: '2024-11-20T10:30:00Z',
        });

          setMessages([
            {
              id: '1',
              conversationId: '1',
              senderId: 'client1',
              senderName: 'You',
              senderRole: 'client',
              recipientId: 'admin1',
              recipientName: 'Technical Support Team',
              recipientRole: 'admin',
              content: 'Hi, I have some questions about the technical approach for my e-commerce project. Can we discuss the architecture?',
              subject: 'Project Technical Review',
              isRead: true,
              created_at: '2024-11-15T09:00:00Z',
            },
            {
              id: '2',
              conversationId: '1',
              senderId: 'admin1',
              senderName: 'Technical Support Team',
              senderRole: 'admin',
              recipientId: 'client1',
              recipientName: 'You',
              recipientRole: 'client',
              content: 'Hello! I\'d be happy to help. Let me review your project requirements first, and then we can schedule a call to discuss the technical approach in detail.',
              isRead: true,
              created_at: '2024-11-15T14:30:00Z',
            },
            {
              id: '3',
              conversationId: '1',
              senderId: 'client1',
              senderName: 'You',
              senderRole: 'client',
              recipientId: 'admin1',
              recipientName: 'Technical Support Team',
              recipientRole: 'admin',
              content: 'That sounds great! I\'ve attached the requirements document. Please let me know when you\'ve reviewed it.',
              isRead: true,
              created_at: '2024-11-16T10:15:00Z',
            },
            {
              id: '4',
              conversationId: '1',
              senderId: 'admin1',
              senderName: 'Technical Support Team',
              senderRole: 'admin',
              recipientId: 'client1',
              recipientName: 'You',
              recipientRole: 'client',
              content: 'I\'ve reviewed your project requirements. The architecture looks solid. Let\'s schedule a call to discuss the technical approach and answer any questions you have.',
              isRead: false,
              created_at: '2024-11-20T10:30:00Z',
            },
          ]);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // TODO: Replace with actual API call
      // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
      // const token = localStorage.getItem('auth_token');
      // const response = await fetch(`${API_BASE_URL}/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     conversationId: id === 'new' ? null : id,
      //     recipientId: conversation?.recipientId,
      //     content: newMessage,
      //     subject: conversation?.subject,
      //   }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setMessages([...messages, data.data]);
      //   setNewMessage('');
      // }

      // Mock: Add message to list
      const tempMessage: Message = {
        id: Date.now().toString(),
        conversationId: conversation?.id || '1',
        senderId: 'client1',
        senderName: 'You',
        senderRole: 'client',
        recipientId: conversation?.recipientId || 'admin1',
        recipientName: conversation?.recipientName || 'Technical Support Team',
        recipientRole: conversation?.recipientRole || 'admin',
        content: newMessage,
        subject: conversation?.subject,
        isRead: true,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, tempMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isMyMessage = (message: Message) => {
    return message.senderRole === 'client';
  };

  if (loading) {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden flex items-center justify-center",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="text-gray-500 font-footer">Loading conversation...</div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden flex items-center justify-center",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="text-gray-500 font-footer text-lg">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        {/* Background gradient effects - matching dashboard theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="h-full flex flex-col relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-hero text-white">
                  {conversation.recipientName}
                </h1>
                <p className="text-gray-300 font-footer text-base mt-1">
                  {conversation.recipientRole === 'admin' ? 'Technical Analyst' : 'Advisor'} • {conversation.recipientEmail}
                </p>
                {conversation.subject && (
                  <p className="text-gray-400 font-footer text-sm mt-2">
                    Subject: {conversation.subject}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 font-footer">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = isMyMessage(message);
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-4",
                        isMine ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isMine && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[70%] rounded-2xl p-5",
                        isMine
                          ? "bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30"
                          : "bg-gradient-to-br from-slate-800/70 to-slate-800/50 border border-white/10"
                      )}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={cn(
                            "text-base font-footer font-semibold",
                            isMine ? "text-blue-400" : "text-white"
                          )}>
                            {message.senderName}
                          </span>
                          <span className="text-sm text-gray-400 font-footer">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-base text-gray-100 font-footer whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      {isMine && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-800/50 border-white/10 text-gray-400 hover:text-white"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {sending ? (
                    <span className="font-footer">Sending...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <span className="font-footer">Send</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

