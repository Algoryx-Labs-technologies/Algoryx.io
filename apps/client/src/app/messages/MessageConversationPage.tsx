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
  Paperclip,
  Loader2,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  status: 'delivered' | 'seen';
  readAt: string | null;
  created_at: string;
  SenderUser: User;
  RecipientUser: User;
}

interface Conversation {
  conversationId: string;
  otherUserId: string;
  otherUser: User;
}

export function MessageConversationPage() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      loadConversation(id);
      loadMessages(id);
    } else if (id === 'new') {
      loadAdmins();
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== 'new') {
      // Poll for new messages every 30 seconds
      const interval = setInterval(() => {
        if (!document.hidden && id) {
          loadMessages(id);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await apiClient.get<Conversation>(`/messages/conversations/${conversationId}`);
      if (response.success && response.data) {
        setConversation(response.data);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiClient.get<Message[]>(`/messages/conversations/${conversationId}/messages`);
      if (response.success && response.data) {
        setMessages(response.data);
        // Mark messages as seen
        await apiClient.patch(`/messages/conversations/${conversationId}/read`, {});
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await apiClient.get<User[]>('/messages/admins');
      if (response.success && response.data) {
        setAdmins(response.data);
        if (response.data.length > 0) {
          setSelectedAdminId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const recipientId = id === 'new' ? selectedAdminId : conversation?.otherUserId;
    if (!recipientId) return;

    setSending(true);
    try {
      const conversationId = id && id !== 'new' ? id : undefined;
      const response = await apiClient.post<Message>('/messages', {
        recipientId,
        content: newMessage,
        conversationId,
      });

      if (response.success && response.data) {
        if (id === 'new' && response.data.conversationId) {
          // New conversation created, navigate to it
          navigate(`/messages/${response.data.conversationId}`, { replace: true });
        } else {
          // Add message to current conversation
          setMessages(prev => [...prev, response.data!]);
          setNewMessage('');
          setTimeout(() => scrollToBottom(), 100);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const isMyMessage = (message: Message) => {
    // For client, check if sender is the current user
    // We'll determine this by checking if sender role is 'client'
    // In a real app, you'd compare with current user ID
    return message.SenderUser.role === 'client';
  };

  const getRecipientName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  if (loading && id !== 'new') {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden flex items-center justify-center",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
          <div className="text-gray-500 font-footer">Loading conversation...</div>
        </div>
      </div>
    );
  }

  // New conversation - show admin selection
  if (id === 'new') {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="h-full flex flex-col relative z-10">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/messages')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-hero text-white">
                    New Message
                  </h1>
                  <p className="text-gray-300 font-footer text-base mt-1">
                    Select an admin to message
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Selection */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
              <div className="max-w-4xl mx-auto">
                {admins.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-footer">No admins available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <button
                        key={admin.id}
                        onClick={() => setSelectedAdminId(admin.id)}
                        className={cn(
                          "w-full p-4 rounded-lg text-left transition-all",
                          selectedAdminId === admin.id
                            ? "bg-blue-600/20 border-2 border-blue-500"
                            : "bg-slate-800/50 border border-white/10 hover:border-blue-500/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold font-footer">
                              {getRecipientName(admin)}
                            </p>
                            <p className="text-gray-400 text-sm font-footer">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            {selectedAdminId && (
              <div className="p-6 border-t border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                  <div className="flex gap-2">
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
                        <Loader2 className="h-4 w-4 animate-spin" />
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
            )}
          </div>
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
          <div className="text-gray-500 font-footer text-lg">Conversation not found</div>
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
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="h-full flex flex-col relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/messages')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-hero text-white">
                  {getRecipientName(conversation.otherUser)}
                </h1>
                <p className="text-gray-300 font-footer text-base mt-1">
                  Technical Analyst • {conversation.otherUser.email}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 bg-slate-900/50"
          >
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
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                          : "bg-gradient-to-br from-slate-800/70 to-slate-800/50 border border-white/10"
                      )}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={cn(
                            "text-base font-footer font-semibold",
                            isMine ? "text-white" : "text-white"
                          )}>
                            {isMine ? 'You' : getRecipientName(message.SenderUser)}
                          </span>
                          <span className="text-sm text-gray-400 font-footer">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-base text-gray-100 font-footer whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        {isMine && (
                          <div className="flex items-center justify-end gap-2 mt-2">
                            {message.status === 'seen' ? (
                              <CheckCheck className="h-4 w-4 text-white" />
                            ) : (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        )}
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
                    <Loader2 className="h-4 w-4 animate-spin" />
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
