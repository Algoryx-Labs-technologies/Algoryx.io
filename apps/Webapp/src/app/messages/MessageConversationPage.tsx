import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft, 
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!id || id === 'new') {
        setLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual API endpoint when backend is ready
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
        
        // Uncomment when API is ready:
        // const token = localStorage.getItem('auth_token');
        // const [convResponse, messagesResponse] = await Promise.all([
        //   fetch(`${API_BASE_URL}/messages/conversations/${id}`, {
        //     headers: {
        //       'Authorization': `Bearer ${token}`,
        //       'Content-Type': 'application/json',
        //     },
        //   }),
        //   fetch(`${API_BASE_URL}/messages/conversations/${id}/messages`, {
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
        
        // Mock data for now
        if (id === 'new') {
          setConversation(null);
          setMessages([]);
        } else {
          setConversation({
            id: id,
            recipientId: 'admin1',
            recipientName: 'John Smith',
            recipientRole: 'admin',
            recipientEmail: 'john.smith@algoryx.com',
            subject: 'Project Technical Review',
            created_at: '2024-11-15T09:00:00Z',
            updated_at: '2024-11-20T10:30:00Z',
          });

          setMessages([
            {
              id: '1',
              conversationId: id,
              senderId: 'client1',
              senderName: 'You',
              senderRole: 'client',
              recipientId: 'admin1',
              recipientName: 'John Smith',
              recipientRole: 'admin',
              content: 'Hi John, I have some questions about the technical approach for my e-commerce project. Can we discuss the architecture?',
              subject: 'Project Technical Review',
              isRead: true,
              created_at: '2024-11-15T09:00:00Z',
            },
            {
              id: '2',
              conversationId: id,
              senderId: 'admin1',
              senderName: 'John Smith',
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
              conversationId: id,
              senderId: 'client1',
              senderName: 'You',
              senderRole: 'client',
              recipientId: 'admin1',
              recipientName: 'John Smith',
              recipientRole: 'admin',
              content: 'That sounds great! I\'ve attached the requirements document. Please let me know when you\'ve reviewed it.',
              isRead: true,
              created_at: '2024-11-16T10:15:00Z',
            },
            {
              id: '4',
              conversationId: id,
              senderId: 'admin1',
              senderName: 'John Smith',
              senderRole: 'admin',
              recipientId: 'client1',
              recipientName: 'You',
              recipientRole: 'client',
              content: 'I\'ve reviewed your project requirements. The architecture looks solid. Let\'s schedule a call to discuss the technical approach and answer any questions you have.',
              isRead: false,
              created_at: '2024-11-20T10:30:00Z',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // TODO: Replace with actual API call
      // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
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
        conversationId: id || 'new',
        senderId: 'client1',
        senderName: 'You',
        senderRole: 'client',
        recipientId: conversation?.recipientId || 'admin1',
        recipientName: conversation?.recipientName || 'Technical Analyst',
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

  if (id === 'new') {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <button
                onClick={() => navigate('/messages')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 font-footer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Messages</span>
              </button>
              <h1 className="text-2xl font-bold font-hero text-gray-900 dark:text-white">
                New Message
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-footer mt-1">
                Send a message to a technical analyst or advisor
              </p>
            </div>
            <div className="flex-1 p-6">
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold font-hero text-white mb-2">Start a New Conversation</h3>
                      <p className="text-gray-400 font-footer mb-6">
                        Select a recipient and compose your message below
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleSendMessage} className="mt-auto">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Select recipient..."
                        className="flex-1 bg-slate-800/50 border-white/10 text-white"
                        disabled
                      />
                      <Input
                        type="text"
                        placeholder="Enter your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-slate-800/50 border-white/10 text-white"
                      />
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
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
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="p-8">
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold font-hero text-white mb-2">Conversation Not Found</h3>
                <p className="text-gray-400 font-footer mb-6">The conversation you're looking for doesn't exist.</p>
                <button
                  onClick={() => navigate('/messages')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-footer"
                >
                  Back to Messages
                </button>
              </CardContent>
            </Card>
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
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/50">
            <button
              onClick={() => navigate('/messages')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 font-footer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Messages</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold font-hero text-white">
                  {conversation.recipientName}
                </h1>
                <p className="text-gray-400 font-footer text-sm">
                  {conversation.recipientRole === 'admin' ? 'Technical Analyst' : 'Advisor'} • {conversation.recipientEmail}
                </p>
                {conversation.subject && (
                  <p className="text-gray-500 font-footer text-xs mt-1">
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
                        "max-w-[70%] rounded-2xl p-4",
                        isMine
                          ? "bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30"
                          : "bg-gradient-to-br from-slate-800/70 to-slate-800/50 border border-white/10"
                      )}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn(
                            "text-sm font-footer font-semibold",
                            isMine ? "text-blue-400" : "text-white"
                          )}>
                            {message.senderName}
                          </span>
                          <span className="text-xs text-gray-500 font-footer">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 font-footer whitespace-pre-wrap">
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

