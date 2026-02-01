import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { apiClient } from '../../lib/api';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Check, 
  CheckCheck,
  User,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  phoneNumber?: string | null;
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
  lastMessage: {
    id: string;
    content: string;
    status: 'delivered' | 'seen';
    created_at: string;
  };
  unreadCount: number;
}

export function MessagesPage() {
  const { isCollapsed } = useSidebar();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [pendingRecipientId, setPendingRecipientId] = useState<string | null>(null); // For new conversations
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load conversations and clients
  useEffect(() => {
    loadData();
  }, []);

  // Poll for new messages only when tab is visible and less frequently
  useEffect(() => {
    // Only poll if tab is visible
    const handleVisibilityChange = () => {
      if (document.hidden) return;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Poll every 30 seconds instead of 5 seconds
    const interval = setInterval(() => {
      // Only poll if tab is visible
      if (document.hidden) return;

      if (selectedConversation) {
        loadMessages(selectedConversation);
      }
      loadConversations();
      loadUnreadCount();
    }, 30000); // 30 seconds instead of 5

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedConversation]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConversations(),
        loadClients(),
        loadUnreadCount(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await apiClient.get<Conversation[]>('/messages/conversations');
      if (response.success && response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await apiClient.get<User[]>('/messages/clients');
      if (response.success && response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiClient.get<Message[]>(`/messages/conversations/${conversationId}/messages`);
      if (response.success && response.data) {
        setMessages(response.data);
        // Scroll to bottom after messages load
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiClient.get<{ unreadCount: number }>('/messages/unread-count');
      if (response.success && response.data) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    loadMessages(conversationId);
  };

  const handleStartNewConversation = async (clientId: string) => {
    // Find existing conversation
    const existingConv = conversations.find(
      conv => conv.otherUserId === clientId
    );
    
    if (existingConv) {
      // Open existing conversation
      handleSelectConversation(existingConv.conversationId);
      setPendingRecipientId(null);
    } else {
      // For new conversation, open chat interface without sending any message
      // Store the recipient ID to use when user sends their first message
      setPendingRecipientId(clientId);
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  const sendMessage = async (recipientId?: string, content?: string) => {
    // Get recipient: from parameter, pending recipient (new conversation), or from selected conversation
    const recipient = recipientId || pendingRecipientId || conversations.find(c => c.conversationId === selectedConversation)?.otherUserId;
    const messageText = content || messageContent;

    if (!recipient || !messageText.trim()) return;

    setSending(true);
    try {
      // Only use conversationId if it's a real conversation (not temp)
      const conversationId = selectedConversation && !selectedConversation.startsWith('temp_') ? selectedConversation : undefined;
      const response = await apiClient.post<Message>('/messages', {
        recipientId: recipient,
        content: messageText,
        conversationId,
      });

      if (response.success && response.data) {
        if (!selectedConversation || selectedConversation.startsWith('temp_')) {
          // New conversation created
          setSelectedConversation(response.data.conversationId);
          setPendingRecipientId(null); // Clear pending recipient
          await loadConversations();
          await loadMessages(response.data.conversationId);
        } else {
          // Add message to current conversation
          setMessages(prev => [...prev, response.data!]);
          await loadConversations();
        }
        setMessageContent('');
        setTimeout(() => scrollToBottom(), 100);
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

  const selectedConversationData = conversations.find(
    c => c.conversationId === selectedConversation
  );

  // Get client info for new conversations (when pendingRecipientId is set)
  const pendingClientData = pendingRecipientId 
    ? clients.find(c => c.id === pendingRecipientId)
    : null;

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = clients.filter(client =>
    !conversations.some(conv => conv.otherUserId === client.id)
  ).filter(client =>
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allClientsFiltered = clients.filter(client =>
    client.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.firstName?.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.lastName?.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-auto",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-hero bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-cyan-300">
                  Messages
                </h2>
                <Button
                  onClick={() => setShowClientModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 h-8 px-3"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              {unreadCount > 0 && (
                <div className="mb-3">
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-footer">
                    {unreadCount} unread
                  </span>
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : (
                <>
                  {filteredConversations.length > 0 && (
                    <div className="p-2">
                      <p className="text-xs text-gray-400 font-footer px-2 mb-2">Conversations</p>
                      {filteredConversations.map((conv) => (
                        <button
                          key={conv.conversationId}
                          onClick={() => handleSelectConversation(conv.conversationId)}
                          className={cn(
                            "w-full p-3 rounded-lg mb-2 text-left transition-all duration-200",
                            selectedConversation === conv.conversationId
                              ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30"
                              : "bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold font-footer truncate">
                                  {conv.otherUser.firstName && conv.otherUser.lastName
                                    ? `${conv.otherUser.firstName} ${conv.otherUser.lastName}`
                                    : conv.otherUser.email}
                                </p>
                                <p className="text-gray-400 text-xs font-footer truncate">
                                  {conv.lastMessage.content}
                                </p>
                                <p className="text-gray-500 text-xs font-footer mt-1">
                                  {format(new Date(conv.lastMessage.created_at), 'MMM d, h:mm a')}
                                </p>
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-footer shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredClients.length > 0 && (
                    <div className="p-2 border-t border-white/10">
                      <p className="text-xs text-gray-400 font-footer px-2 mb-2 mt-2">Start New Conversation</p>
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleStartNewConversation(client.id)}
                          className="w-full p-3 rounded-lg mb-2 text-left bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold font-footer truncate">
                                {client.firstName && client.lastName
                                  ? `${client.firstName} ${client.lastName}`
                                  : client.email}
                              </p>
                              <p className="text-gray-400 text-xs font-footer truncate">
                                {client.email}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredConversations.length === 0 && filteredClients.length === 0 && (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 font-footer">
                        {searchQuery ? 'No results found' : 'No conversations yet'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {(selectedConversationData || pendingClientData) ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold font-footer">
                        {selectedConversationData
                          ? (selectedConversationData.otherUser.firstName && selectedConversationData.otherUser.lastName
                              ? `${selectedConversationData.otherUser.firstName} ${selectedConversationData.otherUser.lastName}`
                              : selectedConversationData.otherUser.email)
                          : (pendingClientData
                              ? (pendingClientData.firstName && pendingClientData.lastName
                                  ? `${pendingClientData.firstName} ${pendingClientData.lastName}`
                                  : pendingClientData.email)
                              : 'Unknown')}
                      </p>
                      <p className="text-gray-400 text-xs font-footer">
                        {selectedConversationData?.otherUser.email || pendingClientData?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message) => {
                    const isSent = selectedConversationData 
                      ? message.senderId !== selectedConversationData.otherUserId
                      : true; // For new conversations, assume sent
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          isSent ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3",
                            isSent
                              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                              : "bg-slate-800/50 text-white border border-white/10"
                          )}
                        >
                          <p className="font-footer text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <span className="text-xs opacity-70 font-footer">
                              {format(new Date(message.created_at), 'h:mm a')}
                            </span>
                            {isSent && (
                              <div>
                                {message.status === 'seen' ? (
                                  <CheckCheck className="h-4 w-4 text-white" />
                                ) : (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1 bg-slate-800/50 border-white/10 text-white"
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!messageContent.trim() || sending}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 font-footer text-lg">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Client Selection Modal */}
        {showClientModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowClientModal(false);
              setClientSearchQuery('');
            }}
          >
            <Card 
              className="w-full max-w-2xl max-h-[80vh] bg-slate-900/95 backdrop-blur-sm border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-xl font-hero text-white">
                  Select Client to Message
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowClientModal(false);
                    setClientSearchQuery('');
                  }}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearchQuery}
                    onChange={(e) => setClientSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-white/10 text-white"
                  />
                </div>

                {/* Clients List */}
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                  {allClientsFiltered.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 font-footer">
                        {clientSearchQuery ? 'No clients found' : 'No clients available'}
                      </p>
                    </div>
                  ) : (
                    allClientsFiltered.map((client) => {
                      const hasConversation = conversations.some(
                        conv => conv.otherUserId === client.id
                      );
                      const existingConv = conversations.find(
                        conv => conv.otherUserId === client.id
                      );

                      return (
                        <button
                          key={client.id}
                          onClick={() => {
                            if (hasConversation && existingConv) {
                              handleSelectConversation(existingConv.conversationId);
                            } else {
                              handleStartNewConversation(client.id);
                            }
                            setShowClientModal(false);
                            setClientSearchQuery('');
                          }}
                          className="w-full p-4 rounded-lg text-left bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-semibold font-footer truncate">
                                  {client.firstName && client.lastName
                                    ? `${client.firstName} ${client.lastName}`
                                    : client.email}
                                </p>
                                {hasConversation && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-footer shrink-0">
                                    Has conversation
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm font-footer truncate">
                                {client.email}
                              </p>
                              {client.phoneNumber && (
                                <p className="text-gray-500 text-xs font-footer mt-1">
                                  {client.phoneNumber}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0">
                              <MessageSquare className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

