import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '../../components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar as CalendarIcon, Video, Clock, ExternalLink, MapPin, Phone } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from '../../components/ui/utils';
import { apiClient } from '../../../lib/api';

interface MeetingParticipant {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

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
  participants: MeetingParticipant[];
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
  User?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export function CalendarWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await apiClient.get<Meeting[]>('/meetings');
        if (response.success && response.data) {
          setMeetings(response.data);
        } else {
          console.error('Error fetching meetings:', response.error);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Get dates that have meetings
  const datesWithMeetings = useMemo(() => {
    return meetings.map(meeting => {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      return new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate());
    });
  }, [meetings]);

  // Get meetings for selected date
  const selectedDateMeetings = useMemo(() => {
    if (!selectedDate) return [];
    return meetings.filter(meeting => {
      const meetingDate = typeof meeting.date === 'string' ? parseISO(meeting.date) : new Date(meeting.date);
      return isSameDay(meetingDate, selectedDate);
    }).sort((a, b) => {
      // Sort by start time
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });
  }, [meetings, selectedDate]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-400" />;
      case 'in_person':
        return <MapPin className="h-4 w-4 text-green-400" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-purple-400" />;
      default:
        return <Video className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
          <CalendarIcon className="h-5 w-5 text-blue-400" />
          Calendar
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          {selectedDate ? (
            <>Selected: {format(selectedDate, "PPP")}</>
          ) : (
            <>No date selected</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden flex flex-col gap-2 min-h-0">
        <div className="flex-shrink-0 flex justify-center py-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border-0 bg-transparent text-white"
            modifiers={{
              hasMeeting: datesWithMeetings,
            }}
            modifiersClassNames={{
              hasMeeting: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-400",
            }}
            classNames={{
              months: "text-base",
              caption_label: "text-base font-medium",
              day: "text-base h-11 w-11",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-blue-500/20 text-blue-300 font-bold",
            }}
          />
        </div>
        <div className="flex-shrink-0 border-t border-white/10 pt-2">
          {loading ? (
            <div className="text-gray-400 text-xs text-center py-2">Loading meetings...</div>
          ) : selectedDateMeetings.length > 0 ? (
            <div 
              className="space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{
                maxHeight: 'calc(3 * (48px + 6px))', // 3 meetings * (height + gap)
              }}
            >
              {selectedDateMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-slate-800/50 rounded-lg p-1.5 border border-white/5 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-start gap-1.5">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(meeting.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[11px] font-medium truncate">{meeting.title}</div>
                      <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-[10px]">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{meeting.startTime} - {meeting.endTime}</span>
                      </div>
                      {meeting.type === 'video' && meeting.meetingLink && (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 mt-1 text-blue-400 hover:text-blue-300 text-[10px] transition-colors"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                          <span>Join Meeting</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-xs text-center py-2">No meetings scheduled</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

