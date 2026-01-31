import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { FileText, CheckCircle2, XCircle, RefreshCw, Search, Clock, AlertCircle } from 'lucide-react';
import { getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface Requirement {
  uid: string;
  projectTitle: string | null;
  description: string | null;
  Budget: string | null;
  email: string | null;
  userName: string | null;
  status: 'Contacted' | 'Pending' | 'Rejected';
  created_at: Date | string;
  updated_at: Date | string;
  userId: string | null;
  clientId: string | null;
  partnerId: string | null;
  User: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  Client: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
  Partner: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
}

export function RequirementsPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all requirements
  const fetchRequirements = async () => {
    setLoadingRequirements(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/requirements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch requirements');
      }

      if (result.success && result.data) {
        setRequirements(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching requirements:', error);
      setMessage({ type: 'error', text: 'Failed to fetch requirements' });
    } finally {
      setLoadingRequirements(false);
    }
  };

  // Fetch requirements on component mount
  useEffect(() => {
    fetchRequirements();
  }, []);

  // Handle mark as contacted
  const handleMarkAsContacted = async (requirementId: string) => {
    setLoading(`mark-${requirementId}`);
    setMessage(null);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/requirements/${requirementId}/contacted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update requirement');
      }

      setMessage({ type: 'success', text: 'Requirement marked as contacted' });
      fetchRequirements(); // Refresh the list
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update requirement' });
    } finally {
      setLoading(null);
    }
  };

  // Handle mark as rejected
  const handleMarkAsRejected = async (requirementId: string) => {
    setLoading(`reject-${requirementId}`);
    setMessage(null);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/requirements/${requirementId}/rejected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update requirement');
      }

      setMessage({ type: 'success', text: 'Requirement marked as rejected' });
      fetchRequirements(); // Refresh the list
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update requirement' });
    } finally {
      setLoading(null);
    }
  };

  // Filter requirements based on search query
  const filteredRequirements = requirements.filter((requirement) => {
    const searchLower = searchQuery.toLowerCase();
    const projectTitle = requirement.projectTitle?.toLowerCase() || '';
    const description = requirement.description?.toLowerCase() || '';
    const email = requirement.email?.toLowerCase() || '';
    const userName = requirement.userName?.toLowerCase() || '';
    const userEmail = requirement.User?.email?.toLowerCase() || '';
    const userFirstName = requirement.User?.firstName?.toLowerCase() || '';
    const userLastName = requirement.User?.lastName?.toLowerCase() || '';
    const status = requirement.status?.toLowerCase() || '';
    
    return (
      projectTitle.includes(searchLower) ||
      description.includes(searchLower) ||
      email.includes(searchLower) ||
      userName.includes(searchLower) ||
      userEmail.includes(searchLower) ||
      userFirstName.includes(searchLower) ||
      userLastName.includes(searchLower) ||
      status.includes(searchLower) ||
      requirement.uid.toLowerCase().includes(searchLower)
    );
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Contacted':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Contacted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get display name
  const getDisplayName = (requirement: Requirement): string => {
    if (requirement.userName) return requirement.userName;
    if (requirement.User) {
      const firstName = requirement.User.firstName || '';
      const lastName = requirement.User.lastName || '';
      return `${firstName} ${lastName}`.trim() || requirement.User.email || 'Anonymous';
    }
    if (requirement.Client?.User) {
      const firstName = requirement.Client.User.firstName || '';
      const lastName = requirement.Client.User.lastName || '';
      return `${firstName} ${lastName}`.trim() || requirement.Client.User.email || 'Anonymous';
    }
    if (requirement.Partner?.User) {
      const firstName = requirement.Partner.User.firstName || '';
      const lastName = requirement.Partner.User.lastName || '';
      return `${firstName} ${lastName}`.trim() || requirement.Partner.User.email || 'Anonymous';
    }
    return requirement.email || 'Anonymous';
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
              <h1 className="text-3xl font-bold text-white font-hero">Requirements</h1>
              <p className="text-gray-400 mt-1 font-footer">View and manage all client requirements</p>
            </div>
            <Button
              onClick={fetchRequirements}
              disabled={loadingRequirements}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loadingRequirements && "animate-spin")} />
              Refresh
            </Button>
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

          {/* Search Bar */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white pl-10"
                  placeholder="Search requirements by title, description, email, or status..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements List */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                All Requirements ({filteredRequirements.length})
              </CardTitle>
              <CardDescription>View and manage all client requirements</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRequirements ? (
                <div className="text-center py-8 text-gray-400">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading requirements...</p>
                </div>
              ) : filteredRequirements.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No requirements found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequirements.map((requirement) => (
                    <div
                      key={requirement.uid}
                      className="p-4 rounded-lg border bg-slate-800/30 border-white/10 hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold">
                              {requirement.projectTitle || 'Untitled Requirement'}
                            </h3>
                            <span className={cn(
                              "px-2 py-1 text-xs rounded border flex items-center gap-1",
                              getStatusBadge(requirement.status)
                            )}>
                              {getStatusIcon(requirement.status)}
                              {requirement.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {getDisplayName(requirement)}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {requirement.email || requirement.User?.email || 'No email'}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(requirement.created_at).toLocaleString()}
                          </p>
                        </div>
                        {requirement.status === 'Pending' && (
                          <div className="flex gap-2 ml-2">
                            <Button
                              onClick={() => handleMarkAsContacted(requirement.uid)}
                              disabled={loading === `mark-${requirement.uid}` || loading === `reject-${requirement.uid}`}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {loading === `mark-${requirement.uid}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Mark Contacted
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleMarkAsRejected(requirement.uid)}
                              disabled={loading === `reject-${requirement.uid}` || loading === `mark-${requirement.uid}`}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {loading === `reject-${requirement.uid}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {requirement.description && (
                        <div className="mb-3">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{requirement.description}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                        {requirement.Budget && (
                          <span className="px-2 py-1 bg-slate-700/50 rounded">
                            Budget: {requirement.Budget}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-500">
                        <p>Requirement ID: {requirement.uid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
