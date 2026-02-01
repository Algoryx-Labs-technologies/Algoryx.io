import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';
import { Plus, CheckCircle2, X } from 'lucide-react';
import { NotificationsList } from './NotificationsList';
import { PublishNotificationForm } from './PublishNotificationForm';

export function NotificationsPage() {
  const { isCollapsed } = useSidebar();
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePublishSuccess = (message: string) => {
    // Show success message
    setSuccessMessage(message);
    // Trigger refresh of notifications list
    setRefreshTrigger((prev) => prev + 1);
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          isCollapsed ? 'md:ml-20' : 'md:ml-80'
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header with Publish Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-hero">Notifications</h1>
              <p className="text-gray-400 mt-1 font-footer">Manage and publish notifications to users</p>
            </div>
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Publish Notification
            </Button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-lg flex items-center justify-between gap-2 animate-in slide-in-from-top">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Notifications List */}
          <NotificationsList refreshTrigger={refreshTrigger} />

          {/* Publish Notification Modal */}
          <PublishNotificationForm
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            onSuccess={handlePublishSuccess}
          />
        </div>
      </div>
    </div>
  );
}
