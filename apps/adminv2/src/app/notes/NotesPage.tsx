import { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  StickyNote,
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
import type { Note } from './types';

interface NoteForm {
  title: string;
  content: string;
}

const emptyNoteForm: NoteForm = { title: '', content: '' };

const accentBtn = 'bg-blue-600 hover:bg-blue-700';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form, setForm] = useState<NoteForm>(emptyNoteForm);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }

    const query = params.toString();
    const endpoint = query ? `/notes?${query}` : '/notes';
    const response = await apiClient.get<Note[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load notes');
      setNotes([]);
      setLoading(false);
      return;
    }

    setNotes(response.data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  const openCreateModal = () => {
    setEditingNote(null);
    setForm(emptyNoteForm);
    setShowModal(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setForm(emptyNoteForm);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
    };

    const response = editingNote
      ? await apiClient.patch<Note>(`/notes/${editingNote.id}`, payload)
      : await apiClient.post<Note>('/notes', payload);

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to save note');
      return;
    }

    closeModal();
    await fetchNotes();
  };

  const handleDeleteNote = async (noteId: string) => {
    const response = await apiClient.delete(`/notes/${noteId}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete note');
      return;
    }

    await fetchNotes();
  };

  return (
    <AppLayout
      title="Notes"
      description="Miscellaneous notes and reminders for the admin team."
    >
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by title or content…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 dark:bg-slate-800 border-white/10 font-footer"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={fetchNotes}
            disabled={loading}
            className="font-footer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            onClick={openCreateModal}
            className={cn(accentBtn, 'font-footer')}
          >
            <Plus className="h-4 w-4" />
            Add note
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-hero">
            <StickyNote className="h-5 w-5 text-blue-400" />
            Notes ({notes.length})
          </CardTitle>
          <CardDescription className="font-footer">
            Quick reminders and miscellaneous notes
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
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-footer">
              <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet</p>
              <p className="text-sm mt-2 text-gray-500">
                Click Add note to create a reminder.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-slate-800/40 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold font-footer">{note.title}</p>
                    <p className="text-sm text-gray-300 font-footer mt-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-500 font-footer mt-2">
                      Updated {formatDate(note.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(note)}
                      className="text-gray-500 hover:text-blue-400"
                      title="Edit note"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-500 hover:text-red-400"
                      title="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-md w-full">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">
                  {editingNote ? 'Edit note' : 'Add note'}
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
              <form onSubmit={handleSaveNote} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label htmlFor="note-title" className="text-gray-300">
                    Title *
                  </Label>
                  <Input
                    id="note-title"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="e.g. Follow up with client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note-content" className="text-gray-300">
                    Content *
                  </Label>
                  <textarea
                    id="note-content"
                    required
                    rows={5}
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className={cn(
                      'placeholder:text-muted-foreground dark:bg-slate-800 border-white/10 flex w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none md:text-sm resize-y min-h-[120px]',
                      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    )}
                    placeholder="Write your reminder or note here…"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="font-footer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className={cn(accentBtn, 'font-footer')}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : editingNote ? (
                      'Save changes'
                    ) : (
                      'Add note'
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
