import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { MessageSquare, Plus, User, Clock, Loader2, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
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

interface Project {
  id: string;
  projectName?: string;
}

export function MessagesListPage() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasProjects, setHasProjects] = useState<boolean | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    checkProjects();
  }, []);

  useEffect(() => {
    if (hasProjects === true) {
      loadData();
      // Poll for new conversations every 30 seconds
      const interval = setInterval(() => {
        if (!document.hidden) {
          loadConversations();
          loadUnreadCount();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [hasProjects]);

  const checkProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await apiClient.get<Project[]>('/projects');
      if (response.success && response.data) {
        setHasProjects(response.data.length > 0);
      } else {
        setHasProjects(false);
      }
    } catch (error) {
      console.error('Error checking projects:', error);
      setHasProjects(false);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConversations(),
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

  const formatTime = (dateString: string) => {
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
    return format(date, 'MMM d, yyyy');
  };

  const getRecipientName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
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
            {/* Lock Screen - No Projects */}
            {loadingProjects ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
                <div className="text-gray-500 font-footer">Loading...</div>
              </div>
            ) : hasProjects === false ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 max-w-2xl w-full">
                  <CardContent className="p-16 text-center">
                    <div className="mb-8">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-4 border-gray-600/50 mb-6">
                        <Lock className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold font-hero text-white mb-4">
                      Messages Locked
                    </h2>
                    <p className="text-xl text-gray-300 font-footer mb-8 leading-relaxed">
                      Get a project started to unlock messaging with technical analysts and advisors
                    </p>
                    <button
                      onClick={() => navigate('/projects')}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all font-footer font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                      Go to Projects
                    </button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                      Messages
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-footer">
                      Communicate with technical analysts and advisors
                    </p>
                    {unreadCount > 0 && (
                      <p className="text-blue-600 dark:text-blue-400 font-footer text-sm mt-2">
                        {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                      </p>
                    )}
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
                    <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
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
                        key={conversation.conversationId}
                        className={cn(
                          "group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden cursor-pointer",
                          conversation.unreadCount > 0
                            ? "border-blue-500/30"
                            : "border-white/10"
                        )}
                        onClick={() => navigate(`/messages/${conversation.conversationId}`)}
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
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold font-hero text-white">
                                      {getRecipientName(conversation.otherUser)}
                                    </h3>
                                    <span className="text-sm font-footer px-3 py-1 rounded border bg-blue-500/20 text-blue-400 border-blue-500/30">
                                      {conversation.otherUser.role === 'admin' ? 'Technical Analyst' : 'Advisor'}
                                    </span>
                                    {conversation.unreadCount > 0 && (
                                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-footer flex-shrink-0 ml-4">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatTime(conversation.lastMessage.created_at)}</span>
                                </div>
                              </div>

                              {conversation.lastMessage && (
                                <p className="text-base text-gray-200 font-footer line-clamp-2 mb-3 leading-relaxed">
                                  {conversation.lastMessage.content}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-footer">
                                  <span>{conversation.otherUser.email}</span>
                                </div>
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-blue-500 text-white text-sm font-footer px-3 py-1.5 rounded-full">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
