import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { 
  Plus, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { apiClient } from '../../lib/api';
import { MeetingsSidebar } from './MeetingsSidebar';
import { WeeklyCalendarView } from './WeeklyCalendarView';

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

export function MeetingsPage() {
  const { isCollapsed } = useSidebar();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'video' as 'video' | 'in-person' | 'phone',
    location: '',
    meetingLink: '',
    participants: '',
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Get all meetings for the authenticated user
        const response = await apiClient.get<Meeting[]>('/meetings');
        if (response.success && response.data) {
          // Store all meetings - filtering will happen in upcomingMeetings
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
        // Refresh meetings list
        const refreshResponse = await apiClient.get<Meeting[]>('/meetings');
        if (refreshResponse.success && refreshResponse.data) {
          setMeetings(refreshResponse.data);
        }

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
        setShowScheduleModal(false);
      } else {
        alert(response.error || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting. Please try again.');
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/meetings/${id}`);
      
      if (response.success) {
        // Refresh meetings list
        const refreshResponse = await apiClient.get<Meeting[]>('/meetings');
        if (refreshResponse.success && refreshResponse.data) {
          setMeetings(refreshResponse.data);
        }
      } else {
        alert(response.error || 'Failed to delete meeting');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting. Please try again.');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="h-full overflow-hidden relative z-10 flex">
          {/* Left Sidebar - Monthly Calendar + Meetings List */}
          <MeetingsSidebar
            meetings={meetings}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onDeleteMeeting={handleDeleteMeeting}
            loading={loading}
          />

          {/* Right Side - Weekly Calendar View */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-hero text-white mb-1">
                  Meetings
                </h1>
                <p className="text-sm text-gray-400 font-footer">
                  Weekly calendar view
                </p>
              </div>
              <Button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-footer"
              >
                <Plus className="h-4 w-4" />
                <span>Schedule Meeting</span>
              </Button>
            </div>

            {/* Weekly Calendar */}
            <WeeklyCalendarView
              meetings={meetings}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 p-8 shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold font-hero text-white">Schedule New Meeting</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                    Meeting Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter meeting title"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter meeting description"
                    rows={3}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                    Meeting Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'in-person' | 'phone' })}
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">Video Call</option>
                    <option value="in-person">In-Person</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                      End Time <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {formData.type === 'in-person' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                      Location
                    </label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter meeting location"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                )}

                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                      Meeting Link <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="url"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      placeholder="Enter meeting link (e.g., https://meet.google.com/xxx-xxxx-xxx)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1 font-footer">
                      Please provide a meeting link (Google Meet, Zoom, Teams, etc.)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                    Participants
                  </label>
                  <Input
                    type="text"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="Enter participant names (comma-separated)"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Right Column - Calendar */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
                  Select Date <span className="text-red-400">*</span>
                </label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
                className="font-footer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleMeeting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-footer"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

