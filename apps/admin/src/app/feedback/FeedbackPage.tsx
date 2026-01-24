import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Star, CheckCircle2, XCircle } from 'lucide-react';
import { handleApiRequest } from '../action-center/utils';

export function FeedbackPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [feedbackForm, setFeedbackForm] = useState({
    feedbackId: '',
    isTop: true,
  });

  const resetForm = () => {
    setFeedbackForm({ feedbackId: '', isTop: true });
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
              <h1 className="text-3xl font-bold text-white font-hero">Feedback</h1>
              <p className="text-gray-400 mt-1 font-footer">Select top feedback</p>
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
                <Star className="h-5 w-5 text-blue-400" />
                Select Top Feedback
              </CardTitle>
              <CardDescription>Mark feedback as top feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Feedback ID *</Label>
                <Input
                  value={feedbackForm.feedbackId}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackId: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter feedback ID"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={feedbackForm.isTop}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, isTop: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-gray-300">Mark as top feedback</Label>
              </div>
              <Button
                onClick={() => handleApiRequest(`/feedback/${feedbackForm.feedbackId}/top`, 'POST', { isTop: feedbackForm.isTop }, setLoading, setMessage, 'Select Top Feedback', resetForm)}
                disabled={loading === 'Select Top Feedback' || !feedbackForm.feedbackId}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                {loading === 'Select Top Feedback' ? 'Updating...' : 'Select Top Feedback'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
