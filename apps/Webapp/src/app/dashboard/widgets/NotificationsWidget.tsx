import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Bell } from 'lucide-react';

export function NotificationsWidget() {
  const notifications = [
    { 
      id: 1,
      title: 'New Project Assigned', 
      message: 'You have been assigned to the Trading Algorithm V2 project',
      time: '5 minutes ago',
      type: 'info',
      unread: true
    },
    { 
      id: 2,
      title: 'Meeting Reminder', 
      message: 'Team standup meeting in 30 minutes',
      time: '15 minutes ago',
      type: 'reminder',
      unread: true
    },
    { 
      id: 3,
      title: 'Task Completed', 
      message: 'API Integration task has been completed',
      time: '1 hour ago',
      type: 'success',
      unread: false
    },
    { 
      id: 4,
      title: 'System Update', 
      message: 'New features have been deployed to production',
      time: '2 hours ago',
      type: 'update',
      unread: false
    },
    { 
      id: 5,
      title: 'Deadline Approaching', 
      message: 'Dashboard Redesign deadline is in 2 days',
      time: '3 hours ago',
      type: 'warning',
      unread: true
    },
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'reminder':
        return 'bg-blue-400';
      case 'update':
        return 'bg-purple-400';
      default:
        return 'bg-cyan-400';
    }
  };

  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-3xl font-semibold font-hero text-white flex items-center gap-1">
          <Bell className="h-5 w-5 text-blue-400" />
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          {notifications.filter(n => n.unread).length} unread
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
        <div className="space-y-1">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-1 p-1 rounded-md border border-white/5 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                notification.unread ? 'bg-slate-800/70' : 'bg-slate-800/50'
              }`}
            >
              <div className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${getNotificationColor(notification.type)}`}></div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-footer font-medium ${
                  notification.unread ? 'text-white' : 'text-gray-300'
                }`}>
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 font-footer mt-0.5">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

