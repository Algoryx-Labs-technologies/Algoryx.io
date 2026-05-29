import { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
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
import type { TeamMember } from './types';

interface MemberForm {
  name: string;
  email: string;
  role: string;
}

const emptyMemberForm: MemberForm = { name: '', email: '', role: '' };

const accentBtn = 'bg-blue-600 hover:bg-blue-700';

export function TeamsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<MemberForm>(emptyMemberForm);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }

    const query = params.toString();
    const endpoint = query ? `/teams?${query}` : '/teams';
    const response = await apiClient.get<TeamMember[]>(endpoint);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to load team members');
      setMembers([]);
      setLoading(false);
      return;
    }

    setMembers(response.data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const response = await apiClient.post<TeamMember>('/teams', {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
    });

    setSaving(false);

    if (!response.success || !response.data) {
      setError(response.error || 'Failed to add member');
      return;
    }

    setShowAddModal(false);
    setForm(emptyMemberForm);
    await fetchMembers();
  };

  const handleDeleteMember = async (memberId: string) => {
    const response = await apiClient.delete(`/teams/${memberId}`);

    if (!response.success) {
      setError(response.error || 'Failed to remove member');
      return;
    }

    await fetchMembers();
  };

  return (
    <AppLayout
      title="Teams"
      description="Team members — name, email, and role."
    >
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, email, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 dark:bg-slate-800 border-white/10 font-footer"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={fetchMembers}
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
            onClick={() => {
              setShowAddModal(true);
              setForm(emptyMemberForm);
            }}
            className={cn(accentBtn, 'font-footer')}
          >
            <Plus className="h-4 w-4" />
            Add member
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 font-hero">
            <Users className="h-5 w-5 text-blue-400" />
            Team members ({members.length})
          </CardTitle>
          <CardDescription className="font-footer">
            Add people directly with name, email, and role
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
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-footer">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No members yet</p>
              <p className="text-sm mt-2 text-gray-500">
                Click Add member to add someone to the team.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-slate-800/40 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-white font-semibold font-footer">{member.name}</p>
                    <p className="text-sm text-gray-400 font-footer flex items-center gap-2 mt-1">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </p>
                    <p className="text-sm text-blue-300/90 font-footer mt-1">{member.role}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-gray-500 hover:text-red-400 shrink-0"
                    title="Remove member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-white/10 max-w-md w-full">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white font-hero">Add member</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    setForm(emptyMemberForm);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleAddMember} className="space-y-4 font-footer">
                <div className="space-y-2">
                  <Label htmlFor="member-name" className="text-gray-300">
                    Name *
                  </Label>
                  <Input
                    id="member-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email" className="text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="member-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role" className="text-gray-300">
                    Role *
                  </Label>
                  <Input
                    id="member-role"
                    required
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="dark:bg-slate-800 border-white/10"
                    placeholder="e.g. Developer, PM"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setForm(emptyMemberForm);
                    }}
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
                    ) : (
                      'Add member'
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
