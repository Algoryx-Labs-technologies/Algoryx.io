import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

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

interface TimelineManagerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TimelineManager({ value, onChange, disabled = false }: TimelineManagerProps) {
  const [timelineData, setTimelineData] = useState<TimelineData>({ mvps: [] });
  const [expandedMVPs, setExpandedMVPs] = useState<Set<string>>(new Set());
  const isInternalUpdate = useRef(false);

  // Parse JSON value on mount and when value changes (from parent)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (value) {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed && typeof parsed === 'object') {
          if (parsed.mvps && Array.isArray(parsed.mvps)) {
            // Ensure all MVPs have a status field, default to 'pending' if missing
            const mvpsWithStatus = parsed.mvps.map((mvp: MVP) => ({
              ...mvp,
              status: mvp.status || 'pending',
            }));
            setTimelineData({ mvps: mvpsWithStatus });
            // Expand all MVPs by default
            setExpandedMVPs(new Set(mvpsWithStatus.map((mvp: MVP) => mvp.id)));
          } else {
            // Legacy format or empty - initialize with empty mvps
            setTimelineData({ mvps: [] });
          }
        } else {
          setTimelineData({ mvps: [] });
        }
      } catch {
        setTimelineData({ mvps: [] });
      }
    } else {
      setTimelineData({ mvps: [] });
    }
  }, [value]);

  // Helper to update timeline data and notify parent
  const updateTimelineData = (newData: TimelineData) => {
    isInternalUpdate.current = true;
    setTimelineData(newData);
    const jsonString = JSON.stringify(newData, null, 2);
    onChange(jsonString);
  };

  const generateId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMVP = () => {
    const newMVP: MVP = {
      id: generateId(),
      name: '',
      description: '',
      status: 'pending',
      startDate: '',
      endDate: '',
      tasks: [],
    };
    const newData = {
      ...timelineData,
      mvps: [...timelineData.mvps, newMVP],
    };
    updateTimelineData(newData);
    setExpandedMVPs(new Set([...expandedMVPs, newMVP.id]));
  };

  const removeMVP = (mvpId: string) => {
    const newData = {
      ...timelineData,
      mvps: timelineData.mvps.filter((mvp) => mvp.id !== mvpId),
    };
    updateTimelineData(newData);
    const newExpanded = new Set(expandedMVPs);
    newExpanded.delete(mvpId);
    setExpandedMVPs(newExpanded);
  };

  const updateMVP = (mvpId: string, updates: Partial<MVP>) => {
    const newData = {
      ...timelineData,
      mvps: timelineData.mvps.map((mvp) =>
        mvp.id === mvpId ? { ...mvp, ...updates } : mvp
      ),
    };
    updateTimelineData(newData);
  };

  const addTask = (mvpId: string) => {
    const newTask: Task = {
      id: generateId(),
      name: '',
      component: '',
      status: 'to_do',
      startDate: '',
      endDate: '',
      assignee: '',
      description: '',
    };
    updateMVP(mvpId, {
      tasks: [...(timelineData.mvps.find((m) => m.id === mvpId)?.tasks || []), newTask],
    });
  };

  const removeTask = (mvpId: string, taskId: string) => {
    const mvp = timelineData.mvps.find((m) => m.id === mvpId);
    if (mvp) {
      updateMVP(mvpId, {
        tasks: mvp.tasks.filter((task) => task.id !== taskId),
      });
    }
  };

  const updateTask = (mvpId: string, taskId: string, updates: Partial<Task>) => {
    const mvp = timelineData.mvps.find((m) => m.id === mvpId);
    if (mvp) {
      updateMVP(mvpId, {
        tasks: mvp.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      });
    }
  };

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
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'done':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getMVPStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">Project Timeline</Label>
        <Button
          type="button"
          onClick={addMVP}
          disabled={disabled}
          size="sm"
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add MVP
        </Button>
      </div>

      {timelineData.mvps.length === 0 ? (
        <div className="text-center py-8 text-gray-400 border border-dashed border-white/10 rounded-md">
          <p>No MVPs added yet. Click "Add MVP" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timelineData.mvps.map((mvp) => (
            <div
              key={mvp.id}
              className="border border-white/10 rounded-lg bg-slate-800/30 overflow-hidden"
            >
              {/* MVP Header */}
              <div className="p-4 bg-slate-800/50 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMVP(mvp.id)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      {expandedMVPs.has(mvp.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={mvp.name}
                        onChange={(e) => updateMVP(mvp.id, { name: e.target.value })}
                        disabled={disabled}
                        placeholder="MVP Name"
                        className="bg-slate-700/50 border-white/10 text-white"
                      />
                      <select
                        value={mvp.status}
                        onChange={(e) =>
                          updateMVP(mvp.id, {
                            status: e.target.value as MVP['status'],
                          })
                        }
                        disabled={disabled}
                        className={`rounded-md border px-3 py-2 text-sm font-medium ${getMVPStatusColor(
                          mvp.status
                        )} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={mvp.startDate}
                          onChange={(e) => updateMVP(mvp.id, { startDate: e.target.value })}
                          disabled={disabled}
                          className="bg-slate-700/50 border-white/10 text-white flex-1"
                        />
                        <Input
                          type="date"
                          value={mvp.endDate}
                          onChange={(e) => updateMVP(mvp.id, { endDate: e.target.value })}
                          disabled={disabled}
                          className="bg-slate-700/50 border-white/10 text-white flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMVP(mvp.id)}
                    disabled={disabled}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {expandedMVPs.has(mvp.id) && (
                  <div className="mt-3">
                    <Input
                      value={mvp.description || ''}
                      onChange={(e) => updateMVP(mvp.id, { description: e.target.value })}
                      disabled={disabled}
                      placeholder="MVP Description (optional)"
                      className="bg-slate-700/50 border-white/10 text-white"
                    />
                  </div>
                )}
              </div>

              {/* Tasks */}
              {expandedMVPs.has(mvp.id) && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-400 text-sm">Tasks & Components</Label>
                    <Button
                      type="button"
                      onClick={() => addTask(mvp.id)}
                      disabled={disabled}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Task
                    </Button>
                  </div>

                  {mvp.tasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm border border-dashed border-white/5 rounded-md">
                      No tasks added. Click "Add Task" to add one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mvp.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-slate-900/50 border border-white/5 rounded-md space-y-3"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={task.name}
                              onChange={(e) => updateTask(mvp.id, task.id, { name: e.target.value })}
                              disabled={disabled}
                              placeholder="Task Name"
                              className="bg-slate-800/50 border-white/10 text-white"
                            />
                            <Input
                              value={task.component}
                              onChange={(e) => updateTask(mvp.id, task.id, { component: e.target.value })}
                              disabled={disabled}
                              placeholder="Component Name"
                              className="bg-slate-800/50 border-white/10 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTask(mvp.id, task.id, {
                                  status: e.target.value as Task['status'],
                                })
                              }
                              disabled={disabled}
                              className={`rounded-md border px-3 py-2 text-sm font-medium ${getStatusColor(
                                task.status
                              )} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <option value="to_do">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="done">Done</option>
                              <option value="blocked">Blocked</option>
                            </select>
                            <Input
                              type="date"
                              value={task.startDate}
                              onChange={(e) => updateTask(mvp.id, task.id, { startDate: e.target.value })}
                              disabled={disabled}
                              placeholder="Start Date"
                              className="bg-slate-800/50 border-white/10 text-white"
                            />
                            <Input
                              type="date"
                              value={task.endDate}
                              onChange={(e) => updateTask(mvp.id, task.id, { endDate: e.target.value })}
                              disabled={disabled}
                              placeholder="End Date"
                              className="bg-slate-800/50 border-white/10 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={task.assignee || ''}
                              onChange={(e) => updateTask(mvp.id, task.id, { assignee: e.target.value })}
                              disabled={disabled}
                              placeholder="Assignee (optional)"
                              className="bg-slate-800/50 border-white/10 text-white"
                            />
                            <div className="flex gap-2">
                              <Input
                                value={task.description || ''}
                                onChange={(e) =>
                                  updateTask(mvp.id, task.id, { description: e.target.value })
                                }
                                disabled={disabled}
                                placeholder="Description (optional)"
                                className="bg-slate-800/50 border-white/10 text-white flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTask(mvp.id, task.id)}
                                disabled={disabled}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

