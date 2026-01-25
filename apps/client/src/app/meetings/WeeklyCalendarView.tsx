import { useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO, getDay } from 'date-fns';
import { cn } from '../components/ui/utils';
import { Video, MapPin, Users } from 'lucide-react';

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

interface WeeklyCalendarViewProps {
  meetings: Meeting[];
  selectedDate: Date | undefined;
  onDateSelect?: (date: Date) => void;
}

export function WeeklyCalendarView({
  meetings,
  selectedDate,
  onDateSelect
}: WeeklyCalendarViewProps) {
  const today = new Date();
  const currentDate = selectedDate || today;

  // Get the start of the week (Monday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate week days (Monday to Saturday)
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 6; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [weekStart]);

  // Generate time slots (12 AM to 11 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  }, []);

  // Get meetings for a specific day
  const getMeetingsForDay = (day: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      return isSameDay(meetingDate, day);
    });
  };

  // Calculate meeting position and height
  const getMeetingStyle = (meeting: Meeting) => {
    const [startHour, startMinute] = meeting.startTime.split(':').map(Number);
    const [endHour, endMinute] = meeting.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const duration = endMinutes - startMinutes;
    
    // Calculate position (each hour = 60px, each minute = 1px)
    const top = startMinutes;
    const height = Math.max(duration, 30); // Minimum height of 30px
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/80 border-blue-400 text-white';
      case 'in_person':
      case 'in-person':
        return 'bg-green-500/80 border-green-400 text-white';
      case 'phone':
        return 'bg-purple-500/80 border-purple-400 text-white';
      default:
        return 'bg-gray-500/80 border-gray-400 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-3 w-3" />;
      case 'in_person':
      case 'in-person':
        return <MapPin className="h-3 w-3" />;
      case 'phone':
        return <Users className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900/30">
      {/* Week Header */}
      <div className="border-b border-white/10 bg-slate-900/50">
        <div className="grid grid-cols-7 h-12">
          {/* Time column header */}
          <div className="border-r border-white/10 flex items-center justify-center px-2">
            <span className="text-xs text-gray-400 font-footer">Time</span>
          </div>
          
          {/* Day headers */}
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={index}
                className={cn(
                  "border-r border-white/10 flex flex-col items-center justify-center px-2 cursor-pointer hover:bg-white/5 transition-colors",
                  index === weekDays.length - 1 && "border-r-0",
                  isToday && "bg-blue-500/20"
                )}
                onClick={() => onDateSelect?.(day)}
              >
                <span className="text-xs text-gray-400 font-footer">
                  {format(day, 'EEE')}
                </span>
                <span className={cn(
                  "text-sm font-semibold font-hero",
                  isToday ? "text-blue-400" : "text-white"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div 
        className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="relative" style={{ height: '1440px' }}> {/* 24 hours * 60 minutes */}
          {/* Time slots and day columns */}
          <div className="grid grid-cols-7 h-full">
            {/* Time column */}
            <div className="border-r border-white/10">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-white/5 h-15 flex items-start justify-end pr-2 pt-1"
                  style={{ height: '60px' }}
                >
                  <span className="text-xs text-gray-500 font-footer">
                    {formatTime(hour)}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const dayMeetings = getMeetingsForDay(day);
              const isToday = isSameDay(day, today);
              
              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "border-r border-white/10 relative",
                    dayIndex === weekDays.length - 1 && "border-r-0",
                    isToday && "bg-blue-500/5"
                  )}
                >
                  {/* Hour lines */}
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="border-b border-white/5"
                      style={{ height: '60px' }}
                    />
                  ))}

                  {/* Meetings */}
                  {dayMeetings.map((meeting) => {
                    const style = getMeetingStyle(meeting);
                    return (
                      <div
                        key={meeting.id}
                        className={cn(
                          "absolute left-0 right-0 mx-1 rounded px-2 py-1 border-l-2 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity z-10",
                          getTypeColor(meeting.type)
                        )}
                        style={style}
                        title={`${meeting.title} - ${meeting.startTime} to ${meeting.endTime}`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          {getTypeIcon(meeting.type)}
                          <span className="text-xs font-semibold font-hero truncate">
                            {meeting.startTime}
                          </span>
                        </div>
                        <div className="text-xs font-footer truncate">
                          {meeting.title}
                        </div>
                        {meeting.location && (
                          <div className="text-xs font-footer truncate opacity-90">
                            {meeting.location}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

