import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { handleApiRequest } from '../action-center/utils';

export function QnAPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [qnaForm, setQnaForm] = useState({
    qnaId: '',
    answer: '',
    isAccepted: false,
  });

  const resetForm = () => {
    setQnaForm({ qnaId: '', answer: '', isAccepted: false });
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
              <h1 className="text-3xl font-bold text-white font-hero">QnA</h1>
              <p className="text-gray-400 mt-1 font-footer">Reply to QnA questions</p>
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
                <HelpCircle className="h-5 w-5 text-blue-400" />
                Reply to QnA
              </CardTitle>
              <CardDescription>Answer a QnA question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">QnA ID *</Label>
                <Input
                  value={qnaForm.qnaId}
                  onChange={(e) => setQnaForm({ ...qnaForm, qnaId: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter QnA ID"
                />
              </div>
              <div>
                <Label className="text-gray-300">Answer *</Label>
                <textarea
                  value={qnaForm.answer}
                  onChange={(e) => setQnaForm({ ...qnaForm, answer: e.target.value })}
                  className="w-full min-h-[120px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="Enter your answer"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={qnaForm.isAccepted}
                  onChange={(e) => setQnaForm({ ...qnaForm, isAccepted: e.target.checked })}
                  className="rounded"
                />
                <Label className="text-gray-300">Mark as accepted answer</Label>
              </div>
              <Button
                onClick={() => handleApiRequest(`/qna/${qnaForm.qnaId}/reply`, 'POST', qnaForm, setLoading, setMessage, 'Reply to QnA', resetForm)}
                disabled={loading === 'Reply to QnA' || !qnaForm.qnaId || !qnaForm.answer}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                {loading === 'Reply to QnA' ? 'Replying...' : 'Reply to QnA'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
