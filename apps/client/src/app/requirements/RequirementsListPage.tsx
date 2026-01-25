import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent } from '../components/ui/card';
import { FileText, Clock, CheckCircle2, AlertCircle, XCircle, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Button } from '../components/ui/button';
import { EditRequirementDialog } from './EditRequirementDialog';

interface Requirement {
  uid: string;
  projectId?: string;
  projectTitle?: string;
  Budget?: string;
  description?: string;
  priority?: string;
  answer?: string;
  created_at: string;
  updated_at: string;
  status?: 'pending' | 'answered' | 'reviewed';
}

interface UserData {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export function RequirementsListPage() {
  const { isCollapsed } = useSidebar();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered' | 'reviewed'>('all');
  const [user, setUser] = useState<UserData | null>(null);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<UserData>('/auth/me');
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch requirements when user is available
  useEffect(() => {
    if (user?.id) {
      fetchRequirements();
    }
  }, [user?.id]);

  const fetchRequirements = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get<Requirement[]>(`/requirements/user/${user.id}`);
      if (response.success && response.data) {
        const requirementsWithStatus = (response.data || []).map((req: Requirement) => ({
          ...req,
          status: 'pending' as const,
        }));
        setRequirements(requirementsWithStatus);
      } else {
        console.error('Error fetching requirements:', response.error);
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (requirement: Requirement) => {
    setEditingRequirement(requirement);
  };

  const handleEditSuccess = (updatedRequirement: Requirement) => {
    // Update the requirement in the list immediately with the updated data
    setRequirements((prev) =>
      prev.map((req) =>
        req.uid === updatedRequirement.uid
          ? { ...req, ...updatedRequirement }
          : req
      )
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'answered':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'reviewed':
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'mid':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredRequirements = filter === 'all' 
    ? requirements 
    : requirements.filter(req => req.status === filter);

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
        isCollapsed ? "ml-20" : "ml-80"
      )}>
        {/* Background gradient effects - matching dashboard theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="h-full overflow-y-auto relative z-10">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                Requirements
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-footer">
                View all your sent requirements and their status
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2">
              {(['all', 'pending', 'answered', 'reviewed'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={cn(
                    "px-5 py-3 rounded-lg font-footer text-lg transition-colors",
                    filter === filterOption
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800/70"
                  )}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>

            {/* Requirements List */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-500 font-footer">Loading requirements...</div>
              </div>
            ) : filteredRequirements.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold font-hero text-white mb-2">
                    No Requirements Found
                  </h3>
                  <p className="text-lg text-gray-400 font-footer">
                    {filter === 'all' 
                      ? 'You haven\'t sent any requirements yet'
                      : `No ${filter} requirements found`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredRequirements.map((requirement) => (
                  <Card
                    key={requirement.uid}
                    className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Status Badge - Top Right */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-footer font-semibold border backdrop-blur-sm",
                        getStatusColor(requirement.status)
                      )}>
                        {getStatusIcon(requirement.status)}
                        {requirement.status?.toUpperCase() || 'UNKNOWN'}
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      {/* Header with Icon and Priority */}
                      <div className="mb-3">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold font-hero text-white mb-1.5 line-clamp-2">
                              {requirement.projectTitle || 'Untitled Project'}
                            </h3>
                            {requirement.priority && (
                              <span className={cn(
                                "inline-block text-xs font-footer px-2 py-1 rounded-full",
                                getPriorityColor(requirement.priority)
                              )}>
                                {requirement.priority.toUpperCase()} Priority
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Budget */}
                      {requirement.Budget && (
                        <div className="mb-3 flex-1">
                          <p className="text-sm text-gray-400 font-footer mb-1.5 font-medium uppercase tracking-wide">
                            Budget
                          </p>
                          <p className="text-base text-white font-footer leading-relaxed line-clamp-2">
                            {requirement.Budget}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      {requirement.description && (
                        <div className="mb-3 flex-1">
                          <p className="text-sm text-gray-400 font-footer mb-1.5 font-medium uppercase tracking-wide">
                            Description
                          </p>
                          <p className="text-base text-gray-300 font-footer leading-relaxed line-clamp-2">
                            {requirement.description}
                          </p>
                        </div>
                      )}

                      {/* Answer Preview (if exists) */}
                      {requirement.answer && requirement.answer.trim() && (
                        <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1.5">
                            <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <p className="text-sm text-green-400 font-footer font-semibold uppercase tracking-wide">
                              Answered
                            </p>
                          </div>
                          <p className="text-base text-gray-200 font-footer leading-relaxed line-clamp-2">
                            {requirement.answer}
                          </p>
                        </div>
                      )}

                      {/* Footer with Dates and Edit Button */}
                      <div className="mt-auto pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-footer">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="line-clamp-1">
                              {requirement.updated_at !== requirement.created_at ? (
                                <>
                                  {new Date(requirement.updated_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                  <span className="text-gray-500 text-[10px] ml-2">
                                    Updated
                                  </span>
                                </>
                              ) : (
                                new Date(requirement.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              )}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleEdit(requirement)}
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Requirement Dialog */}
      <EditRequirementDialog
        open={editingRequirement !== null}
        onClose={() => setEditingRequirement(null)}
        requirement={editingRequirement}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

