import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { handleApiRequest } from '../action-center/utils';

export function CommunityPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [communityForm, setCommunityForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPinned: false,
  });

  const resetForm = () => {
    setCommunityForm({ title: '', content: '', category: '', tags: '', isPinned: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-hero">Community</h1>
              <p className="text-gray-400 mt-1 font-footer">Post community data and announcements</p>
            </div>
          </div>

          {message && (
            <div className={cn(
              "p-4 rounded-lg flex items-center gap-2",
              message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'
            )}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Post Community Data
              </CardTitle>
              <CardDescription>Create a community post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Title *</Label>
                <Input
                  value={communityForm.title}
                  onChange={(e) => setCommunityForm({ ...communityForm, title: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Post title"
                />
              </div>
              <div>
                <Label className="text-gray-300">Content *</Label>
                <textarea
                  value={communityForm.content}
                  onChange={(e) => setCommunityForm({ ...communityForm, content: e.target.value })}
                  className="w-full min-h-[150px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="Post content"
                />
              </div>
              <div>
                <Label className="text-gray-300">Category</Label>
                <Input
                  value={communityForm.category}
                  onChange={(e) => setCommunityForm({ ...communityForm, category: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="e.g., Announcement, Discussion"
                />
              </div>
              <div>
                <Label className="text-gray-300">Tags (comma-separated)</Label>
                <Input
                  value={communityForm.tags}
                  onChange={(e) => setCommunityForm({ ...communityForm, tags: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={communityForm.isPinned}
                  onChange={(e) => setCommunityForm({ ...communityForm, isPinned: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-gray-300">Pin this post</Label>
              </div>
              <Button
                onClick={() => handleApiRequest('/community', 'POST', {
                  ...communityForm,
                  tags: communityForm.tags.split(',').map(t => t.trim()).filter(t => t),
                }, setLoading, setMessage, 'Create Community Post', resetForm)}
                disabled={loading === 'Create Community Post' || !communityForm.title || !communityForm.content}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                {loading === 'Create Community Post' ? 'Creating...' : 'Post Community Data'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
