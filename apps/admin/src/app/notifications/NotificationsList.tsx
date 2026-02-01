import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bell, Globe, Users, Info, CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { getAuthToken } from '../action-center/utils';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'update';
  userId: string | null;
  created_at: string;
  User: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

interface NotificationsListProps {
  refreshTrigger?: number;
}

export function NotificationsList({ refreshTrigger }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch notifications');
      }

      if (result.success && result.data) {
        setNotifications(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setError(error.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'update':
        return <Info className="h-5 w-5 text-purple-400" />;
      default:
        return <Info className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'reminder':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'update':
        return 'border-purple-500/30 bg-purple-500/10';
      default:
        return 'border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-blue-400 animate-spin mr-3" />
            <span className="text-gray-400">Loading notifications...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <XCircle className="h-8 w-8 text-red-400 mb-3" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-400" />
            All Notifications ({notifications.length})
          </CardTitle>
          <button
            onClick={fetchNotifications}
            className="p-2 hover:bg-slate-700/50 rounded-md transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-400 hover:text-white" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No notifications found</p>
            <p className="text-gray-500 text-sm mt-2">Create your first notification to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white font-semibold font-hero">{notification.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {notification.userId ? (
                          <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                            <Users className="h-3 w-3" />
                            User-specific
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">
                            <Globe className="h-3 w-3" />
                            Universal
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 font-footer">{notification.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="capitalize">{notification.type}</span>
                        {notification.User && (
                          <span className="text-gray-400">
                            To: {notification.User.firstName && notification.User.lastName
                              ? `${notification.User.firstName} ${notification.User.lastName}`
                              : notification.User.email}
                          </span>
                        )}
                      </div>
                      <span>{formatDate(notification.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

