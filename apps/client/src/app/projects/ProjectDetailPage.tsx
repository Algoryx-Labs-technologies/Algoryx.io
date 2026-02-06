import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  FileText, 
  Code, 
  Clock, 
  AlertCircle,
  TrendingUp,
  FolderKanban
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { TimelineViewer } from './TimelineViewer';
import { LoadingPage } from '../components/Loading';

interface Project {
  id: string;
  projectName?: string;
  readMe?: string;
  projectStatus?: string;
  progressStatus?: string;
  priority?: string;
  projectTimeline?: any;
  deadline?: string | null;
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
  agreementStatus?: 'signed' | 'pending' | 'draft';
  techStack?: string;
  projectFeatures?: string;
  clientRequirement?: string;
  created_at: string | Date;
  updated_at: string | Date;
  Budget?: string;
  requirements?: Array<{
    uid: string;
    projectTitle?: string;
    question?: string;
    description?: string;
    priority?: string;
    answer?: string;
  }>;
}

export function ProjectDetailPage() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<Project>(`/projects/${id}`);
        
        if (response.success && response.data) {
          setProject(response.data);
        } else {
          setError(response.error || 'Failed to fetch project');
          console.error('Error fetching project:', response.error);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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
      month: 'long',
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

  const formatTimeline = (timeline?: any): string => {
    try {
      if (!timeline) return 'N/A';
      if (typeof timeline === 'string') {
        try {
          const parsed = JSON.parse(timeline);
          if (parsed && typeof parsed === 'object' && parsed.mvps && Array.isArray(parsed.mvps)) {
            // New timeline format with MVPs - return empty string as TimelineViewer will handle it
            return '';
          }
          return timeline;
        } catch {
          return timeline;
        }
      }
      if (typeof timeline === 'object' && timeline !== null) {
        // Check if it's the new MVP format
        if (timeline.mvps && Array.isArray(timeline.mvps)) {
          // New timeline format - return empty string as TimelineViewer will handle it
          return '';
        }
        // Try to format old JSON timeline
        if (timeline.startDate && timeline.endDate) {
          try {
            return `${new Date(timeline.startDate).toLocaleDateString()} - ${new Date(timeline.endDate).toLocaleDateString()}`;
          } catch {
            return `${timeline.startDate} - ${timeline.endDate}`;
          }
        }
        try {
          return JSON.stringify(timeline, null, 2);
        } catch {
          return String(timeline);
        }
      }
      return String(timeline);
    } catch (error) {
      console.error('Error formatting timeline:', error);
      return 'N/A';
    }
  };

  if (loading) {
    return <LoadingPage message="Loading project details..." withSidebar />;
  }

  if (error || !project) {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="p-8">
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold font-hero text-white mb-2">
                  {error ? 'Error Loading Project' : 'Project Not Found'}
                </h3>
                <p className="text-gray-400 font-footer mb-6">
                  {error || "The project you're looking for doesn't exist."}
                </p>
                <button
                  onClick={() => navigate('/projects')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-footer"
                >
                  Back to Projects
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Handle progress status as percentage string (e.g., "10%", "25%", etc.)
  const progressStatusStr = project.progressStatus || '0';
  let progress = 0;
  try {
    if (typeof progressStatusStr === 'string' && progressStatusStr.includes('%')) {
      progress = parseInt(progressStatusStr.replace('%', ''), 10) || 0;
    } else {
      progress = parseInt(String(progressStatusStr), 10) || 0;
    }
  } catch {
    progress = 0;
  }
  const daysUntilDeadline = getDaysUntilDeadline(project.deadline);
  
  // Check if timeline uses new MVP format
  let timelineStr = '';
  let hasMVPFormat = false;
  try {
    timelineStr = formatTimeline(project.projectTimeline);
    hasMVPFormat = project.projectTimeline && (
      (typeof project.projectTimeline === 'object' && project.projectTimeline !== null && project.projectTimeline.mvps) ||
      (typeof project.projectTimeline === 'string' && project.projectTimeline.includes('"mvps"'))
    );
  } catch (error) {
    console.error('Error processing timeline:', error);
    timelineStr = 'N/A';
    hasMVPFormat = false;
  }

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
            <div className="mb-6">
              <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 font-footer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Projects</span>
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold font-hero text-gray-900 dark:text-white mb-3">
                    {project.projectName || 'Untitled Project'}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-base font-footer px-4 py-2 rounded border",
                    getStatusColor(project.projectStatus)
                  )}>
                    {project.projectStatus?.replace('_', ' ') || 'Not Started'}
                  </span>
                  <span className={cn(
                    "text-base font-footer px-4 py-2 rounded",
                    getPriorityColor(project.priority)
                  )}>
                    {project.priority || 'N/A'} Priority
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Card */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      Project Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base text-gray-300 font-footer font-medium">Overall Progress</span>
                        <span className="text-xl text-white font-footer font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Created</p>
                        <p className="text-base text-white font-footer">{formatDate(project.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Last Updated</p>
                        <p className="text-base text-white font-footer">{formatDate(project.updated_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-blue-400" />
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.readMe && (
                      <div>
                        <h3 className="text-lg font-semibold text-white font-footer mb-3">ReadMe</h3>
                        <div className="bg-slate-800/50 rounded-lg p-5 border border-white/5">
                          <pre className="text-base text-gray-200 font-mono whitespace-pre-wrap">
                            {project.readMe}
                          </pre>
                        </div>
                      </div>
                    )}
                    {project.clientRequirement && (
                      <div>
                        <h3 className="text-lg font-semibold text-white font-footer mb-3">Client Requirements</h3>
                        <p className="text-base text-gray-200 font-footer leading-relaxed">{project.clientRequirement}</p>
                      </div>
                    )}
                    {project.projectFeatures && (
                      <div>
                        <h3 className="text-lg font-semibold text-white font-footer mb-3">Project Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.projectFeatures.split(',').map((feature, index) => (
                            <span
                              key={index}
                              className="text-sm text-gray-200 bg-slate-800/50 px-4 py-2 rounded border border-white/5 font-footer"
                            >
                              {feature.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                {project.requirements && project.requirements.length > 0 && (
                  <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.requirements.map((req) => (
                        <div
                          key={req.uid}
                          className="bg-slate-800/50 rounded-lg p-4 border border-white/5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-base font-semibold text-white font-footer">
                              {req.question || 'Requirement'}
                            </h4>
                            {req.priority && (
                              <span className={cn(
                                "text-sm font-footer px-3 py-1.5 rounded",
                                getPriorityColor(req.priority)
                              )}>
                                {req.priority}
                              </span>
                            )}
                          </div>
                          {req.description && (
                            <p className="text-base text-gray-300 font-footer mb-3 leading-relaxed">{req.description}</p>
                          )}
                          {req.answer && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Answer:</p>
                              <p className="text-base text-gray-200 font-footer leading-relaxed">{req.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Timeline & Deadline */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {hasMVPFormat ? (
                      <div>
                        <TimelineViewer timeline={project.projectTimeline} />
                      </div>
                    ) : project.projectTimeline && timelineStr ? (
                      <div>
                        <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Duration</p>
                        <p className="text-base text-white font-footer font-semibold">{timelineStr}</p>
                      </div>
                    ) : null}
                    {project.deadline && (
                      <div className={hasMVPFormat ? "pt-4 border-t border-white/10" : ""}>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-400 font-footer font-medium">Deadline</p>
                        </div>
                        <p className="text-base text-white font-footer font-semibold mb-3">
                          {formatDate(project.deadline)}
                        </p>
                        {daysUntilDeadline !== null && (
                          <span className={cn(
                            "text-sm font-footer px-3 py-1.5 rounded inline-block",
                            daysUntilDeadline < 0
                              ? "bg-red-500/20 text-red-400"
                              : daysUntilDeadline <= 7
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          )}>
                            {daysUntilDeadline < 0
                              ? `${Math.abs(daysUntilDeadline)} days overdue`
                              : `${daysUntilDeadline} days remaining`}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Status */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                      Payment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-300 font-footer font-medium">Status</span>
                      <span className={cn(
                        "text-base font-footer px-4 py-2 rounded",
                        getPaymentStatusColor(project.paymentStatus)
                      )}>
                        {project.paymentStatus?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                    {project.Budget && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Budget</p>
                        <p className="text-base text-white font-footer font-semibold">{project.Budget}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Agreement Status */}
                <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-400" />
                      Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-footer">Status</span>
                      <span className={cn(
                        "text-sm font-footer px-3 py-1 rounded",
                        project.agreementStatus === 'signed'
                          ? "bg-green-500/20 text-green-400"
                          : project.agreementStatus === 'pending'
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      )}>
                        {project.agreementStatus?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                {project.techStack && (
                  <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-400" />
                        Tech Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.split(',').map((tech, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-300 bg-slate-800/50 px-3 py-1 rounded border border-white/5 font-footer"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
