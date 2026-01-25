import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { X, CheckCircle2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '../../lib/api';
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

interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Convert 24-hour time to 12-hour format
const formatTo12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Convert 12-hour time to 24-hour format
const formatTo24Hour = (time12: string): string => {
  if (!time12) return '';
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '';
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

// Generate 30-minute time slots
const generateTimeSlots = (minTime?: string): string[] => {
  const slots: string[] = [];
  const startHour = minTime ? parseInt(minTime.split(':')[0]) : 0;
  const startMinute = minTime ? parseInt(minTime.split(':')[1]) : 0;
  
  // Round up to next 30-minute slot
  let currentHour = startHour;
  let currentMinute = startMinute;
  if (currentMinute > 0 && currentMinute < 30) {
    currentMinute = 30;
  } else if (currentMinute > 30) {
    currentHour += 1;
    currentMinute = 0;
  }
  
  // Generate slots from current time to 11:30 PM
  for (let hour = currentHour; hour < 24; hour++) {
    const minutes = hour === currentHour && currentMinute === 30 ? [30] : [0, 30];
    for (const minute of minutes) {
      if (hour === currentHour && minute < currentMinute) continue;
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time24);
    }
  }
  
  return slots;
};

// Calculate duration in hours
const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  const duration = (endMinutes - startMinutes) / 60;
  return Math.round(duration * 2) / 2; // Round to nearest 0.5
};

interface TimePickerProps {
  value: string; // 24-hour format
  onChange: (value: string) => void;
  label: string;
  minTime?: string; // 24-hour format
  startTime?: string; // For end time picker to calculate duration
  className?: string;
}

