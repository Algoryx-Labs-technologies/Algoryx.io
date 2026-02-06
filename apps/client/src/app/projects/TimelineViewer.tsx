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
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600';
      case 'done':
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600';
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
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
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
        <p className="text-sm font-footer">No timeline information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelineData.mvps && timelineData.mvps.length > 0 && timelineData.mvps.map((mvp) => {
        const mvpId = mvp?.id || '';
        return (
        <div
          key={mvpId}
          className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* MVP Header */}
          <div className="bg-gray-50 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleMVP(mvpId)}
                  className="mt-0.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {expandedMVPs.has(mvpId) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white font-hero mb-2">
                        {mvp.name || 'Unnamed MVP'}
                      </h3>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-footer">Status:</span>
                          <span
                            className={cn(
                              'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded border',
                              getStatusColor(mvp.status)
                            )}
                          >
                            {mvp.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-footer">Timeline:</span>
                          <span className="font-semibold font-footer">
                            {formatDate(mvp.startDate)} - {formatDate(mvp.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedMVPs.has(mvpId) && mvp?.description && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-footer leading-relaxed">{mvp.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          {expandedMVPs.has(mvpId) && (
            <div className="p-4 bg-white dark:bg-gray-800/30">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-hero">
                  Tasks & Components
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-footer bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded">
                  {mvp.tasks?.length || 0} task{mvp.tasks?.length !== 1 ? 's' : ''}
                </span>
              </div>

              {!mvp?.tasks || mvp.tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <p className="font-footer">No tasks added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mvp.tasks.filter(t => t).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/70 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-150"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white font-hero mb-1.5">
                            {task?.name || 'Unnamed Task'}
                          </h5>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-footer">Component:</span>
                              <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold font-footer">
                                {task?.component || 'N/A'}
                              </span>
                            </div>
                            {task.assignee && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-footer">Assignee:</span>
                                <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold font-footer">
                                  {task.assignee}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          className={cn(
                            'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded border shrink-0',
                            getStatusColor(task?.status || 'to_do')
                          )}
                        >
                          {(task?.status || 'to_do')?.replace('_', ' ').toUpperCase() || 'TO DO'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-footer">Start Date</span>
                          <p className="text-xs text-gray-900 dark:text-gray-200 font-semibold font-footer mt-0.5">
                            {formatDate(task?.startDate || '')}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-footer">End Date</span>
                          <p className="text-xs text-gray-900 dark:text-gray-200 font-semibold font-footer mt-0.5">
                            {formatDate(task?.endDate || '')}
                          </p>
                        </div>
                      </div>
                      
                      {task.description && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-footer mb-1.5 block">Description</span>
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-footer leading-relaxed">{task.description}</p>
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


