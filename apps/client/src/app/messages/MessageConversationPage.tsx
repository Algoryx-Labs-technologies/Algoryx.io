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
import { wsClient } from '../../lib/websocket';
import { Socket } from 'socket.io-client';
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    let mounted = true;

    const initWebSocket = async () => {
      try {
        const ws = await wsClient.connect();
        if (mounted) {
          setSocket(ws);

          // Listen for new messages
          ws.on('message:received', (message: Message) => {
            if (id && id === message.conversationId) {
              setMessages(prev => {
                // Check if message already exists (avoid duplicates)
                if (prev.some(m => m.id === message.id)) return prev;
                return [...prev, message];
              });
              setTimeout(() => scrollToBottom(), 100);
            }
            if (id && id === message.conversationId) {
              loadConversation(id);
            }
          });

          // Listen for sent message confirmation
          ws.on('message:sent', (message: Message) => {
            // If this is a new conversation, navigate to it
            if (id === 'new' && message.conversationId) {
              navigate(`/messages/${message.conversationId}`, { replace: true });
            } else if (id && id === message.conversationId) {
              setMessages(prev => {
                // Remove any temporary optimistic messages and add the real one
                const filtered = prev.filter(m => !m.id.startsWith('temp_'));
                // Check if message already exists (avoid duplicates)
                if (filtered.some(m => m.id === message.id)) return filtered;
                return [...filtered, message];
              });
              setTimeout(() => scrollToBottom(), 100);
            }
            if (id && id === message.conversationId) {
              loadConversation(id);
            }
          });

          // Listen for message seen status
          ws.on('message:seen', (data: { conversationId: string }) => {
            if (id && id === data.conversationId) {
              setMessages(prev => prev.map(msg => 
                msg.conversationId === data.conversationId && msg.recipientId !== msg.senderId
                  ? { ...msg, status: 'seen' as const }
                  : msg
              ));
            }
          });
        }
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        // Fallback: use polling if WebSocket fails
        if (id && id !== 'new') {
          const interval = setInterval(() => {
            if (!document.hidden && id) {
              loadMessages(id);
            }
          }, 30000);
          return () => clearInterval(interval);
        }
      }
    };

    initWebSocket();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (id && id !== 'new') {
      loadConversation(id);
      loadMessages(id);
      
      // Mark as seen via WebSocket if connected
      if (socket?.connected) {
        socket.emit('message:mark_seen', { conversationId: id });
      } else {
        // Fallback to HTTP API
        apiClient.patch(`/messages/conversations/${id}/read`, {}).catch(console.error);
      }
    } else if (id === 'new') {
      loadAdmins();
      setLoading(false);
    } else {
      // No ID provided - load first conversation or show empty state
      loadFirstConversation();
    }
  }, [id, socket]);

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

  const loadFirstConversation = async () => {
    try {
      const response = await apiClient.get<Conversation[]>('/messages/conversations');
      if (response.success && response.data && response.data.length > 0) {
        // Load the first conversation
        const firstConv = response.data[0];
        setConversation({
          conversationId: firstConv.conversationId,
          otherUserId: firstConv.otherUserId,
          otherUser: firstConv.otherUser,
        });
        await loadMessages(firstConv.conversationId);
        // Update URL without navigation
        window.history.replaceState(null, '', `/messages/${firstConv.conversationId}`);
      } else {
        // No conversations, show empty state
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading first conversation:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const recipientId = id === 'new' ? selectedAdminId : conversation?.otherUserId;
    if (!recipientId) return;

    const messageContent = newMessage.trim();
    const conversationId = id && id !== 'new' ? id : undefined;

    setSending(true);
    
    // Create optimistic message (temporary ID, will be replaced by server response)
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversationId: conversationId || 'temp',
      senderId: 'current-user', // Will be replaced by actual sender ID from server
      recipientId,
      content: messageContent,
      status: 'delivered',
      readAt: null,
      created_at: new Date().toISOString(),
      SenderUser: {
        id: 'current-user',
        email: '',
        firstName: null,
        lastName: null,
        role: 'client',
      },
      RecipientUser: {
        id: recipientId,
        email: '',
        firstName: null,
        lastName: null,
        role: 'admin',
      },
    };

    // Optimistically add message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setTimeout(() => scrollToBottom(), 100);

    try {
      // Try WebSocket first, fallback to HTTP
      if (socket?.connected) {
        socket.emit('message:send', {
          recipientId,
          content: messageContent,
          conversationId,
        });
        
        // WebSocket will handle the response via 'message:sent' event
        // The optimistic message will be replaced by the real one
        setSending(false);
        
        // If new conversation, wait for response to get conversationId
        if (id === 'new') {
          // Will be handled by message:sent event
        }
      } else {
        // Fallback to HTTP API
        const response = await apiClient.post<Message>('/messages', {
          recipientId,
          content: messageContent,
          conversationId,
        });

        if (response.success && response.data) {
          // Replace optimistic message with real one
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== tempId);
            return [...filtered, response.data!];
          });
          
          if (id === 'new' && response.data.conversationId) {
            // New conversation created, navigate to it
            navigate(`/messages/${response.data.conversationId}`, { replace: true });
          } else {
            setTimeout(() => scrollToBottom(), 100);
          }
        } else {
          // If API call failed, remove optimistic message
          setMessages(prev => prev.filter(m => m.id !== tempId));
          setNewMessage(messageContent); // Restore message content
        }
        setSending(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(messageContent); // Restore message content
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

  if (!conversation && !loading) {
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
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-hero text-white">
                    Admin
                  </h1>
                  <p className="text-gray-300 font-footer text-base mt-1">
                    Technical Analyst • admin@algoryx.io
                  </p>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold font-hero text-white mb-2">No Messages Yet</h3>
                <p className="text-gray-400 font-footer mb-6">Start a conversation with an admin</p>
                <button
                  onClick={() => navigate('/messages/new')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-footer"
                >
                  Send First Message
                </button>
              </div>
            </div>
          </div>
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
              {id && id !== 'new' && (
                <button
                  onClick={() => navigate('/messages')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
              )}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-hero text-white">
                  Admin
                </h1>
                <p className="text-gray-300 font-footer text-base mt-1">
                  Technical Analyst • admin@algoryx.io
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
                            {isMine ? 'You' : 'Admin'}
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
