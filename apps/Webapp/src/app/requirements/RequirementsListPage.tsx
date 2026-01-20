import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Requirement {
  uid: string;
  projectId?: string;
  projectTitle?: string;
  question?: string;
  description?: string;
  priority?: string;
  answer?: string;
  created_at: string;
  updated_at: string;
  status?: 'pending' | 'answered' | 'reviewed';
}

export function RequirementsListPage() {
  const { isCollapsed } = useSidebar();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered' | 'reviewed'>('all');

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        // TODO: Replace with actual API endpoint when backend is ready
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
        
        // Uncomment when API is ready:
        // const token = localStorage.getItem('auth_token'); // Get from your auth system
        // const response = await fetch(`${API_BASE_URL}/requirements`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const data = await response.json();
        // if (data.success) {
        //   const requirementsWithStatus = (data.data || []).map((req: Requirement) => ({
        //     ...req,
        //     status: req.answer ? (req.answer.trim() ? 'answered' : 'pending') : 'pending',
        //   }));
        //   setRequirements(requirementsWithStatus);
        // } else {
        //   console.error('Error fetching requirements:', data.message);
        // }
        
        // Mock data for now
        const mockRequirements: Requirement[] = [
          {
            uid: '1',
            projectId: 'proj1',
            projectTitle: 'E-Commerce Platform',
            question: 'What payment methods should be supported?',
            description: 'I need to integrate multiple payment gateways including credit cards, PayPal, and digital wallets. What is the recommended approach?',
            priority: 'high',
            answer: 'We recommend integrating Stripe for credit cards and PayPal SDK for PayPal. For digital wallets, we can use Apple Pay and Google Pay APIs.',
            created_at: '2024-11-15T09:00:00Z',
            updated_at: '2024-11-18T14:30:00Z',
            status: 'answered',
          },
          {
            uid: '2',
            projectId: 'proj1',
            projectTitle: 'E-Commerce Platform',
            question: 'What is the expected user capacity?',
            description: 'Need to know for scaling infrastructure and database planning.',
            priority: 'mid',
            answer: 'Initially 10,000 concurrent users, scalable to 100,000. We\'ll use cloud infrastructure with auto-scaling capabilities.',
            created_at: '2024-11-16T10:00:00Z',
            updated_at: '2024-11-19T11:20:00Z',
            status: 'answered',
          },
          {
            uid: '3',
            projectId: 'proj2',
            projectTitle: 'Mobile App Development',
            question: 'Which platforms should we target first?',
            description: 'Should we develop for iOS, Android, or both simultaneously?',
            priority: 'high',
            answer: '',
            created_at: '2024-11-17T08:00:00Z',
            updated_at: '2024-11-17T08:00:00Z',
            status: 'pending',
          },
          {
            uid: '4',
            projectId: 'proj3',
            projectTitle: 'Data Analytics Dashboard',
            question: 'What data visualization libraries are recommended?',
            description: 'Need recommendations for charts, graphs, and interactive dashboards.',
            priority: 'mid',
            answer: 'We recommend using Chart.js for basic charts and D3.js for advanced visualizations. For React, Recharts is also a great option.',
            created_at: '2024-11-10T12:00:00Z',
            updated_at: '2024-11-15T16:45:00Z',
            status: 'answered',
          },
          {
            uid: '5',
            projectId: 'proj2',
            projectTitle: 'Mobile App Development',
            question: 'What is the deployment timeline?',
            description: 'When can we expect the app to be available on app stores?',
            priority: 'low',
            answer: '',
            created_at: '2024-11-18T09:30:00Z',
            updated_at: '2024-11-18T09:30:00Z',
            status: 'pending',
          },
          {
            uid: '6',
            projectId: 'proj4',
            projectTitle: 'API Integration Service',
            question: 'How will we handle API rate limiting?',
            description: 'Need to understand the strategy for handling third-party API rate limits and throttling.',
            priority: 'high',
            answer: 'We\'ll implement a rate limiting middleware using Redis to track API calls. We\'ll also implement exponential backoff and request queuing for better reliability.',
            created_at: '2024-11-12T14:00:00Z',
            updated_at: '2024-11-20T10:15:00Z',
            status: 'answered',
          },
        ];
        
        setRequirements(mockRequirements);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
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
              <h1 className="text-3xl font-bold font-hero text-gray-900 dark:text-white mb-2">
                Requirements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-footer">
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
                    "px-4 py-2 rounded-lg font-footer text-sm transition-colors",
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
                <div className="text-gray-500 font-footer">Loading requirements...</div>
              </div>
            ) : filteredRequirements.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold font-hero text-white mb-2">
                    No Requirements Found
                  </h3>
                  <p className="text-gray-400 font-footer">
                    {filter === 'all' 
                      ? 'You haven\'t sent any requirements yet'
                      : `No ${filter} requirements found`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRequirements.map((requirement) => (
                  <Card
                    key={requirement.uid}
                    className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <h3 className="text-xl font-semibold font-hero text-white">
                              {requirement.projectTitle || 'Untitled Project'}
                            </h3>
                            {requirement.priority && (
                              <span className={cn(
                                "text-sm font-footer px-3 py-1.5 rounded",
                                getPriorityColor(requirement.priority)
                              )}>
                                {requirement.priority.toUpperCase()} Priority
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(requirement.status)}
                          <span className={cn(
                            "text-sm font-footer px-4 py-2 rounded border",
                            getStatusColor(requirement.status)
                          )}>
                            {requirement.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                      </div>

                      {/* Three Fields */}
                      <div className="space-y-4 mb-5">
                        {/* Project Title */}
                        {requirement.projectTitle && (
                          <div>
                            <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Project Title</p>
                            <p className="text-lg text-white font-footer font-semibold">
                              {requirement.projectTitle}
                            </p>
                          </div>
                        )}

                        {/* Quotation */}
                        {requirement.question && (
                          <div>
                            <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Quotation</p>
                            <p className="text-base text-white font-footer leading-relaxed">
                              {requirement.question}
                            </p>
                          </div>
                        )}

                        {/* Description */}
                        {requirement.description && (
                          <div>
                            <p className="text-sm text-gray-400 font-footer mb-2 font-medium">Description</p>
                            <p className="text-base text-gray-200 font-footer leading-relaxed">
                              {requirement.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Answer (if exists) */}
                      {requirement.answer && requirement.answer.trim() && (
                        <div className="mt-5 pt-5 border-t border-white/10">
                          <p className="text-sm text-gray-400 font-footer mb-3 flex items-center gap-2 font-medium">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            Answer
                          </p>
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-base text-gray-100 font-footer leading-relaxed">
                              {requirement.answer}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between text-sm text-gray-400 font-footer">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Created: {formatDate(requirement.created_at)}
                          </span>
                          {requirement.updated_at !== requirement.created_at && (
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Updated: {formatDate(requirement.updated_at)}
                            </span>
                          )}
                        </div>
                        {requirement.projectId && (
                          <span className="text-gray-500">
                            Project ID: {requirement.projectId}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

