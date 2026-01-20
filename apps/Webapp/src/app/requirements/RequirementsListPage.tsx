import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent } from '../components/ui/card';
import { FileText, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Requirement {
  uid: string;
  projectId?: string;
  projectTitle?: string;
  question?: string;
  quotation?: string;
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
        // const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api/v1';
        
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
            quotation: 'Need a comprehensive payment solution for global customers.',
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
            quotation: 'Planning for high-traffic scenarios and peak shopping seasons.',
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
            quotation: 'Cross-platform development strategy needed for maximum reach.',
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
            quotation: 'Real-time data visualization with interactive charts and graphs.',
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
            quotation: 'Target launch date: Q1 2025 for both iOS and Android platforms.',
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
            quotation: 'Robust rate limiting and throttling mechanisms required for production.',
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

                      {/* Question/Quotation */}
                      {requirement.question && (
                        <div className="mb-3 flex-1">
                          <p className="text-sm text-gray-400 font-footer mb-1.5 font-medium uppercase tracking-wide">
                            Question
                          </p>
                          <p className="text-base text-white font-footer leading-relaxed line-clamp-2">
                            {requirement.question}
                          </p>
                        </div>
                      )}

                      {/* Quotation */}
                      {requirement.quotation && (
                        <div className="mb-3 flex-1">
                          <p className="text-sm text-gray-400 font-footer mb-1.5 font-medium uppercase tracking-wide">
                            Quotation
                          </p>
                          <p className="text-base text-white font-footer leading-relaxed line-clamp-2">
                            {requirement.quotation}
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

                      {/* Footer with Dates */}
                      <div className="mt-auto pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs text-gray-400 font-footer">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="line-clamp-1">
                              {new Date(requirement.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </span>
                          {requirement.updated_at !== requirement.created_at && (
                            <span className="text-gray-500 text-[10px]">
                              Updated
                            </span>
                          )}
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
    </div>
  );
}

