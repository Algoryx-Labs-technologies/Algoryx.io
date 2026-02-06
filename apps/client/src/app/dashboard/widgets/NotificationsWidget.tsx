import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Bell } from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { apiClient } from '../../../lib/api';
import { format, parseISO, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { LoadingSpinner } from '../../components/Loading';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  type: 'video' | 'in_person' | 'phone';
  location?: string;
  meetingLink?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

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

export function NotificationsWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both notifications and meetings in parallel
        const [notificationsResponse, meetingsResponse] = await Promise.all([
          apiClient.get<Notification[]>('/notifications'),
          apiClient.get<Meeting[]>('/meetings/upcoming'),
        ]);

        if (notificationsResponse.success && notificationsResponse.data) {
          // Filter to show only recent notifications (last 7 days) and limit to 5
          const now = new Date();
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          const recentNotifications = notificationsResponse.data
            .filter(notif => {
              const notifDate = new Date(notif.created_at);
              return notifDate >= sevenDaysAgo;
            })
            .slice(0, 5);
          
          setNotifications(recentNotifications);
        }

        if (meetingsResponse.success && meetingsResponse.data) {
          setMeetings(meetingsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching notifications/meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Find the next scheduled meeting
  const nextMeeting = useMemo(() => {
    if (meetings.length === 0) return null;

    const now = new Date();
    let closestMeeting: Meeting | null = null;
    let closestTime: number = Infinity;

    meetings.forEach(meeting => {
      if (meeting.status !== 'upcoming') return;

      try {
        const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
        const [hours, minutes] = meeting.startTime.split(':').map(Number);
        
        const meetingDateTime = new Date(
          meetingDate.getFullYear(),
          meetingDate.getMonth(),
          meetingDate.getDate(),
          hours,
          minutes,
          0,
          0
        );

        // Only consider future meetings
        if (meetingDateTime > now) {
          const timeDiff = meetingDateTime.getTime() - now.getTime();
          if (timeDiff < closestTime) {
            closestTime = timeDiff;
            closestMeeting = meeting;
          }
        }
      } catch (error) {
        console.error('Error processing meeting:', error);
      }
    });

    return closestMeeting;
  }, [meetings]);

  // Format time to 12-hour format with am/pm
  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'pm' : 'am';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  // Format time until meeting
  const getTimeUntilMeeting = (meeting: Meeting): string => {
    try {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      const [hours, minutes] = meeting.startTime.split(':').map(Number);
      
      const meetingDateTime = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate(),
        hours,
        minutes,
        0,
        0
      );

      const now = new Date();
      const minutesUntil = differenceInMinutes(meetingDateTime, now);
      const hoursUntil = differenceInHours(meetingDateTime, now);
      const daysUntil = differenceInDays(meetingDateTime, now);
      const formattedTime = formatTime(meeting.startTime);

      if (minutesUntil < 60) {
        return `in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''} at ${formattedTime}`;
      } else if (hoursUntil < 24) {
        return `in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''} at ${formattedTime}`;
      } else if (daysUntil === 1) {
        return `tomorrow at ${formattedTime}`;
      } else {
        return `in ${daysUntil} days at ${formattedTime}`;
      }
    } catch (error) {
      return 'soon';
    }
  };

  const getMeetingDateString = (meeting: Meeting): string => {
    try {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      return format(meetingDate, 'MMM d, yyyy');
    } catch (error) {
      return '';
    }
  };


  // Format notification time
  const formatNotificationTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
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
      return format(date, 'MMM d');
    } catch (error) {
      return '';
    }
  };

  // Combine notifications and meeting reminders
  const allNotifications = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'notification' | 'meeting';
      title: string;
      message: string;
      time: string;
      sortOrder: number; // Lower number = higher priority
    }> = [];

    // Add notifications (already sorted by API by created_at desc)
    notifications.forEach(notif => {
      const notifDate = new Date(notif.created_at);
      const now = new Date();
      const diffMs = now.getTime() - notifDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      items.push({
        id: notif.id,
        type: 'notification',
        title: notif.title,
        message: notif.message,
        time: formatNotificationTime(notif.created_at),
        sortOrder: diffMins, // Minutes ago (lower = more recent)
      });
    });

    // Add meeting reminder if available (prioritize if very soon)
    if (nextMeeting) {
      try {
        const meetingDate = typeof nextMeeting.date === 'string' ? parseISO(nextMeeting.date) : new Date(nextMeeting.date);
        const [hours, minutes] = nextMeeting.startTime.split(':').map(Number);
        const meetingDateTime = new Date(
          meetingDate.getFullYear(),
          meetingDate.getMonth(),
          meetingDate.getDate(),
          hours,
          minutes,
          0,
          0
        );
        const now = new Date();
        const diffMins = Math.floor((meetingDateTime.getTime() - now.getTime()) / 60000);
        
        items.push({
          id: `meeting-${nextMeeting.id}`,
          type: 'meeting',
          title: 'Meeting Reminder',
          message: `${nextMeeting.title} ${getTimeUntilMeeting(nextMeeting)}`,
          time: diffMins < 60 ? `in ${diffMins} min` : diffMins < 1440 ? `in ${Math.floor(diffMins / 60)}h` : getMeetingDateString(nextMeeting),
          sortOrder: diffMins < 60 ? -1 : 10000, // Prioritize if within 1 hour
        });
      } catch (error) {
        // If error parsing meeting, add it at the end
        items.push({
          id: `meeting-${nextMeeting.id}`,
          type: 'meeting',
          title: 'Meeting Reminder',
          message: `${nextMeeting.title} ${getTimeUntilMeeting(nextMeeting)}`,
          time: getMeetingDateString(nextMeeting),
          sortOrder: 10000,
        });
      }
    }

    // Sort by sortOrder (lower = higher priority), then limit to 5 items
    return items.sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 5);
  }, [notifications, nextMeeting]);

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/50 to-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/60 hover:to-slate-800/50 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
          <Bell className="h-5 w-5 text-blue-400" />
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          Your latest notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-sm text-gray-400 font-footer">No notifications available</p>
          </div>
        ) : (
          <div className="space-y-1.5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {allNotifications.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-1.5 p-1.5 rounded-md border border-white/5 hover:bg-slate-800/70 transition-colors bg-slate-800/50"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-footer font-medium">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-400 font-footer mt-0.5 truncate">
                    {item.message}
                  </p>
                  <p className="text-sm text-gray-500 font-footer mt-0.5">
                    {item.time}
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