function TimePicker({ value, onChange, label, minTime, startTime, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const timeSlots = generateTimeSlots(minTime);
  const selectedTime12 = formatTo12Hour(value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleSelect = (time24: string) => {
    onChange(time24);
    setIsOpen(false);
  };
  
  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
          {label} <span className="text-red-400">*</span>
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 h-9 text-sm text-white text-left flex items-center justify-between hover:border-white/20 transition-colors"
      >
        <span className={selectedTime12 ? '' : 'text-gray-500'}>
          {selectedTime12 || '--:--'}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {timeSlots.map((time24) => {
            const time12 = formatTo12Hour(time24);
            const duration = startTime ? calculateDuration(startTime, time24) : 0;
            let durationText = '';
            if (duration > 0) {
              if (duration === 0.5) {
                durationText = ' (0.5 hour)';
              } else if (duration === 1) {
                durationText = ' (1 hour)';
              } else {
                durationText = ` (${duration} hours)`;
              }
            } else if (duration === 0 && startTime) {
              durationText = ' (0 hour)';
            }
            
            return (
              <button
                key={time24}
                type="button"
                onClick={() => handleSelect(time24)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm text-white hover:bg-blue-600/20 transition-colors",
                  value === time24 && "bg-blue-600/30"
                )}
              >
                {time12}{durationText}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              // For custom time, we'll use a prompt for now
              const customTime = prompt('Enter custom time (HH:MM format, 24-hour):');
              if (customTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(customTime)) {
                onChange(customTime);
                setIsOpen(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm text-blue-400 hover:bg-blue-600/20 transition-colors border-t border-white/10"
          >
            Custom
          </button>
        </div>
      )}
    </div>
  );
}

export function ScheduleMeetingModal({
  open,
  onClose,
  onSuccess
}: ScheduleMeetingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '', // 24-hour format
    endTime: '', // 24-hour format
    type: 'video' as 'video' | 'in-person' | 'phone',
    location: '',
    meetingLink: '',
    participants: '',
  });
  const [loading, setLoading] = useState(false);
  
  // Get minimum time based on selected date
  const getMinTime = (): string | undefined => {
    if (!selectedDate) return undefined;
    
    const today = new Date();
    const selected = new Date(selectedDate);
    
    // Reset time for comparison
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDateOnly = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    
    // If selected date is today, return current time
    if (selectedDateOnly.getTime() === todayDate.getTime()) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // Round up to next 30-minute slot
      let minHour = currentHour;
      let minMinute = currentMinute < 30 ? 30 : 0;
      if (currentMinute >= 30) {
        minHour += 1;
        minMinute = 0;
      }
      return `${minHour.toString().padStart(2, '0')}:${minMinute.toString().padStart(2, '0')}`;
    }
    
    return undefined;
  };
  
  // Get minimum end time (should be after start time)
  const getMinEndTime = (): string | undefined => {
    if (!formData.startTime) return undefined;
    
    const [startHour, startMin] = formData.startTime.split(':').map(Number);
    let minHour = startHour;
    let minMinute = startMin + 30; // At least 30 minutes after start
    
    if (minMinute >= 60) {
      minHour += 1;
      minMinute = 0;
    }
    
    return `${minHour.toString().padStart(2, '0')}:${minMinute.toString().padStart(2, '0')}`;
  };

  const handleScheduleMeeting = async () => {
    if (!selectedDate || !formData.title || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    // For video meetings, meeting link is required
    if (formData.type === 'video' && !formData.meetingLink) {
      alert('Meeting link is required for video meetings');
      return;
    }

    setLoading(true);

    try {
      // Parse participants
      const participants = formData.participants
        ? formData.participants.split(',').map(p => {
            const trimmed = p.trim();
            // Try to parse as "Name <email>" or just email
            const emailMatch = trimmed.match(/<(.+)>/);
            const email = emailMatch ? emailMatch[1] : trimmed;
            const nameMatch = trimmed.match(/^(.+?)\s*</);
            const name = nameMatch ? nameMatch[1].trim() : undefined;
            return { email, name };
          }).filter(p => p.email)
        : [];

      const meetingData = {
        title: formData.title,
        description: formData.description || undefined,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type === 'in-person' ? 'in_person' : formData.type,
        location: formData.type === 'in-person' ? formData.location || undefined : undefined,
        meetingLink: formData.type === 'video' ? formData.meetingLink || undefined : undefined,
        participants: participants.length > 0 ? participants : undefined,
      };

      const response = await apiClient.post<Meeting>('/meetings', meetingData);
      
      if (response.success && response.data) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          type: 'video',
          location: '',
          meetingLink: '',
          participants: '',
        });
        setSelectedDate(new Date());
        onClose();
        
        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(response.error || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 p-6 shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-hero text-white">Schedule New Meeting</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
          {/* Left Column - Form */}
          <div className="space-y-3 overflow-y-auto pr-2">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                Meeting Title <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter meeting title"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter meeting description"
                rows={2}
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                Meeting Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'in-person' | 'phone' })}
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="video">Video Call</option>
                <option value="in-person">In-Person</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                Duration <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TimePicker
                    value={formData.startTime}
                    onChange={(value) => {
                      setFormData({ ...formData, startTime: value });
                      // Reset end time if it's before new start time
                      if (formData.endTime && value >= formData.endTime) {
                        const [hour, min] = value.split(':').map(Number);
                        let endHour = hour;
                        let endMin = min + 30;
                        if (endMin >= 60) {
                          endHour += 1;
                          endMin = 0;
                        }
                        setFormData({ ...formData, startTime: value, endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}` });
                      } else {
                        setFormData({ ...formData, startTime: value });
                      }
                    }}
                    label=""
                    minTime={getMinTime()}
                  />
                </div>
                <span className="text-gray-400 font-footer text-sm pt-5">to</span>
                <div className="flex-1">
                  <TimePicker
                    value={formData.endTime}
                    onChange={(value) => setFormData({ ...formData, endTime: value })}
                    label=""
                    minTime={getMinEndTime()}
                    startTime={formData.startTime}
                  />
                </div>
              </div>
            </div>

            {formData.type === 'in-person' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                  Location
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter meeting location"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                />
              </div>
            )}

            {formData.type === 'video' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                  Meeting Link <span className="text-red-400">*</span>
                </label>
                <Input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="Enter meeting link (e.g., https://meet.google.com/xxx-xxxx-xxx)"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-0.5 font-footer">
                  Please provide a meeting link (Google Meet, Zoom, Teams, etc.)
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer">
                Participants
              </label>
              <Input
                type="text"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Enter participant names (comma-separated)"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
              />
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div className="flex flex-col min-h-0">
            <label className="block text-xs font-medium text-gray-300 mb-1.5 font-footer flex-shrink-0">
              Select Date <span className="text-red-400">*</span>
            </label>
            <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex-1 flex items-center justify-center min-h-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md"
                classNames={{
                  months: "flex flex-col gap-1",
                  month: "flex flex-col gap-1",
                  caption: "flex justify-center pt-0 relative items-center w-full mb-1",
                  caption_label: "text-xs font-medium",
                  nav: "flex items-center gap-1",
                  nav_button: "size-5",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-7 font-normal text-[10px] flex-1",
                  row: "flex w-full mt-0.5",
                  cell: "relative p-0 text-center text-[10px] flex-1",
                  day: "size-6 p-0 font-normal text-xs w-full h-6",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-white/10 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-footer h-9 text-sm px-4"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleMeeting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-footer h-9 text-sm px-4"
            disabled={loading}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </div>
      </div>
    </div>
  );
}

