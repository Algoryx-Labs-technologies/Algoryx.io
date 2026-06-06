import { useCallback, useEffect, useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Mail,
  Loader2,
  Calendar,
  Phone,
  Building,
  MessageSquare,
  User,
  X,
  FileText,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { apiClient } from '@/lib/api';

export interface LandingRequirement {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource: string;
  createdAt: string;
  updatedAt: string;
}

const SOURCE_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  google: 'Google',
  friend: 'Friend / Referral',
  youtube: 'YouTube',
  community: 'Community',
  other: 'Other',
};

function formatSource(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

export function RequirementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<LandingRequirement[]>([]);
  const [selected, setSelected] = useState<LandingRequirement | null>(null);

  const fetchRequirements = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiClient.get<LandingRequirement[]>('/landing-requirements');

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load requirements');
      setRequirements([]);
      setLoading(false);
      return;
    }

    setRequirements(response.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  const handleDeleteRequirement = async (id: string) => {
    const response = await apiClient.delete(`/landing-requirements/${id}`);

    if (!response.success) {
      setError(response.error || 'Failed to delete requirement');
      return;
    }

    if (selected?.id === id) {
      setSelected(null);
    }

    await fetchRequirements();
  };

  return (
    <AppLayout
      title="Requirements"
      description="Submissions from the Algoryx landing page (Work with Algoryx Labs)."
    >
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          onClick={fetchRequirements}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 font-footer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-hero">
            <FileText className="h-5 w-5 text-blue-400" />
            Landing requirements ({requirements.length})
          </CardTitle>
          <CardDescription className="font-footer">
            Contact form enquiries stored via API v2
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
          ) : requirements.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-footer">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No requirements submitted yet</p>
              <p className="text-sm mt-2 text-gray-500">
                New entries appear when visitors submit the form on the landing site.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requirements.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="w-full text-left pr-10"
                  >
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-4 w-4 text-blue-400 shrink-0" />
                    <h3 className="text-white font-semibold font-footer">{item.fullName}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400 font-footer">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span>{item.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span>{item.phone}</span>
                    </div>
                    {item.companyOrg && (
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 shrink-0" />
                        <span>{item.companyOrg}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Source: {formatSource(item.haveSource)}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500 font-footer">Requirement</span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 font-footer">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-white/10 pt-3 mt-3 font-footer">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRequirement(item.id)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-400"
                    title="Delete requirement"
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
                    <FileText className="h-5 w-5 text-blue-400" />
                    Requirement details
                  </CardTitle>
                  <CardDescription className="font-footer">Landing page submission</CardDescription>
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
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Full name:</span>
                    <span className="text-white ml-2 font-medium">{selected.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white ml-2 font-medium">{selected.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white ml-2 font-medium">{selected.phone}</span>
                  </div>
                  {selected.companyOrg && (
                    <div>
                      <span className="text-gray-400">Company:</span>
                      <span className="text-white ml-2 font-medium">{selected.companyOrg}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">How they heard about us:</span>
                    <span className="text-white ml-2 font-medium">
                      {formatSource(selected.haveSource)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  Requirement
                </h3>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>
                    Submitted:{' '}
                    <span className="text-white">
                      {new Date(selected.createdAt).toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDeleteRequirement(selected.id)}
                  className="font-footer text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete requirement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
