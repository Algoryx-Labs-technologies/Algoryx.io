import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Bell } from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { apiClient } from '../../../lib/api';
import { format, parseISO, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

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

export function NotificationsWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        const response = await apiClient.get<Meeting[]>('/meetings/upcoming');
        if (response.success && response.data) {
          setMeetings(response.data);
        } else {
          console.error('Error fetching upcoming meetings:', response.error);
        }
      } catch (error) {
        console.error('Error fetching upcoming meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMeetings();
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

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
          <Bell className="h-5 w-5 text-blue-400" />
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          {nextMeeting ? '' : 'No upcoming meetings'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
        {loading ? (
          <div className="text-gray-400 text-xs text-center py-4">Loading...</div>
        ) : nextMeeting ? (
          <div className="flex items-start gap-1.5 p-1.5 rounded-md border border-white/5 bg-slate-800/70 hover:bg-slate-800/80 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-blue-400"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-footer font-medium text-white">
                Meeting Reminder
              </p>
              <p className="text-xs text-gray-500 font-footer mt-0.5">
                {nextMeeting.title} {getTimeUntilMeeting(nextMeeting)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xs text-center py-4">
            No upcoming meetings scheduled
          </div>
        )}
      </CardContent>
    </Card>
  );
}

