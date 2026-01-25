import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';
import { AlertDialog } from '../components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { MeetingsSidebar } from './MeetingsSidebar';
import { WeeklyCalendarView } from './WeeklyCalendarView';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

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

  const refreshMeetings = async () => {
    try {
      const response = await apiClient.get<Meeting[]>('/meetings');
      if (response.success && response.data) {
        setMeetings(response.data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setMeetingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!meetingToDelete) return;

    try {
      const response = await apiClient.delete(`/meetings/${meetingToDelete}`);
      
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
    } finally {
      setMeetingToDelete(null);
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
            onDeleteMeeting={handleDeleteClick}
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
      <ScheduleMeetingModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={refreshMeetings}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setMeetingToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Meeting"
        description="Are you sure you want to delete this meeting? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

