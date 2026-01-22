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
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FolderKanban
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  projectTitle?: string;
  description?: string;
  readMe?: string;
  projectStatus?: string;
  progressStatus?: string;
  priority?: string;
  projectTimeline?: string;
  deadline?: string;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  agreementStatus?: 'signed' | 'pending' | 'draft';
  techStack?: string;
  projectFeatures?: string;
  clientRequirement?: string;
  created_at: string;
  updated_at: string;
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

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        // TODO: Replace with actual API endpoint when backend is ready
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
        
        // Uncomment when API is ready:
        // const token = localStorage.getItem('auth_token'); // Get from your auth system
        // const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const data = await response.json();
        // if (data.success) {
        //   setProject(data.data);
        // } else {
        //   console.error('Error fetching project:', data.message);
        // }
        
        // Mock data for now
        setProject({
          id: id,
          projectTitle: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration',
          readMe: `# E-Commerce Platform

## Overview
A comprehensive e-commerce platform built with modern technologies to provide a seamless shopping experience.

## Features
- User authentication and authorization
- Product catalog with search and filters
- Shopping cart and checkout
- Payment gateway integration
- Order management
- Admin dashboard
- Inventory management

## Technology Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: JWT
- Payment: Stripe integration

## Project Timeline
- Phase 1: Setup and Authentication (2 weeks)
- Phase 2: Product Catalog (3 weeks)
- Phase 3: Shopping Cart & Checkout (2 weeks)
- Phase 4: Payment Integration (2 weeks)
- Phase 5: Admin Dashboard (3 weeks)
- Phase 6: Testing & Deployment (2 weeks)

Total Duration: 3 months`,
          projectStatus: 'in_progress',
          progressStatus: '65',
          priority: 'high',
          projectTimeline: '3 months',
          deadline: '2024-12-31',
          paymentStatus: 'paid',
          agreementStatus: 'signed',
          techStack: 'React, Node.js, PostgreSQL, Express, TypeScript, Stripe',
          projectFeatures: 'User Authentication, Product Catalog, Shopping Cart, Payment Integration, Order Management, Admin Dashboard',
          clientRequirement: 'Build a modern e-commerce platform with secure payment processing, user-friendly interface, and comprehensive admin features.',
          created_at: '2024-09-01',
          updated_at: '2024-11-15',
          requirements: [
            {
              uid: '1',
              projectTitle: 'E-Commerce Platform',
              question: 'What payment methods should be supported?',
              description: 'Need to integrate multiple payment gateways',
              priority: 'high',
              answer: 'Stripe and PayPal integration required',
            },
            {
              uid: '2',
              projectTitle: 'E-Commerce Platform',
              question: 'What is the expected user capacity?',
              description: 'Need to know for scaling infrastructure',
              priority: 'mid',
              answer: 'Initially 10,000 concurrent users, scalable to 100,000',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching project:', error);
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
      case 'overdue':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
        <Sidebar />
        <div className={cn(
          "flex-1 relative transition-all duration-300 h-screen overflow-hidden flex items-center justify-center",
          isCollapsed ? "ml-20" : "ml-80"
        )}>
          <div className="text-gray-500 font-footer">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (!project) {
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
                <h3 className="text-xl font-semibold font-hero text-white mb-2">Project Not Found</h3>
                <p className="text-gray-400 font-footer mb-6">The project you're looking for doesn't exist.</p>
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

  const progress = parseInt(project.progressStatus || '0');
  const daysUntilDeadline = getDaysUntilDeadline(project.deadline);

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
                    {project.projectTitle || 'Untitled Project'}
                  </h1>
                  <p className="text-lg text-gray-300 dark:text-gray-300 font-footer">
                    {project.description || 'No description available'}
                  </p>
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
                    {project.projectTimeline && (
                      <div>
                        <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Duration</p>
                        <p className="text-base text-white font-footer font-semibold">{project.projectTimeline}</p>
                      </div>
                    )}
                    {project.deadline && (
                      <div>
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

