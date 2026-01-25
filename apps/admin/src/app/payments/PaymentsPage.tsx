import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { handleApiRequest } from '../action-center/utils';

export function PaymentsPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    userId: '',
    clientId: '',
    projectId: '',
    amount: '',
    currency: 'USD',
    status: 'pending',
    paymentMethod: '',
    transactionId: '',
    description: '',
  });

  const resetForm = () => {
    setPaymentForm({
      userId: '',
      clientId: '',
      projectId: '',
      amount: '',
      currency: 'USD',
      status: 'pending',
      paymentMethod: '',
      transactionId: '',
      description: '',
    });
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
              <h1 className="text-3xl font-bold text-white font-hero">Payments</h1>
              <p className="text-gray-400 mt-1 font-footer">Record and manage payments</p>
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
                <CreditCard className="h-5 w-5 text-blue-400" />
                Post Payment
              </CardTitle>
              <CardDescription>Record a new payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Amount *</Label>
                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label className="text-gray-300">Currency</Label>
                <Input
                  value={paymentForm.currency}
                  onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="USD"
                />
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <select
                  value={paymentForm.status}
                  onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-300">Project ID (Optional)</Label>
                <Input
                  value={paymentForm.projectId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, projectId: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter project ID"
                />
              </div>
              <div>
                <Label className="text-gray-300">Transaction ID (Optional)</Label>
                <Input
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter transaction ID"
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <textarea
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="Payment description"
                />
              </div>
              <Button
                onClick={() => handleApiRequest('/payments', 'POST', { ...paymentForm, amount: parseFloat(paymentForm.amount) }, setLoading, setMessage, 'Create Payment', resetForm)}
                disabled={loading === 'Create Payment' || !paymentForm.amount}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                {loading === 'Create Payment' ? 'Creating...' : 'Post Payment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
