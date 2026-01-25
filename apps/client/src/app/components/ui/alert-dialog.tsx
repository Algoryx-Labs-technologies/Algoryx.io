import { useEffect } from 'react';
import { Button } from './button';
import { cn } from './utils';
import { X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MeetingDetails {
  title: string;
  date: string | Date;
  startTime: string;
  endTime: string;
}

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  meetingDetails?: MeetingDetails;
}

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'OK',
  cancelText = 'Cancel',
  variant = 'default',
  meetingDetails,
}: AlertDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
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

  const formatTime = (time24: string): string => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 p-6 shadow-2xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold font-hero text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-300 font-footer mb-4">
            {description}
          </p>
          {meetingDetails && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
              <div className="text-sm font-semibold text-white font-hero">
                {meetingDetails.title}
              </div>
              <div className="text-xs text-gray-400 font-footer space-y-1">
                <div>
                  <span className="text-gray-500">Date: </span>
                  {formatMeetingDate(meetingDetails.date)}
                </div>
                <div>
                  <span className="text-gray-500">Time: </span>
                  {formatTime(meetingDetails.startTime)} - {formatTime(meetingDetails.endTime)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-footer h-9 text-sm px-4"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={cn(
              "font-footer h-9 text-sm px-4",
              variant === 'destructive'
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

