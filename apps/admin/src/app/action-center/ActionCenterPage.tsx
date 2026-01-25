import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  FolderKanban,
  Bell,
  CreditCard,
  MessageSquare,
  Users,
  Star,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export function ActionCenterPage() {
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    clientId: '',
    partnerId: '',
    description: '',
    readMe: '',
    techStack: '',
    clientRequirement: '',
    projectStatus: '',
    projectFeatures: '',
    priority: '',
    progressStatus: '',
    Budget: '',
    paymentStatus: '',
  });

  // Notification Form State
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info',
    userId: '',
  });

  // Payment Form State
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

  // Support Ticket Reply Form State
  const [ticketReplyForm, setTicketReplyForm] = useState({
    ticketId: '',
    reply: '',
    status: 'in_progress',
  });

  // Community Form State
  const [communityForm, setCommunityForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPinned: false,
  });

  // Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({
    feedbackId: '',
    isTop: true,
  });

  // Requirement Form State
  const [requirementForm, setRequirementForm] = useState({
    requirementId: '',
  });

  // QnA Form State
  const [qnaForm, setQnaForm] = useState({
    qnaId: '',
    answer: '',
    isAccepted: false,
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const getAuthToken = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || '';
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  };

  const handleSubmit = async (endpoint: string, method: string, data: any, actionName: string) => {
    setLoading(actionName);
    setMessage(null);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred');
      }

      showMessage('success', `${actionName} completed successfully!`);
      
      // Reset form based on action
      if (actionName.includes('Project')) {
        setProjectForm({
          clientId: '',
          partnerId: '',
          description: '',
          readMe: '',
          techStack: '',
          clientRequirement: '',
          projectStatus: '',
          projectFeatures: '',
          priority: '',
          progressStatus: '',
          Budget: '',
          paymentStatus: '',
        });
      } else if (actionName.includes('Notification')) {
        setNotificationForm({ title: '', message: '', type: 'info', userId: '' });
      } else if (actionName.includes('Payment')) {
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
      } else if (actionName.includes('Ticket')) {
        setTicketReplyForm({ ticketId: '', reply: '', status: 'in_progress' });
      } else if (actionName.includes('Community')) {
        setCommunityForm({ title: '', content: '', category: '', tags: '', isPinned: false });
      } else if (actionName.includes('Feedback')) {
        setFeedbackForm({ feedbackId: '', isTop: true });
      } else if (actionName.includes('Requirement')) {
        setRequirementForm({ requirementId: '' });
      } else if (actionName.includes('QnA')) {
        setQnaForm({ qnaId: '', answer: '', isAccepted: false });
      }
    } catch (error: any) {
      showMessage('error', error.message || `Failed to ${actionName.toLowerCase()}`);
    } finally {
      setLoading(null);
    }
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'requirements', label: 'Requirements', icon: FileText },
    { id: 'qna', label: 'QnA', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-hero">Action Center</h1>
              <p className="text-gray-400 mt-1 font-footer">Manage all admin operations</p>
            </div>
          </div>

          {/* Message Alert */}
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

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-footer",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-white"
                      : "bg-slate-800/50 border border-white/10 text-gray-400 hover:text-white hover:bg-slate-800/70"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Project */}
            {activeTab === 'projects' && (
              <>
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-blue-400" />
                      Create Project
                    </CardTitle>
                    <CardDescription>Create a new project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Client ID (Optional)</Label>
                      <Input
                        value={projectForm.clientId}
                        onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                        className="bg-slate-800/50 border-white/10 text-white mt-1"
                        placeholder="Enter client ID"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                        placeholder="Project description"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Tech Stack</Label>
                      <Input
                        value={projectForm.techStack}
                        onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                        className="bg-slate-800/50 border-white/10 text-white mt-1"
                        placeholder="e.g., React, Node.js, PostgreSQL"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Priority</Label>
                      <select
                        value={projectForm.priority}
                        onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                        className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      >
                        <option value="">Select priority</option>
                        <option value="low">Low</option>
                        <option value="mid">Mid</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Project Status</Label>
                      <select
                        value={projectForm.projectStatus}
                        onChange={(e) => setProjectForm({ ...projectForm, projectStatus: e.target.value })}
                        className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      >
                        <option value="">Select status</option>
                        <option value="not_started">Not Started</option>
                        <option value="initiated">Initiated</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Budget</Label>
                      <Input
                        value={projectForm.Budget}
                        onChange={(e) => setProjectForm({ ...projectForm, Budget: e.target.value })}
                        className="bg-slate-800/50 border-white/10 text-white mt-1"
                        placeholder="Enter budget"
                      />
                    </div>
                    <Button
                      onClick={() => handleSubmit('/projects', 'POST', projectForm, 'Create Project')}
                      disabled={loading === 'Create Project'}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {loading === 'Create Project' ? 'Creating...' : 'Create Project'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Update Project */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-blue-400" />
                      Update Project
                    </CardTitle>
                    <CardDescription>Update an existing project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Project ID *</Label>
                      <Input
                        id="update-project-id"
                        className="bg-slate-800/50 border-white/10 text-white mt-1"
                        placeholder="Enter project ID"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <textarea
                        id="update-project-description"
                        className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                        placeholder="Project description"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Project Status</Label>
                      <select
                        id="update-project-status"
                        className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      >
                        <option value="">Select status</option>
                        <option value="not_started">Not Started</option>
                        <option value="initiated">Initiated</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    <Button
                      onClick={async () => {
                        const projectId = (document.getElementById('update-project-id') as HTMLInputElement)?.value;
                        const description = (document.getElementById('update-project-description') as HTMLTextAreaElement)?.value;
                        const status = (document.getElementById('update-project-status') as HTMLSelectElement)?.value;
                        if (!projectId) {
                          showMessage('error', 'Project ID is required');
                          return;
                        }
                        await handleSubmit(`/projects/${projectId}`, 'PATCH', { description, projectStatus: status }, 'Update Project');
                      }}
                      disabled={loading === 'Update Project'}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {loading === 'Update Project' ? 'Updating...' : 'Update Project'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Delete Project */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-red-400" />
                      Delete Project
                    </CardTitle>
                    <CardDescription>Delete a project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Project ID *</Label>
                      <Input
                        id="delete-project-id"
                        className="bg-slate-800/50 border-white/10 text-white mt-1"
                        placeholder="Enter project ID"
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        const projectId = (document.getElementById('delete-project-id') as HTMLInputElement)?.value;
                        if (!projectId) {
                          showMessage('error', 'Project ID is required');
                          return;
                        }
                        if (confirm('Are you sure you want to delete this project?')) {
                          await handleSubmit(`/projects/${projectId}`, 'DELETE', {}, 'Delete Project');
                        }
                      }}
                      disabled={loading === 'Delete Project'}
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                    >
                      {loading === 'Delete Project' ? 'Deleting...' : 'Delete Project'}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-400" />
                    Post Notification
                  </CardTitle>
                  <CardDescription>Create a new notification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Title *</Label>
                    <Input
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                      className="bg-slate-800/50 border-white/10 text-white mt-1"
                      placeholder="Notification title"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Message *</Label>
                    <textarea
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                      className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      placeholder="Notification message"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Type</Label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                      className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="reminder">Reminder</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-gray-300">User ID (Optional - leave empty for all users)</Label>
                    <Input
                      value={notificationForm.userId}
                      onChange={(e) => setNotificationForm({ ...notificationForm, userId: e.target.value })}
                      className="bg-slate-800/50 border-white/10 text-white mt-1"
                      placeholder="Enter user ID"
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmit('/notifications', 'POST', notificationForm, 'Create Notification')}
                    disabled={loading === 'Create Notification' || !notificationForm.title || !notificationForm.message}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Create Notification' ? 'Creating...' : 'Post Notification'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
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
                    onClick={() => handleSubmit('/payments', 'POST', { ...paymentForm, amount: parseFloat(paymentForm.amount) }, 'Create Payment')}
                    disabled={loading === 'Create Payment' || !paymentForm.amount}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Create Payment' ? 'Creating...' : 'Post Payment'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Support Tickets */}
            {activeTab === 'tickets' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    Reply to Support Ticket
                  </CardTitle>
                  <CardDescription>Reply to a support ticket</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Ticket ID *</Label>
                    <Input
                      value={ticketReplyForm.ticketId}
                      onChange={(e) => setTicketReplyForm({ ...ticketReplyForm, ticketId: e.target.value })}
                      className="bg-slate-800/50 border-white/10 text-white mt-1"
                      placeholder="Enter ticket ID"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Reply *</Label>
                    <textarea
                      value={ticketReplyForm.reply}
                      onChange={(e) => setTicketReplyForm({ ...ticketReplyForm, reply: e.target.value })}
                      className="w-full min-h-[120px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      placeholder="Enter your reply"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Status</Label>
                    <select
                      value={ticketReplyForm.status}
                      onChange={(e) => setTicketReplyForm({ ...ticketReplyForm, status: e.target.value })}
                      className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <Button
                    onClick={() => handleSubmit(`/support-tickets/${ticketReplyForm.ticketId}/reply`, 'POST', ticketReplyForm, 'Reply to Ticket')}
                    disabled={loading === 'Reply to Ticket' || !ticketReplyForm.ticketId || !ticketReplyForm.reply}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Reply to Ticket' ? 'Replying...' : 'Reply to Ticket'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Community */}
            {activeTab === 'community' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
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
                    onClick={() => handleSubmit('/community', 'POST', {
                      ...communityForm,
                      tags: communityForm.tags.split(',').map(t => t.trim()).filter(t => t),
                    }, 'Create Community Post')}
                    disabled={loading === 'Create Community Post' || !communityForm.title || !communityForm.content}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Create Community Post' ? 'Creating...' : 'Post Community Data'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Feedback */}
            {activeTab === 'feedback' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
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
                    onClick={() => handleSubmit(`/feedback/${feedbackForm.feedbackId}/top`, 'POST', { isTop: feedbackForm.isTop }, 'Select Top Feedback')}
                    disabled={loading === 'Select Top Feedback' || !feedbackForm.feedbackId}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Select Top Feedback' ? 'Updating...' : 'Select Top Feedback'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {activeTab === 'requirements' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Mark Requirement as Contacted
                  </CardTitle>
                  <CardDescription>Mark a requirement as contacted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Requirement ID *</Label>
                    <Input
                      value={requirementForm.requirementId}
                      onChange={(e) => setRequirementForm({ ...requirementForm, requirementId: e.target.value })}
                      className="bg-slate-800/50 border-white/10 text-white mt-1"
                      placeholder="Enter requirement ID"
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmit(`/requirements/${requirementForm.requirementId}/contacted`, 'POST', {}, 'Mark Requirement Contacted')}
                    disabled={loading === 'Mark Requirement Contacted' || !requirementForm.requirementId}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Mark Requirement Contacted' ? 'Updating...' : 'Mark as Contacted'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* QnA */}
            {activeTab === 'qna' && (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
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
                    onClick={() => handleSubmit(`/qna/${qnaForm.qnaId}/reply`, 'POST', qnaForm, 'Reply to QnA')}
                    disabled={loading === 'Reply to QnA' || !qnaForm.qnaId || !qnaForm.answer}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    {loading === 'Reply to QnA' ? 'Replying...' : 'Reply to QnA'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
