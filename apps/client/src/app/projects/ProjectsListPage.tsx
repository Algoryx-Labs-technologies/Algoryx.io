import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FolderKanban, ArrowRight, Clock, TrendingUp } from 'lucide-react';
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

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                      <CardHeader className="px-6 pt-6 pb-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-semibold font-hero text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors">
                              {project.projectName || 'Untitled Project'}
                            </CardTitle>
                          </div>
                        </div>
                        
                        {/* Grid Layout for Status, Priority, Created Date, and Progress */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {/* Project Status */}
                          <div>
                            <p className="text-xs text-gray-400 font-footer font-medium mb-2 uppercase tracking-wider">Status</p>
                            <span className={cn(
                              "inline-flex items-center text-sm font-hero font-semibold px-3 py-2 rounded-lg border-2 transition-all w-full justify-center",
                              getStatusColor(project.projectStatus)
                            )}>
                              {project.projectStatus?.replace('_', ' ') || 'Not Started'}
                            </span>
                          </div>
                          
                          {/* Priority */}
                          <div>
                            <p className="text-xs text-gray-400 font-footer font-medium mb-2 uppercase tracking-wider">Priority</p>
                            <span className={cn(
                              "inline-flex items-center text-sm font-hero font-semibold px-3 py-2 rounded-lg transition-all w-full justify-center",
                              getPriorityColor(project.priority)
                            )}>
                              {project.priority ? project.priority.charAt(0).toUpperCase() + project.priority.slice(1) : 'N/A'}
                            </span>
                          </div>

                          {/* Created Date */}
                          <div>
                            <p className="text-xs text-gray-400 font-footer font-medium mb-2 uppercase tracking-wider">Created</p>
                            <div className="flex items-center gap-2 text-sm text-white font-footer font-semibold px-3 py-2 bg-slate-800/30 rounded-lg border border-white/5">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(project.created_at)}</span>
                            </div>
                          </div>

                          {/* Progress */}
                          <div>
                            <p className="text-xs text-gray-400 font-footer font-medium mb-2 uppercase tracking-wider">Progress</p>
                            <div className="flex items-center gap-2 text-sm text-white font-hero font-bold px-3 py-2 bg-slate-800/30 rounded-lg border border-white/5">
                              <TrendingUp className="h-4 w-4 text-blue-400" />
                              <span>{progress}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar - Full Width */}
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
                          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-6 pb-6">
                        {/* View Details Button */}
                        <div className="pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between text-sm text-blue-400 font-hero font-semibold group-hover:text-blue-300 transition-colors">
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
