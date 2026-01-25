import { useMemo } from 'react';
import { Calendar } from '../components/ui/calendar';
import { Card } from '../components/ui/card';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  Users,
  Trash2
} from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';

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
  participants: any[];
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface MeetingsSidebarProps {
  meetings: Meeting[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onDeleteMeeting?: (id: string) => void;
  loading?: boolean;
}

export function MeetingsSidebar({
  meetings,
  selectedDate,
  onDateSelect,
  onDeleteMeeting,
  loading = false
}: MeetingsSidebarProps) {
  // Get dates that have meetings
  const datesWithMeetings = useMemo(() => {
    return meetings.map(meeting => {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      return new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate());
    });
  }, [meetings]);

  // Sort meetings by date and time
  const sortedMeetings = useMemo(() => {
    return [...meetings].sort((a, b) => {
      const dateA = typeof a.date === 'string' ? parseISO(a.date) : new Date(a.date);
      const dateB = typeof b.date === 'string' ? parseISO(b.date) : new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });
  }, [meetings]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'in_person':
      case 'in-person':
        return <MapPin className="h-4 w-4" />;
      case 'phone':
        return <Users className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_person':
      case 'in-person':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'phone':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatMeetingDate = (date: string | Date) => {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    } else {
      return format(d, 'MMM d, yyyy');
    }
  };

  return (
    <div className="w-80 border-r border-white/10 bg-slate-900/50 flex flex-col h-full overflow-hidden">
      {/* Monthly Calendar */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3 font-hero">Calendar</h3>
        <div className="bg-white/5 border border-white/10 rounded-lg p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="rounded-md border-0 bg-transparent text-white"
            modifiers={{
              hasMeeting: datesWithMeetings,
            }}
            modifiersClassNames={{
              hasMeeting: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-400",
            }}
            classNames={{
              months: "text-sm",
              caption_label: "text-sm font-medium",
              day: "text-sm h-8 w-8",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-blue-500/20 text-blue-300 font-bold",
            }}
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <h3 className="text-sm font-semibold text-white mb-3 font-hero">All Meetings</h3>
        {loading ? (
          <div className="text-gray-400 text-sm font-footer">Loading meetings...</div>
        ) : sortedMeetings.length === 0 ? (
          <div className="text-gray-400 text-sm font-footer text-center py-8">
            No meetings scheduled
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMeetings.map((meeting) => {
              const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
              const isSelected = selectedDate && isSameDay(meetingDate, selectedDate);

              return (
                <Card
                  key={meeting.id}
                  className={cn(
                    "bg-gradient-to-br from-slate-800/70 to-slate-700/50 backdrop-blur-sm border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-500/50",
                    isSelected ? "border-blue-500/50 bg-blue-500/10" : "border-white/10"
                  )}
                  onClick={() => onDateSelect(meetingDate)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white font-hero line-clamp-1">
                        {meeting.title}
                      </h4>
                      {onDeleteMeeting && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-400 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMeeting(meeting.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "text-xs font-footer px-2 py-0.5 rounded border flex items-center gap-1",
                        getTypeColor(meeting.type)
                      )}>
                        {getTypeIcon(meeting.type)}
                        {meeting.type === 'in_person' ? 'In-Person' : meeting.type === 'video' ? 'Video' : 'Phone'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-300 font-footer">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formatMeetingDate(meetingDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-300 font-footer">
                      <Clock className="h-3 w-3" />
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                    </div>

                    {meeting.location && (
                      <div className="flex items-center gap-2 text-xs text-gray-300 font-footer">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{meeting.location}</span>
                      </div>
                    )}

                    {meeting.meetingLink && (
                      <div className="flex items-center gap-2 text-xs">
                        <Video className="h-3 w-3 text-blue-400" />
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline font-footer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

