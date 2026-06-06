import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  Trash2,
  User,
  X,
  MessageCircleHeart,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../components/ui/utils';
import { apiClient } from '@/lib/api';
import type { FeedbackItem } from './types';
import { SOURCE_LABELS, TYPE_LABELS, type FeedbackType } from './types';

function ratingStars(rating?: number) {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            'h-3.5 w-3.5',
            value <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600',
          )}
        />
      ))}
    </div>
  );
}

export function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [search, setSearch] = useState('');

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('source', 'landing_feedback');
    if (search.trim()) {
      params.set('search', search.trim());
    }

    const response = await apiClient.get<FeedbackItem[]>(`/feedback?${params.toString()}`);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load feedback');
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(response.data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedback();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchFeedback]);

  const handleDelete = async (id: string) => {
    const response = await apiClient.delete(`/feedback/${id}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete feedback');
      return;
    }

    if (selected?.id === id) {
      setSelected(null);
    }

    await fetchFeedback();
  };

  return (
    <AppLayout
      title="Feedback"
      description="User feedback submitted from the Algoryx landing site footer."
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, message…"
            className="pl-9 dark:bg-slate-900/60 border-white/10"
          />
        </div>
        <Button
          type="button"
          onClick={fetchFeedback}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 font-footer shrink-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-hero">
            <MessageCircleHeart className="h-5 w-5 text-cyan-400" />
            Landing feedback ({items.length})
          </CardTitle>
          <CardDescription className="font-footer">
            Submissions from the Share Feedback dialog on algoryx.io
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
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-footer">
              <MessageCircleHeart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No feedback yet</p>
              <p className="text-sm mt-2 text-gray-500">
                Submissions appear when visitors use Share Feedback in the landing footer.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="w-full text-left pr-10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {SOURCE_LABELS[item.source] ?? item.source}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase">
                          {TYPE_LABELS[item.type]}
                        </span>
                        {ratingStars(item.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400 font-footer">
                      <User className="h-3 w-3 shrink-0" />
                      <span>{item.name}</span>
                      <span className="text-gray-600">·</span>
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.email}</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2 font-footer">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-white/10 pt-3 mt-3 font-footer">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{format(new Date(item.createdAt), 'PPp')}</span>
                    </div>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-400"
                    title="Delete feedback"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-white flex items-center gap-2 font-hero">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    Feedback details
                  </CardTitle>
                  <CardDescription className="font-footer">
                    {SOURCE_LABELS[selected.source]} · {TYPE_LABELS[selected.type as FeedbackType]}
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => setSelected(null)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 mt-4 font-footer">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                  {TYPE_LABELS[selected.type as FeedbackType]}
                </span>
                {selected.rating && (
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>Rating:</span>
                    {ratingStars(selected.rating)}
                  </div>
                )}
              </div>

              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-400" />
                  Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2 font-medium">{selected.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-2 font-medium">{selected.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                  Feedback
                </h3>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 text-sm text-gray-400 space-y-1">
                <p>
                  Submitted:{' '}
                  <span className="text-white">
                    {format(new Date(selected.createdAt), 'PPpp')}
                  </span>
                </p>
                {selected.client.referer && (
                  <p className="truncate">
                    Referer: <span className="text-gray-300">{selected.client.referer}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDelete(selected.id)}
                  className="font-footer text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
