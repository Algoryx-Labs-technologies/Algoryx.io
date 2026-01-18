import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Mail } from 'lucide-react';

export function InboxWidget() {
  const messages = [
    { sender: 'John Doe', subject: 'Project Update Required', time: '10:30 AM', unread: true },
    { sender: 'Sarah Smith', subject: 'Meeting Scheduled', time: '09:15 AM', unread: true },
    { sender: 'Team Lead', subject: 'Weekly Report', time: 'Yesterday', unread: false },
  ];

  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-3xl font-semibold font-hero text-white flex items-center gap-1">
          <Mail className="h-5 w-5 text-blue-400" />
          Messages
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          Your latest messages
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
        <div className="space-y-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-1 p-1 rounded-md border border-white/5 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                message.unread ? 'bg-slate-800/70' : 'bg-slate-800/50'
              }`}
            >
              {message.unread && (
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-1 flex-shrink-0"></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-footer font-medium">
                  {message.subject}
                </p>
                <p className="text-xs text-gray-400 font-footer mt-0.5 truncate">
                  {message.sender}
                </p>
                <p className="text-xs text-gray-500 font-footer mt-0.5">
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

