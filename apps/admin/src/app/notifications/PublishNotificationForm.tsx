import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Bell, Users, Globe, X, CheckCircle2, XCircle } from 'lucide-react';
import { getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface Client {
  uid: string;
  userId: string;
  User: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    country: string | null;
    state: string | null;
    role: string;
    created_at: Date;
  };
}

interface PublishNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PublishNotificationForm({ isOpen, onClose, onSuccess }: PublishNotificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'update',
    userId: '' as string | null,
    selectedClientId: '', // For UI selection
  });

  // Fetch clients when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch clients');
      }

      if (result.success && result.data) {
        setClients(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  const resetForm = () => {
    setNotificationForm({
      title: '',
      message: '',
      type: 'info',
      userId: null,
      selectedClientId: '',
    });
    setMessage(null);
  };

  const handleClientChange = (clientId: string) => {
    if (clientId === '') {
      // Universal notification
      setNotificationForm({
        ...notificationForm,
        selectedClientId: '',
        userId: null,
      });
    } else {
      // Find the selected client and set userId
      const selectedClient = clients.find((c) => c.uid === clientId);
      if (selectedClient) {
        setNotificationForm({
          ...notificationForm,
          selectedClientId: clientId,
          userId: selectedClient.User.id,
        });
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = await getAuthToken();

      // Prepare payload - only send userId if a client is selected
      const payload: any = {
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
      };

      // Only include userId if a client is selected (for user-specific notification)
      if (notificationForm.userId) {
        payload.userId = notificationForm.userId;
      }
      // If userId is null/empty, it will create a universal notification

      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create notification');
      }

      setMessage({
        type: 'success',
        text: notificationForm.userId
          ? 'User-specific notification created successfully!'
          : 'Universal notification created successfully!',
      });

      resetForm();
      
      // Call onSuccess callback after a short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create notification' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                Publish Notification
              </CardTitle>
              <CardDescription className="text-gray-400">
                Send notifications to all users or select a specific client
              </CardDescription>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 mt-4">
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <Label className="text-gray-300 font-medium">Title *</Label>
            <Input
              value={notificationForm.title}
              onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
              className="bg-slate-800/50 border-white/10 text-white mt-2 placeholder:text-gray-500"
              placeholder="Enter notification title"
            />
          </div>

          {/* Message Field */}
          <div>
            <Label className="text-gray-300 font-medium">Message *</Label>
            <textarea
              value={notificationForm.message}
              onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
              className="w-full min-h-[120px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-2 placeholder:text-gray-500 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter notification message"
              rows={5}
            />
          </div>

          {/* Type Field */}
          <div>
            <Label className="text-gray-300 font-medium">Notification Type</Label>
            <select
              value={notificationForm.type}
              onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value as any })}
              className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="info">ℹ️ Info</option>
              <option value="success">✅ Success</option>
              <option value="warning">⚠️ Warning</option>
              <option value="error">❌ Error</option>
              <option value="reminder">🔔 Reminder</option>
              <option value="update">🔄 Update</option>
            </select>
          </div>

          {/* Client Selection Field */}
          <div>
            <Label className="text-gray-300 font-medium flex items-center gap-2">
              {notificationForm.selectedClientId ? (
                <>
                  <Users className="h-4 w-4 text-blue-400" />
                  Send to Specific Client (Optional)
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 text-green-400" />
                  Send to All Users (Universal)
                </>
              )}
            </Label>
            <select
              value={notificationForm.selectedClientId}
              onChange={(e) => handleClientChange(e.target.value)}
              disabled={loadingClients}
              className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">🌐 All Users (Universal Notification)</option>
              {loadingClients ? (
                <option disabled>Loading clients...</option>
              ) : (
                clients.map((client) => (
                  <option key={client.uid} value={client.uid}>
                    {client.User.firstName && client.User.lastName
                      ? `${client.User.firstName} ${client.User.lastName} (${client.User.email})`
                      : client.User.email}
                  </option>
                ))
              )}
            </select>
            {notificationForm.selectedClientId && (
              <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                <Users className="h-3 w-3" />
                This notification will be sent only to the selected client
              </p>
            )}
            {!notificationForm.selectedClientId && (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                This notification will be visible to all users
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || !notificationForm.title.trim() || !notificationForm.message.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  {notificationForm.selectedClientId ? 'Send to Selected Client' : 'Post Universal Notification'}
                </span>
              )}
            </Button>
            <Button
              onClick={() => {
                resetForm();
                onClose();
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

