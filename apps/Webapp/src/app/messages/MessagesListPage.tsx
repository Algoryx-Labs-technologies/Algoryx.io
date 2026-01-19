import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MessageSquare, Plus, User, Clock, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientRole: 'admin' | 'partner';
  recipientEmail?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  subject?: string;
  created_at: string;
  updated_at: string;
}

export function MessagesListPage() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // TODO: Replace with actual API endpoint when backend is ready
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
        
        // Uncomment when API is ready:
        // const token = localStorage.getItem('auth_token'); // Get from your auth system
        // const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setConversations(data.data || []);
        // } else {
        //   console.error('Error fetching conversations:', data.message);
        // }
        
        // Mock data for now
        setConversations([
          {
            id: '1',
            recipientId: 'admin1',
            recipientName: 'John Smith',
            recipientRole: 'admin',
            recipientEmail: 'john.smith@algoryx.com',
            lastMessage: 'I\'ve reviewed your project requirements. Let\'s schedule a call to discuss the technical approach.',
            lastMessageTime: '2024-11-20T10:30:00Z',
            unreadCount: 2,
            subject: 'Project Technical Review',
            created_at: '2024-11-15T09:00:00Z',
            updated_at: '2024-11-20T10:30:00Z',
          },
          {
            id: '2',
            recipientId: 'partner1',
            recipientName: 'Sarah Johnson',
            recipientRole: 'partner',
            recipientEmail: 'sarah.j@techpartners.com',
            lastMessage: 'The API integration is complete. You can test it now.',
            lastMessageTime: '2024-11-19T14:20:00Z',
            unreadCount: 0,
            subject: 'API Integration Update',
            created_at: '2024-11-10T08:00:00Z',
            updated_at: '2024-11-19T14:20:00Z',
          },
          {
            id: '3',
            recipientId: 'admin2',
            recipientName: 'Michael Chen',
            recipientRole: 'admin',
            recipientEmail: 'michael.chen@algoryx.com',
            lastMessage: 'Thanks for the clarification. I\'ll update the documentation accordingly.',
            lastMessageTime: '2024-11-18T16:45:00Z',
            unreadCount: 0,
            subject: 'Documentation Update',
            created_at: '2024-11-12T11:00:00Z',
            updated_at: '2024-11-18T16:45:00Z',
          },
          {
            id: '4',
            recipientId: 'partner2',
            recipientName: 'David Wilson',
            recipientRole: 'partner',
            recipientEmail: 'david.w@devteam.com',
            lastMessage: 'When can we schedule the next review meeting?',
            lastMessageTime: '2024-11-17T09:15:00Z',
            unreadCount: 1,
            subject: 'Meeting Schedule',
            created_at: '2024-11-05T10:00:00Z',
            updated_at: '2024-11-17T09:15:00Z',
          },
        ]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                  Messages
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-footer">
                  Communicate with technical analysts and advisors
                </p>
              </div>
              <button
                onClick={() => navigate('/messages/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-footer"
              >
                <Plus className="h-4 w-4" />
                <span>New Message</span>
              </button>
            </div>

            {/* Conversations List */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 font-footer">Loading conversations...</div>
              </div>
            ) : conversations.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold font-hero text-white mb-2">No Messages Yet</h3>
                  <p className="text-gray-400 font-footer mb-6">Start a conversation with a technical analyst or advisor</p>
                  <button
                    onClick={() => navigate('/messages/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-footer"
                  >
                    Send First Message
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    className={cn(
                      "group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden cursor-pointer",
                      conversation.unreadCount > 0
                        ? "border-blue-500/30"
                        : "border-white/10"
                    )}
                    onClick={() => navigate(`/messages/${conversation.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold font-hero text-white">
                                  {conversation.recipientName}
                                </h3>
                                <span className={cn(
                                  "text-xs font-footer px-2 py-0.5 rounded border",
                                  getRoleBadgeColor(conversation.recipientRole)
                                )}>
                                  {conversation.recipientRole === 'admin' ? 'Technical Analyst' : 'Advisor'}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                )}
                              </div>
                              {conversation.subject && (
                                <p className="text-sm text-gray-400 font-footer mb-1">
                                  {conversation.subject}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-footer flex-shrink-0 ml-4">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(conversation.lastMessageTime)}</span>
                            </div>
                          </div>

                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-300 font-footer line-clamp-2 mb-2">
                              {conversation.lastMessage}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-footer">
                              <span>{conversation.recipientEmail}</span>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs font-footer px-2 py-1 rounded-full">
                                {conversation.unreadCount} unread
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

