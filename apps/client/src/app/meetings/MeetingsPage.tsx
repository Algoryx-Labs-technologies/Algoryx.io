import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Plus, 
  X,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'video' | 'in-person' | 'phone';
  location?: string;
  meetingLink?: string;
  participants: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
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
        // TODO: Replace with actual API endpoint when backend is ready
        // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
        // const token = localStorage.getItem('auth_token');
        // const response = await fetch(`${API_BASE_URL}/meetings`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setMeetings(data.data || []);
        // }

        // Mock data for now
        const mockMeetings: Meeting[] = [
          {
            id: '1',
            title: 'Project Kickoff Meeting',
            description: 'Initial discussion about project requirements and timeline',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '10:00',
            endTime: '11:30',
            type: 'video',
            meetingLink: 'https://meet.example.com/kickoff-123',
            participants: ['John Smith', 'Sarah Johnson'],
            status: 'upcoming',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Technical Review Session',
            description: 'Review of technical architecture and implementation approach',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '14:00',
            endTime: '15:00',
            type: 'video',
            meetingLink: 'https://meet.example.com/tech-review-456',
            participants: ['Michael Chen', 'David Wilson'],
            status: 'upcoming',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Progress Update Meeting',
            description: 'Weekly progress update and next steps discussion',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '10:00',
            type: 'phone',
            participants: ['John Smith'],
            status: 'upcoming',
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            title: 'On-site Consultation',
            description: 'In-person meeting at client office',
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: '13:00',
            endTime: '15:00',
            type: 'in-person',
            location: '123 Business St, Suite 500, New York, NY 10001',
            participants: ['Sarah Johnson', 'Michael Chen'],
            status: 'upcoming',
            created_at: new Date().toISOString(),
          },
        ];

        setMeetings(mockMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleScheduleMeeting = () => {
    if (!selectedDate || !formData.title || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      location: formData.location,
      meetingLink: formData.meetingLink,
      participants: formData.participants
        ? formData.participants.split(',').map(p => p.trim()).filter(p => p)
        : [],
      status: 'upcoming',
      created_at: new Date().toISOString(),
    };

    setMeetings([...meetings, newMeeting].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateA.getTime() - dateB.getTime();
    }));

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
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'in-person':
        return <MapPin className="h-5 w-5" />;
      case 'phone':
        return <Users className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-person':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'phone':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMM d, yyyy');
    }
  };

  const getDaysUntilMeeting = (dateString: string) => {
    const meetingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    meetingDate.setHours(0, 0, 0, 0);
    const diffTime = meetingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingMeetings = meetings.filter(m => {
    const meetingDate = new Date(`${m.date}T${m.startTime}`);
    return meetingDate >= new Date() && m.status === 'upcoming';
  });

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

        <div className="h-full overflow-y-auto relative z-10">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                  Meetings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-footer">
                  View upcoming meetings and schedule new ones
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

            {/* Upcoming Meetings */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 font-footer">Loading meetings...</div>
              </div>
            ) : upcomingMeetings.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold font-hero text-white mb-2">No Upcoming Meetings</h3>
                  <p className="text-gray-400 font-footer mb-6">Schedule your first meeting to get started</p>
                  <Button
                    onClick={() => setShowScheduleModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-footer"
                  >
                    Schedule Meeting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => {
                  const daysUntil = getDaysUntilMeeting(meeting.date);
                  const meetingDateTime = new Date(`${meeting.date}T${meeting.startTime}`);

                  return (
                    <Card
                      key={meeting.id}
                      className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden"
                    >
                      <CardHeader className="px-6 pt-6 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-semibold font-hero text-white mb-2">
                              {meeting.title}
                            </CardTitle>
                            {meeting.description && (
                              <p className="text-base text-gray-300 font-footer mb-3">
                                {meeting.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn(
                                "text-sm font-footer px-3 py-1.5 rounded border flex items-center gap-2",
                                getTypeColor(meeting.type)
                              )}>
                                {getTypeIcon(meeting.type)}
                                {meeting.type === 'video' ? 'Video Call' : meeting.type === 'in-person' ? 'In-Person' : 'Phone Call'}
                              </span>
                              {daysUntil === 0 && (
                                <span className="text-sm font-footer px-3 py-1.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  Today
                                </span>
                              )}
                              {daysUntil === 1 && (
                                <span className="text-sm font-footer px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                  Tomorrow
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white"
                              onClick={() => handleDeleteMeeting(meeting.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-6 pb-6 space-y-4">
                        {/* Date and Time */}
                        <div className="flex items-center gap-3 text-base">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300 font-footer font-medium">Date:</span>
                          <span className="text-white font-footer font-semibold">
                            {formatDate(meeting.date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-base">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300 font-footer font-medium">Time:</span>
                          <span className="text-white font-footer font-semibold">
                            {meeting.startTime} - {meeting.endTime}
                          </span>
                        </div>

                        {/* Location or Meeting Link */}
                        {meeting.type === 'in-person' && meeting.location && (
                          <div className="flex items-start gap-3 text-base">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-gray-300 font-footer font-medium">Location: </span>
                              <span className="text-white font-footer">{meeting.location}</span>
                            </div>
                          </div>
                        )}

                        {meeting.type === 'video' && meeting.meetingLink && (
                          <div className="flex items-center gap-3 text-base">
                            <Video className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300 font-footer font-medium">Meeting Link: </span>
                            <a
                              href={meeting.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-footer underline"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}

                        {/* Participants */}
                        {meeting.participants.length > 0 && (
                          <div className="flex items-start gap-3 text-base">
                            <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-gray-300 font-footer font-medium">Participants: </span>
                              <span className="text-white font-footer">
                                {meeting.participants.join(', ')}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
                      Meeting Link
                    </label>
                    <Input
                      type="url"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      placeholder="https://meet.example.com/..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
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

