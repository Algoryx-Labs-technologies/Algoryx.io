import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Users, 
  BookOpen, 
  Eye, 
  CreditCard, 
  Clock, 
  Code, 
  Ticket,
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { format } from 'date-fns';

export function DashboardPage() {
  const { isCollapsed } = useSidebar();

  // Client Data
  const totalClients = 156;
  const clientsInQueue = 23;
  const clientsInDevelopment = 45;
  const supportTickets = 12;

  // Course Data
  const totalStudents = 1247;
  const totalCourses = 23;
  const totalViewership = 8921;

  // Revenue Data
  const totalRevenue = 2450000;
  const totalPaid = 145000;

  // Projects Data
  const projects = [
    { id: 1, name: 'E-commerce Platform', client: 'TechCorp', progress: 75, deadline: '2024-02-15', status: 'In Progress' },
    { id: 2, name: 'Mobile App Development', client: 'StartupXYZ', progress: 45, deadline: '2024-02-28', status: 'In Progress' },
    { id: 3, name: 'Website Redesign', client: 'DesignCo', progress: 90, deadline: '2024-02-10', status: 'Review' },
    { id: 4, name: 'API Integration', client: 'DataSys', progress: 60, deadline: '2024-03-05', status: 'In Progress' },
  ];


  // Chart Data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 120000, clients: 12, courses: 18 },
    { month: 'Feb', revenue: 150000, clients: 15, courses: 20 },
    { month: 'Mar', revenue: 180000, clients: 18, courses: 21 },
    { month: 'Apr', revenue: 140000, clients: 14, courses: 19 },
    { month: 'May', revenue: 200000, clients: 20, courses: 22 },
    { month: 'Jun', revenue: 220000, clients: 22, courses: 23 },
    { month: 'Jul', revenue: 190000, clients: 19, courses: 22 },
    { month: 'Aug', revenue: 210000, clients: 21, courses: 23 },
    { month: 'Sep', revenue: 230000, clients: 23, courses: 23 },
    { month: 'Oct', revenue: 250000, clients: 25, courses: 23 },
    { month: 'Nov', revenue: 240000, clients: 24, courses: 23 },
    { month: 'Dec', revenue: 280000, clients: 28, courses: 23 },
  ];

  const courseViewershipData = [
    { name: 'Introduction to Algorithms', value: 2156, color: '#3b82f6' },
    { name: 'Data Structures', value: 1823, color: '#06b6d4' },
    { name: 'Machine Learning', value: 2845, color: '#8b5cf6' },
    { name: 'Web Development', value: 1247, color: '#ec4899' },
    { name: 'Python Programming', value: 850, color: '#f59e0b' },
  ];

  const clientStatusData = [
    { name: 'In Development', value: 45, color: '#10b981' },
    { name: 'In Queue', value: 23, color: '#3b82f6' },
    { name: 'Pending', value: 18, color: '#f59e0b' },
    { name: 'Completed', value: 70, color: '#8b5cf6' },
  ];

  const projectStatusData = [
    { name: 'In Progress', value: 3, color: '#3b82f6' },
    { name: 'Review', value: 1, color: '#f59e0b' },
    { name: 'Completed', value: 6, color: '#10b981' },
  ];

  // Timeline data for activity
  const activityTimeline = [
    { date: '2024-01-15', event: 'New Client: TechCorp', type: 'client' },
    { date: '2024-01-20', event: 'Course Launch: ML Basics', type: 'course' },
    { date: '2024-02-01', event: 'Project Completed: Website Redesign', type: 'project' },
    { date: '2024-02-05', event: 'Payment Received: $50,000', type: 'payment' },
    { date: '2024-02-10', event: 'New Course: Python Programming', type: 'course' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-footer font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-blue-400 font-footer text-sm">
              {entry.name}: <span className="text-white">${entry.value?.toLocaleString() || entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-footer font-semibold mb-1">{payload[0].name}</p>
          <p className="text-blue-400 font-footer text-sm">
            Value: <span className="text-white">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-auto",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 h-full w-full px-6 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-hero mb-2">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-cyan-300">
                Welcome to AlgoryxLabs
              </span>
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-footer text-sm">
              Comprehensive overview of clients, courses, and business metrics
            </p>
          </div>

          {/* Key Metrics Grid - Clients & Courses */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 mb-6">
            {/* Client Metrics */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Users className="h-3 w-3 text-blue-400" />
                  Total Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {totalClients}
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-blue-400" />
                  In Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {clientsInQueue}
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Code className="h-3 w-3 text-green-400" />
                  In Development
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {clientsInDevelopment}
                </div>
              </CardContent>
            </Card>

            {/* Course Metrics */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <BookOpen className="h-3 w-3 text-purple-400" />
                  Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {totalCourses}
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Users className="h-3 w-3 text-cyan-400" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {totalStudents.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Eye className="h-3 w-3 text-blue-400" />
                  Viewership
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {totalViewership.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Metrics */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-green-400" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  ${(totalRevenue / 1000).toFixed(0)}K
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <CreditCard className="h-3 w-3 text-yellow-400" />
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  ${(totalPaid / 1000).toFixed(0)}K
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xs font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Ticket className="h-3 w-3 text-red-400" />
                  Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-white font-hero mb-1">
                  {supportTickets}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Trend Line Chart */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Revenue Trend (12 Months)
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Monthly revenue and growth
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Course Viewership Distribution */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-400" />
                  Course Viewership Distribution
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Top courses by viewership
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseViewershipData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseViewershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Client Status Distribution */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Client Status
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Distribution by status
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Project Status
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Active projects breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<PieTooltip />} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue vs Clients Growth */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Revenue vs Clients
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Growth correlation
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue.slice(-6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis yAxisId="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Revenue ($)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="clients" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Clients"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects and Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Projects */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Active Projects
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Current project progress
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-blue-500/30 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold font-footer mb-1">
                            {project.name}
                          </h3>
                          <p className="text-gray-400 font-footer text-sm">{project.client}</p>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-footer">
                          {project.status}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-footer">{project.progress}% complete</span>
                        <span className="text-gray-400 font-footer">Deadline: {format(new Date(project.deadline), 'MMM dd')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  Recent Activity Timeline
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Latest events and milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {activityTimeline.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'client' ? 'bg-blue-500' :
                          activity.type === 'course' ? 'bg-purple-500' :
                          activity.type === 'project' ? 'bg-green-500' :
                          'bg-yellow-500'
                        }`}></div>
                        {index < activityTimeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-700 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-white font-footer font-semibold mb-1">
                          {activity.event}
                        </p>
                        <p className="text-gray-400 font-footer text-xs">
                          {format(new Date(activity.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
