import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../components/ui/utils';

interface Task {
  id: string;
  name: string;
  component: string;
  status: 'to_do' | 'in_progress' | 'done' | 'blocked';
  startDate: string;
  endDate: string;
  assignee?: string;
  description?: string;
}

interface MVP {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface TimelineData {
  mvps: MVP[];
}

interface TimelineViewerProps {
  timeline: any;
}

export function TimelineViewer({ timeline }: TimelineViewerProps) {
  const [expandedMVPs, setExpandedMVPs] = useState<Set<string>>(new Set());
  const [timelineData, setTimelineData] = useState<TimelineData>({ mvps: [] });

  // Parse timeline data
  useEffect(() => {
    if (timeline) {
      try {
        const parsed = typeof timeline === 'string' ? JSON.parse(timeline) : timeline;
        if (parsed && typeof parsed === 'object' && parsed.mvps && Array.isArray(parsed.mvps)) {
          setTimelineData(parsed);
          // Expand all MVPs by default
          setExpandedMVPs(new Set(parsed.mvps.map((mvp: MVP) => mvp.id)));
        } else {
          setTimelineData({ mvps: [] });
        }
      } catch (error) {
        console.error('Error parsing timeline:', error);
        setTimelineData({ mvps: [] });
      }
    } else {
      setTimelineData({ mvps: [] });
    }
  }, [timeline]);

  const toggleMVP = (mvpId: string) => {
    const newExpanded = new Set(expandedMVPs);
    if (newExpanded.has(mvpId)) {
      newExpanded.delete(mvpId);
    } else {
      newExpanded.add(mvpId);
    }
    setExpandedMVPs(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_do':
      case 'pending':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'done':
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (!timelineData.mvps || timelineData.mvps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 border border-dashed border-white/10 rounded-md">
        <p>No timeline information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {timelineData.mvps && timelineData.mvps.length > 0 && timelineData.mvps.map((mvp) => {
        const mvpId = mvp?.id || '';
        return (
        <div
          key={mvpId}
          className="border border-white/10 rounded-lg bg-slate-800/30 overflow-hidden"
        >
          {/* MVP Header */}
          <div className="p-4 bg-slate-800/50 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => toggleMVP(mvpId)}
                  className="text-gray-400 hover:text-white p-1 transition-colors"
                >
                  {expandedMVPs.has(mvpId) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-sm text-gray-400 font-footer mb-1">MVP Name</p>
                    <p className="text-base text-white font-footer font-semibold">
                      {mvp.name || 'Unnamed MVP'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-footer mb-1">Status</p>
                    <span
                      className={cn(
                        'inline-block text-sm font-footer px-3 py-1 rounded border',
                        getStatusColor(mvp.status)
                      )}
                    >
                      {mvp.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-footer mb-1">Timeline</p>
                    <p className="text-base text-white font-footer">
                      {formatDate(mvp.startDate)} - {formatDate(mvp.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {expandedMVPs.has(mvpId) && mvp?.description && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-sm text-gray-400 font-footer mb-1">Description</p>
                <p className="text-base text-gray-200 font-footer">{mvp.description}</p>
              </div>
            )}
          </div>

          {/* Tasks */}
          {expandedMVPs.has(mvpId) && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm font-footer font-medium">Tasks & Components</p>
                <span className="text-sm text-gray-500 font-footer">
                  {mvp.tasks?.length || 0} task{mvp.tasks?.length !== 1 ? 's' : ''}
                </span>
              </div>

              {!mvp?.tasks || mvp.tasks.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-white/5 rounded-md">
                  No tasks added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {mvp.tasks.filter(t => t).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-slate-900/50 border border-white/5 rounded-md space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-footer mb-1">Task Name</p>
                          <p className="text-sm text-white font-footer font-medium">
                            {task?.name || 'Unnamed Task'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-footer mb-1">Component</p>
                          <p className="text-sm text-white font-footer font-medium">
                            {task?.component || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 font-footer mb-1">Status</p>
                          <span
                            className={cn(
                              'inline-block text-xs font-footer px-2 py-1 rounded border',
                              getStatusColor(task?.status || 'to_do')
                            )}
                          >
                            {(task?.status || 'to_do')?.replace('_', ' ').toUpperCase() || 'TO DO'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-footer mb-1">Start Date</p>
                          <p className="text-sm text-white font-footer">{formatDate(task?.startDate || '')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-footer mb-1">End Date</p>
                          <p className="text-sm text-white font-footer">{formatDate(task?.endDate || '')}</p>
                        </div>
                      </div>
                      {(task?.assignee || task?.description) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                          {task.assignee && (
                            <div>
                              <p className="text-xs text-gray-400 font-footer mb-1">Assignee</p>
                              <p className="text-sm text-white font-footer">{task.assignee}</p>
                            </div>
                          )}
                          {task.description && (
                            <div>
                              <p className="text-xs text-gray-400 font-footer mb-1">Description</p>
                              <p className="text-sm text-gray-200 font-footer">{task.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}

