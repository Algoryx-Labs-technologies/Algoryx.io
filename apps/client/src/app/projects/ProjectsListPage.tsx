import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FolderKanban, Calendar, DollarSign, FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';

interface Project {
  id: string;
  projectName?: string;
  projectStatus?: string;
  progressStatus?: string;
  priority?: string;
  projectTimeline?: any;
  deadline?: string | null;
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
  agreementStatus?: 'signed' | 'pending' | 'draft';
  techStack?: string;
  created_at: string | Date;
  updated_at: string | Date;
  Budget?: string;
}

export function ProjectsListPage() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<Project[]>('/projects');
        
        if (response.success && response.data) {
          setProjects(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch projects');
          console.error('Error fetching projects:', response.error);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'initiated':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'delivered':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
      case 'refunded':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilDeadline = (deadline?: string | null) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              <h1 className="text-3xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                My Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-footer">
                View and manage all your projects
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-500/10 border-red-500/50 mb-6">
                <CardContent className="p-4">
                  <p className="text-red-400 font-footer">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Projects Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 font-footer">Loading projects...</div>
              </div>
            ) : projects.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-12 text-center">
                  <FolderKanban className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold font-hero text-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-400 font-footer">Get started by creating your first project</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const daysUntilDeadline = getDaysUntilDeadline(project.deadline);
                  // Handle progress status as percentage string (e.g., "10%", "25%", etc.)
                  const progressStatusStr = project.progressStatus || '0';
                  const progress = progressStatusStr.includes('%') 
                    ? parseInt(progressStatusStr.replace('%', '')) 
                    : parseInt(progressStatusStr);

                  return (
                    <Card
                      key={project.id}
                      className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <CardHeader className="px-6 pt-6 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-semibold font-hero text-white mb-2 line-clamp-1">
                              {project.projectName || 'Untitled Project'}
                            </CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "text-sm font-footer px-3 py-1.5 rounded border",
                            getStatusColor(project.projectStatus)
                          )}>
                            {project.projectStatus?.replace('_', ' ') || 'Not Started'}
                          </span>
                          <span className={cn(
                            "text-sm font-footer px-3 py-1.5 rounded",
                            getPriorityColor(project.priority)
                          )}>
                            {project.priority || 'N/A'} Priority
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-6 pb-6 space-y-4">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-base text-gray-300 font-footer font-medium">Progress</span>
                            <span className="text-base text-white font-footer font-semibold">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Deadline */}
                        {project.deadline && (
                          <div className="flex items-center gap-3 text-base">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300 font-footer font-medium">Deadline:</span>
                            <span className="text-white font-footer font-semibold">
                              {formatDate(project.deadline)}
                            </span>
                            {daysUntilDeadline !== null && (
                              <span className={cn(
                                "text-sm font-footer px-3 py-1 rounded ml-auto",
                                daysUntilDeadline < 0
                                  ? "bg-red-500/20 text-red-400"
                                  : daysUntilDeadline <= 7
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                              )}>
                                {daysUntilDeadline < 0
                                  ? `${Math.abs(daysUntilDeadline)} days overdue`
                                  : `${daysUntilDeadline} days left`}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Payment Status */}
                        <div className="flex items-center gap-3 text-base">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300 font-footer font-medium">Payment:</span>
                          <span className={cn(
                            "text-sm font-footer px-3 py-1.5 rounded",
                            getPaymentStatusColor(project.paymentStatus)
                          )}>
                            {project.paymentStatus || 'N/A'}
                          </span>
                        </div>

                        {/* Agreement Status */}
                        <div className="flex items-center gap-3 text-base">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300 font-footer font-medium">Agreement:</span>
                          <span className={cn(
                            "text-sm font-footer px-3 py-1.5 rounded",
                            project.agreementStatus === 'signed'
                              ? "bg-green-500/20 text-green-400"
                              : project.agreementStatus === 'pending'
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                          )}>
                            {project.agreementStatus || 'N/A'}
                          </span>
                        </div>

                        {/* View Details Button */}
                        <div className="pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-base text-blue-400 font-footer font-semibold group-hover:text-blue-300 transition-colors">
                            <span>View Details</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
