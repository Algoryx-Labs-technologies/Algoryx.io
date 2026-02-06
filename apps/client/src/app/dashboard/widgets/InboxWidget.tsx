import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Mail } from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api';
import { LoadingSpinner } from '../../components/Loading';

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

interface MessageItem {
  sender: string;
  subject: string;
  time: string;
  unread: boolean;
  conversationId: string;
}

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // Format as time if today, otherwise as date
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function InboxWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Conversation[]>('/messages/conversations');
      
      if (response.success && response.data) {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        // Filter conversations with messages in the last 24 hours
        const recentConversations = response.data.filter((conv) => {
          if (!conv.lastMessage) return false;
          const messageDate = new Date(conv.lastMessage.created_at);
          return messageDate >= twentyFourHoursAgo;
        });

        // Sort by most recent first
        recentConversations.sort((a, b) => {
          const aTime = new Date(a.lastMessage.created_at).getTime();
          const bTime = new Date(b.lastMessage.created_at).getTime();
          return bTime - aTime;
        });

        // Transform to message items and limit to 5 most recent
        const messageItems: MessageItem[] = recentConversations.slice(0, 5).map((conv) => {
          const senderName = conv.otherUser.firstName && conv.otherUser.lastName
            ? `${conv.otherUser.firstName} ${conv.otherUser.lastName}`
            : conv.otherUser.email;
          
          const messageDate = new Date(conv.lastMessage.created_at);
          const timeStr = formatTime(messageDate);
          
          return {
            sender: senderName,
            subject: conv.lastMessage.content.length > 50 
              ? conv.lastMessage.content.substring(0, 50) + '...' 
              : conv.lastMessage.content,
            time: timeStr,
            unread: conv.unreadCount > 0,
            conversationId: conv.conversationId,
          };
        });

        setMessages(messageItems);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
          <Mail className="h-5 w-5 text-blue-400" />
          Messages
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          Your latest messages
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-sm text-gray-400 font-footer">No messages in the last 24 hours</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-1.5 p-1.5 rounded-md border border-white/5 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                  message.unread ? 'bg-slate-800/70' : 'bg-slate-800/50'
                }`}
              >
                {message.unread && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-footer font-medium">
                    {message.subject}
                  </p>
                  <p className="text-sm text-gray-400 font-footer mt-0.5 truncate">
                    {message.sender}
                  </p>
                  <p className="text-sm text-gray-500 font-footer mt-0.5">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

