import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  ImagePlus,
  Loader2,
  Pencil,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import type { PortfolioCategory, PortfolioProject, UploadedPortfolioImage } from './types';
import { PORTFOLIO_CATEGORY_LABELS } from './types';

interface ProjectForm {
  title: string;
  description: string;
  category: PortfolioCategory;
  imageUrl: string;
  imagePublicId: string;
  techStack: string;
  clientName: string;
  isPublished: boolean;
}

const CATEGORIES: PortfolioCategory[] = ['recent', 'ongoing', 'past'];

const emptyForm = (category: PortfolioCategory = 'recent'): ProjectForm => ({
  title: '',
  description: '',
  category,
  imageUrl: '',
  imagePublicId: '',
  techStack: '',
  clientName: '',
  isPublished: true,
});

const accentBtn = 'bg-blue-600 hover:bg-blue-700';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (activeCategory !== 'all') {
      params.set('category', activeCategory);
    }

    const query = params.toString();
    const endpoint = query ? `/portfolio?${query}` : '/portfolio';
    const response = await apiClient.get<PortfolioProject[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load portfolio projects');
      setProjects([]);
      setLoading(false);
      return;
    }

    setProjects(response.data);
    setLoading(false);
  }, [search, activeCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  const openCreateModal = () => {
    const category = activeCategory === 'all' ? 'recent' : activeCategory;
    setEditingProject(null);
    setForm(emptyForm(category));
    setShowModal(true);
  };

  const openEditModal = (project: PortfolioProject) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description ?? '',
      category: project.category,
      imageUrl: project.imageUrl,
      imagePublicId: project.imagePublicId ?? '',
      techStack: project.techStack.join(', '),
      clientName: project.clientName ?? '',
      isPublished: project.isPublished,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setForm(emptyForm());
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.uploadFormData<UploadedPortfolioImage>(
      '/portfolio/upload-image',
      formData,
    );

    setUploading(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to upload image');
      return;
    }

    setForm((current) => ({
      ...current,
      imageUrl: response.data!.url,
      imagePublicId: response.data!.publicId,
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.imageUrl.trim()) {
      setError('Please upload a project image');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      imagePublicId: form.imagePublicId.trim() || undefined,
      techStack: form.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      clientName: form.clientName.trim() || undefined,
      isPublished: form.isPublished,
    };

    const response = editingProject
      ? await apiClient.patch<PortfolioProject>(`/portfolio/${editingProject.id}`, payload)
      : await apiClient.post<PortfolioProject>('/portfolio', payload);

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to save project');
      return;
    }

    closeModal();
    await fetchProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    const response = await apiClient.delete(`/portfolio/${projectId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete project');
      return;
    }

    await fetchProjects();
  };

  return (
    <AppLayout
      title="Portfolio"
      description="Manage recent, ongoing, and selected past projects for the landing page."
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('all')}
            className={cn('font-footer', activeCategory === 'all' && accentBtn)}
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              type="button"
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={cn('font-footer', activeCategory === category && accentBtn)}
            >
              {PORTFOLIO_CATEGORY_LABELS[category]}
            </Button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by title, client, or tech…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 dark:bg-slate-800 border-white/10 font-footer"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={fetchProjects}
              disabled={loading}
              className="font-footer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button type="button" onClick={openCreateModal} className={cn(accentBtn, 'font-footer')}>
              <Plus className="h-4 w-4" />
              Add project
            </Button>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-hero">
            <Briefcase className="h-5 w-5 text-blue-400" />
            Portfolio ({projects.length})
          </CardTitle>
          <CardDescription className="font-footer">
            Published projects appear on the landing page portfolio section
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 font-footer">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-footer">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No portfolio projects yet</p>
              <p className="text-sm mt-2 text-gray-500">
                Add recent, ongoing, or past projects with Cloudinary images.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-slate-800/40"
                >
                  <div className="aspect-video overflow-hidden bg-slate-900/60">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white font-semibold font-footer truncate">
                          {project.title}
                        </p>
                        <p className="text-xs text-cyan-300 font-footer mt-1">
                          {PORTFOLIO_CATEGORY_LABELS[project.category]}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                          project.isPublished
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
                        )}
                      >
                        {project.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    {project.clientName && (
                      <p className="text-sm text-gray-400 font-footer">{project.clientName}</p>
                    )}

                    {project.description && (
                      <p className="text-sm text-gray-300 font-footer line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[11px] text-gray-300 font-footer"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-gray-500 font-footer">
                        Updated {formatDate(project.updatedAt)}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(project)}
                          className="text-gray-500 hover:text-blue-400"
                          title="Edit project"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-gray-500 hover:text-red-400"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-lg w-full">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">
                  {editingProject ? 'Edit project' : 'Add project'}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleSaveProject} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label className="text-gray-300">Project image *</Label>
                  <div className="rounded-lg border border-dashed border-white/15 bg-slate-900/50 p-4">
                    {form.imageUrl ? (
                      <div className="space-y-3">
                        <img
                          src={form.imageUrl}
                          alt="Project preview"
                          className="h-40 w-full rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="font-footer"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading…
                            </>
                          ) : (
                            <>
                              <ImagePlus className="h-4 w-4" />
                              Replace image
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex w-full flex-col items-center justify-center gap-2 py-8 text-gray-400 hover:text-white transition-colors"
                      >
                        {uploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        ) : (
                          <ImagePlus className="h-8 w-8" />
                        )}
                        <span className="text-sm">
                          {uploading ? 'Uploading to Cloudinary…' : 'Click to upload image'}
                        </span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleImageUpload(file);
                        }
                        e.target.value = '';
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-title" className="text-gray-300">
                    Title *
                  </Label>
                  <Input
                    id="portfolio-title"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="e.g. AI Trading Dashboard"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-category" className="text-gray-300">
                    Category *
                  </Label>
                  <select
                    id="portfolio-category"
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value as PortfolioCategory }))
                    }
                    className="flex h-9 w-full rounded-md border border-white/10 bg-slate-800 px-3 py-1 text-sm text-white outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {PORTFOLIO_CATEGORY_LABELS[category]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-client" className="text-gray-300">
                    Client name
                  </Label>
                  <Input
                    id="portfolio-client"
                    value={form.clientName}
                    onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="Optional client or company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-description" className="text-gray-300">
                    Description
                  </Label>
                  <textarea
                    id="portfolio-description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={cn(
                      'placeholder:text-muted-foreground dark:bg-slate-800 border-white/10 flex w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none md:text-sm resize-y min-h-[88px]',
                      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    )}
                    placeholder="Short summary for the landing page"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-tech" className="text-gray-300">
                    Tech stack
                  </Label>
                  <Input
                    id="portfolio-tech"
                    value={form.techStack}
                    onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Visibility</Label>
                  <label className="flex h-9 items-center gap-2 rounded-md border border-white/10 bg-slate-800 px-3 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isPublished: e.target.checked }))
                      }
                      className="rounded border-white/20"
                    />
                    Published on landing
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeModal} className="font-footer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || uploading} className={cn(accentBtn, 'font-footer')}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : editingProject ? (
                      'Save changes'
                    ) : (
                      'Add project'
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
