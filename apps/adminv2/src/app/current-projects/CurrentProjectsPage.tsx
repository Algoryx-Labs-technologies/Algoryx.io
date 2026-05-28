import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Calendar,
  Grid3X3,
  LayoutList,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import {
  PROJECT_STAGES,
  type AdminProject,
  type ProjectStageId,
  type StageFilter,
  type TeamMember,
} from './types';

type ViewMode = 'board' | 'list';

interface AddProjectForm {
  projectName: string;
  clientName: string;
  clientEmail: string;
  description: string;
  budget: string;
  deadline: string;
}

const emptyForm: AddProjectForm = {
  projectName: '',
  clientName: '',
  clientEmail: '',
  description: '',
  budget: '',
  deadline: '',
};

const accentBtn = 'bg-blue-600 hover:bg-blue-700';
const accentActive = 'bg-blue-600 text-white';
const accentRing = 'ring-blue-400/50';
const accentSpinner = 'text-blue-500';

function stageLabel(stage: ProjectStageId): string {
  return PROJECT_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

function formatDeadline(iso?: string): string | null {
  if (!iso) return null;
  try {
    return format(new Date(iso), 'MMM d, yyyy');
  } catch {
    return null;
  }
}

export function CurrentProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddProjectForm>(emptyForm);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (stageFilter !== 'all') {
      params.set('stage', stageFilter);
    }

    const query = params.toString();
    const endpoint = query ? `/admin-projects?${query}` : '/admin-projects';
    const response = await apiClient.get<AdminProject[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load projects');
      setProjects([]);
      setLoading(false);
      return;
    }

    setProjects(response.data);
    setLoading(false);
  }, [search, stageFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  useEffect(() => {
    if (!showAddModal) {
      return;
    }

    const fetchTeams = async () => {
      setTeamsLoading(true);
      const response = await apiClient.get<TeamMember[]>('/teams');
      if (response.success && response.data) {
        setTeamMembers(response.data);
      } else {
        setTeamMembers([]);
      }
      setTeamsLoading(false);
    };

    void fetchTeams();
  }, [showAddModal]);

  const resetAddModal = () => {
    setShowAddModal(false);
    setForm(emptyForm);
    setSelectedTeamIds([]);
  };

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const projectsByStage = useMemo(() => {
    const grouped = Object.fromEntries(
      PROJECT_STAGES.map((s) => [s.id, [] as AdminProject[]]),
    ) as Record<ProjectStageId, AdminProject[]>;

    for (const project of projects) {
      if (grouped[project.stage]) {
        grouped[project.stage].push(project);
      }
    }

    return grouped;
  }, [projects]);

  const visibleStages = useMemo(
    () =>
      PROJECT_STAGES.filter(
        (stage) => stageFilter === 'all' || stageFilter === stage.id,
      ),
    [stageFilter],
  );

  const boardGridClass = cn(
    'grid gap-4 w-full min-h-[420px] pb-4',
    visibleStages.length === 1 && 'grid-cols-1',
    visibleStages.length === 2 && 'grid-cols-1 md:grid-cols-2',
    visibleStages.length === 3 && 'grid-cols-1 md:grid-cols-3',
    visibleStages.length >= 4 && 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  );

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const response = await apiClient.post<AdminProject>('/admin-projects', {
      projectName: form.projectName.trim(),
      clientName: form.clientName.trim(),
      clientEmail: form.clientEmail.trim() || undefined,
      description: form.description.trim() || undefined,
      budget: form.budget.trim() || undefined,
      deadline: form.deadline.trim() || undefined,
      teamMemberIds: selectedTeamIds.length > 0 ? selectedTeamIds : undefined,
    });

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to create project');
      return;
    }

    resetAddModal();
    await fetchProjects();
  };

  const moveProjectToStage = async (projectId: string, stage: ProjectStageId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.stage === stage) {
      return;
    }

    setProjects((prev) =>
      prev.map((item) => (item.id === projectId ? { ...item, stage } : item)),
    );

    const response = await apiClient.patch<AdminProject>(`/admin-projects/${projectId}`, {
      stage,
    });

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to move project');
      await fetchProjects();
      return;
    }

    setProjects((prev) =>
      prev.map((item) => (item.id === projectId ? response.data! : item)),
    );
  };

  const handleDeleteProject = async (projectId: string) => {
    const response = await apiClient.delete(`/admin-projects/${projectId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete project');
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleDrop = (stage: ProjectStageId) => {
    if (draggedProjectId) {
      void moveProjectToStage(draggedProjectId, stage);
    }
    setDraggedProjectId(null);
  };

  const renderProjectCard = (project: AdminProject) => {
    const deadlineLabel = formatDeadline(project.deadline);

    return (
      <div
        key={project.id}
        draggable
        onDragStart={() => setDraggedProjectId(project.id)}
        onDragEnd={() => setDraggedProjectId(null)}
        className={cn(
          'rounded-xl border border-white/10 bg-white dark:bg-slate-900 shadow-sm cursor-grab active:cursor-grabbing p-4',
          draggedProjectId === project.id && `opacity-50 ring-2 ${accentRing}`,
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {project.projectCode}
          </span>
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              void handleDeleteProject(project.id);
            }}
            className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="font-semibold text-slate-900 dark:text-white text-sm">{project.projectName}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{project.clientName}</p>
        {project.clientEmail && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {project.clientEmail}
          </p>
        )}
        {project.budget && (
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">{project.budget}</p>
        )}
        {project.description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{project.description}</p>
        )}
        {(project.assignedTeam?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {project.assignedTeam!.map((member) => (
              <span
                key={member.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20"
                title={`${member.role} · ${member.email}`}
              >
                {member.name}
              </span>
            ))}
          </div>
        )}
        {deadlineLabel && (
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{deadlineLabel}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
          <span className="text-[10px] uppercase text-slate-400">{stageLabel(project.stage)}</span>
          <span className="text-[10px] text-slate-400">{relativeTime(project.updatedAt)}</span>
        </div>
      </div>
    );
  };

  return (
    <AppLayout
      title="Current projects"
      description="Manage active projects through delivery. Drag cards across stages or use filters."
    >
      <div className="w-full max-w-none rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-slate-50/50 dark:from-blue-950/30 dark:to-slate-900/80 dark:border-blue-500/10 p-4 md:p-6 min-h-[calc(100vh-12rem)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-white/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden bg-white/60 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  viewMode === 'board'
                    ? accentActive
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <Grid3X3 className="h-4 w-4" />
                Board
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? accentActive
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <LayoutList className="h-4 w-4" />
                List
              </button>
            </div>

            <Button
              type="button"
              onClick={() => setShowAddModal(true)}
              className={cn(accentBtn, 'text-white font-footer')}
            >
              <Plus className="h-4 w-4" />
              Add project
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={fetchProjects}
              disabled={loading}
              className="font-footer border-slate-200 dark:border-white/10"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setStageFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              stageFilter === 'all'
                ? accentActive
                : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
            )}
          >
            All
          </button>
          {PROJECT_STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setStageFilter(stage.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                stageFilter === stage.id
                  ? accentActive
                  : 'bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700',
              )}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 font-footer">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className={cn('h-8 w-8 animate-spin', accentSpinner)} />
          </div>
        ) : viewMode === 'board' ? (
          <div className={boardGridClass}>
            {visibleStages.map((stage) => {
              const columnProjects = projectsByStage[stage.id];

              return (
                <div
                  key={stage.id}
                  className="flex min-w-0 flex-col h-full"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(stage.id)}
                >
                  <div
                    className={cn(
                      'rounded-t-xl px-4 py-2.5 text-white text-sm font-semibold flex items-center justify-between',
                      stage.headerClass,
                    )}
                  >
                    <span>{stage.label}</span>
                    <span className="bg-black/20 rounded-full px-2 py-0.5 text-xs">
                      {columnProjects.length}
                    </span>
                  </div>
                  <div className="flex-1 rounded-b-xl bg-slate-100/80 dark:bg-slate-800/40 border border-t-0 border-slate-200 dark:border-white/10 p-3 space-y-3 min-h-[360px]">
                    {columnProjects.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-8 px-2">
                        No projects in this stage
                      </p>
                    ) : (
                      columnProjects.map((project) => renderProjectCard(project))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-center text-slate-500 py-12 font-footer">No projects found</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {project.projectCode}
                      </span>
                      <span className="text-xs text-slate-400">{relativeTime(project.updatedAt)}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{project.projectName}</p>
                    <p className="text-sm text-slate-500">{project.clientName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {PROJECT_STAGES.map((stage) => (
                      <Button
                        key={stage.id}
                        type="button"
                        size="sm"
                        variant={project.stage === stage.id ? 'default' : 'outline'}
                        disabled={project.stage === stage.id || saving}
                        onClick={() => moveProjectToStage(project.id, stage.id)}
                        className={cn(
                          'text-xs font-footer',
                          project.stage === stage.id && accentBtn,
                        )}
                      >
                        {stage.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-white/10 sticky top-0 bg-slate-900/95 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">Add project</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetAddModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleCreateProject} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label htmlFor="project-name" className="text-gray-300">
                    Project name *
                  </Label>
                  <Input
                    id="project-name"
                    required
                    value={form.projectName}
                    onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-name" className="text-gray-300">
                    Client name *
                  </Label>
                  <Input
                    id="client-name"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-email" className="text-gray-300">
                    Client email
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-budget" className="text-gray-300">
                    Budget
                  </Label>
                  <Input
                    id="project-budget"
                    placeholder="e.g. ₹2,50,000"
                    value={form.budget}
                    onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-deadline" className="text-gray-300">
                    Deadline
                  </Label>
                  <Input
                    id="project-deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description" className="text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="project-description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Assign team</Label>
                  {teamsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading team…
                    </div>
                  ) : teamMembers.length === 0 ? (
                    <p className="text-sm text-gray-500 py-1">
                      No team members yet. Add members from the Team page first.
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto rounded-lg border border-white/10 divide-y divide-white/5">
                      {teamMembers.map((member) => {
                        const checked = selectedTeamIds.includes(member.id);
                        return (
                          <label
                            key={member.id}
                            className={cn(
                              'flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors',
                              checked
                                ? 'bg-blue-500/10'
                                : 'hover:bg-slate-800/60',
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleTeamMember(member.id)}
                              className="mt-1 rounded border-white/20"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm text-white font-medium">
                                {member.name}
                              </span>
                              <span className="block text-xs text-gray-400 truncate">
                                {member.role} · {member.email}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {selectedTeamIds.length > 0 && (
                    <p className="text-xs text-blue-400">
                      {selectedTeamIds.length} member
                      {selectedTeamIds.length === 1 ? '' : 's'} selected
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAddModal}
                    className="font-footer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className={cn(accentBtn, 'font-footer')}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Create project'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
