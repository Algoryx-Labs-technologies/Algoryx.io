import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { 
  Users, 
  Clock, 
  Hourglass, 
  Code, 
  Ticket, 
  TrendingUp, 
  FolderKanban,
  Mail,
  MessageSquare,
  Calendar as CalendarIcon,
  BarChart3,
  DollarSign,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { format } from 'date-fns';

export function ClientPage() {
  const { isCollapsed } = useSidebar();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [newProjectMessage, setNewProjectMessage] = useState('');

  // Mock data
  const totalClients = 156;
  const clientsInQueue = 23;
  const pendingClients = 18;
  const clientsInDevelopment = 45;
  const supportTickets = 12;

  const projects = [
    { id: 1, name: 'E-commerce Platform', client: 'TechCorp', progress: 75, deadline: '2024-02-15', status: 'In Progress' },
    { id: 2, name: 'Mobile App Development', client: 'StartupXYZ', progress: 45, deadline: '2024-02-28', status: 'In Progress' },
    { id: 3, name: 'Website Redesign', client: 'DesignCo', progress: 90, deadline: '2024-02-10', status: 'Review' },
    { id: 4, name: 'API Integration', client: 'DataSys', progress: 60, deadline: '2024-03-05', status: 'In Progress' },
    { id: 5, name: 'Cloud Migration', client: 'CloudTech', progress: 30, deadline: '2024-03-20', status: 'In Progress' },
  ];

  const supportTicketsList = [
    { id: 1, client: 'TechCorp', subject: 'Login Issue', priority: 'High', status: 'Open' },
    { id: 2, client: 'StartupXYZ', subject: 'Feature Request', priority: 'Medium', status: 'In Progress' },
    { id: 3, client: 'DesignCo', subject: 'Bug Report', priority: 'Low', status: 'Resolved' },
    { id: 4, client: 'DataSys', subject: 'Performance Issue', priority: 'High', status: 'Open' },
  ];

  const payments = [
    { id: 1, client: 'TechCorp', amount: 50000, status: 'Paid', date: '2024-01-15' },
    { id: 2, client: 'StartupXYZ', amount: 30000, status: 'Pending', date: '2024-02-01' },
    { id: 3, client: 'DesignCo', amount: 25000, status: 'Paid', date: '2024-01-20' },
    { id: 4, client: 'DataSys', amount: 40000, status: 'Pending', date: '2024-02-05' },
  ];

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  // Revenue data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 150000 },
    { month: 'Mar', revenue: 180000 },
    { month: 'Apr', revenue: 140000 },
    { month: 'May', revenue: 200000 },
    { month: 'Jun', revenue: 220000 },
    { month: 'Jul', revenue: 190000 },
    { month: 'Aug', revenue: 210000 },
    { month: 'Sep', revenue: 230000 },
    { month: 'Oct', revenue: 250000 },
    { month: 'Nov', revenue: 240000 },
    { month: 'Dec', revenue: 280000 },
  ];

  const nextMonthRevenue = 260000;
  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;

  // Project status distribution
  const projectStatusData = [
    { name: 'In Progress', value: 3, color: '#3b82f6' },
    { name: 'Review', value: 1, color: '#f59e0b' },
    { name: 'Completed', value: 1, color: '#10b981' },
  ];

  const handleSendEmail = () => {
    // Handle email sending logic
    console.log('Sending email:', { emailTo, emailSubject, emailBody });
    setEmailTo('');
    setEmailSubject('');
    setEmailBody('');
  };

  const handleNewProjectRequest = () => {
    // Handle new project request
    console.log('New project request:', newProjectMessage);
    setNewProjectMessage('');
  };

  // Calendar deadlines
  const deadlines = projects.map(p => ({
    date: new Date(p.deadline),
    project: p.name,
    client: p.client,
  }));

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
                Client Management Dashboard
              </span>
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-footer text-sm">
              Manage clients, projects, and communications
            </p>
          </div>

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total Number of Clients */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Total Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {totalClients}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Active clients
                </p>
              </CardContent>
            </Card>

            {/* Clients in Queue */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Clients in Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {clientsInQueue}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Waiting for assignment
                </p>
              </CardContent>
            </Card>

            {/* Pending Clients */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Hourglass className="h-4 w-4 text-yellow-400" />
                  Pending Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {pendingClients}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Awaiting response
                </p>
              </CardContent>
            </Card>

            {/* Clients in Development */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-400" />
                  In Development
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {clientsInDevelopment}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Active projects
                </p>
              </CardContent>
            </Card>

            {/* Support Tickets */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-purple-400" />
                  Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {supportTickets}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Open tickets
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Project Progress */}
              <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Client Project Progress
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                    Track progress of all active projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200">
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
                          <span className="text-gray-400 font-footer">Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* All Projects */}
              <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-blue-400" />
                    All Projects
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                    Complete list of all client projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-semibold font-footer mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 font-footer">{project.client}</span>
                            <span className="text-gray-400 font-footer">Progress: {project.progress}%</span>
                            <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-footer">
                              {project.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Status Distribution */}
                <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Project Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={projectStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {projectStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Yearly Monthly Revenue */}
                <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                      Yearly Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="revenue" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Calendar Widget with Deadlines */}
              <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-400" />
                    Project Deadlines
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                    {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="mb-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border-0 bg-transparent text-white"
                      classNames={{
                        day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                        day_today: "bg-blue-500/20 text-blue-300 font-bold",
                      }}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-semibold text-white font-footer mb-2">Upcoming Deadlines:</p>
                    {deadlines.slice(0, 3).map((deadline, index) => (
                      <div key={index} className="p-2 rounded-lg bg-slate-800/30 border border-white/5">
                        <p className="text-xs text-white font-footer font-semibold">{deadline.project}</p>
                        <p className="text-xs text-gray-400 font-footer">{deadline.client}</p>
                        <p className="text-xs text-blue-400 font-footer">{format(deadline.date, 'MMM dd, yyyy')}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Email Sender Component */}
              <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-400" />
                    Send Email
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                    Send email to clients
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 font-footer mb-1 block">To:</label>
                      <Input
                        type="email"
                        placeholder="client@example.com"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="bg-slate-800/50 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-footer mb-1 block">Subject:</label>
                      <Input
                        type="text"
                        placeholder="Email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="bg-slate-800/50 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-footer mb-1 block">Message:</label>
                      <textarea
                        placeholder="Your message..."
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border border-white/10 bg-slate-800/50 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <Button
                      onClick={handleSendEmail}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* New Project Request Message Component */}
              <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    New Project Request
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                    Submit a new project request
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 font-footer mb-1 block">Project Details:</label>
                      <textarea
                        placeholder="Describe the project requirements..."
                        value={newProjectMessage}
                        onChange={(e) => setNewProjectMessage(e.target.value)}
                        rows={5}
                        className="w-full rounded-md border border-white/10 bg-slate-800/50 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <Button
                      onClick={handleNewProjectRequest}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      Submit Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Row: Payments and Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Payments */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  Client Payments
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Payment status and history
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-3 mb-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5"
                    >
                      <div>
                        <p className="text-white font-footer font-semibold">{payment.client}</p>
                        <p className="text-gray-400 font-footer text-xs">{format(new Date(payment.date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-footer font-semibold">${payment.amount.toLocaleString()}</p>
                        <span className={`text-xs font-footer px-2 py-1 rounded ${
                          payment.status === 'Paid' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-footer">Total Paid:</span>
                    <span className="text-green-400 font-footer font-semibold">${totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-footer">Pending:</span>
                    <span className="text-yellow-400 font-footer font-semibold">${totalPending.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Payments */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <Hourglass className="h-5 w-5 text-yellow-400" />
                  Pending Payments
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Awaiting payment confirmation
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-3">
                  {payments.filter(p => p.status === 'Pending').map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-footer font-semibold">{payment.client}</p>
                        <span className="text-yellow-400 font-footer font-bold text-lg">${payment.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-400 font-footer text-xs">Due: {format(new Date(payment.date), 'MMM dd, yyyy')}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-2xl font-bold text-yellow-400 font-hero">
                    ${totalPending.toLocaleString()}
                  </p>
                  <p className="text-gray-400 font-footer text-xs mt-1">Total Pending</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Month Revenue */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-green-400" />
                  Revenue Forecast
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Next month and current revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-gray-400 font-footer text-xs mb-1">Next Month Revenue</p>
                    <p className="text-2xl font-bold text-green-400 font-hero">
                      ${nextMonthRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-footer text-xs">
                        {((nextMonthRevenue - currentMonthRevenue) / currentMonthRevenue * 100).toFixed(1)}% increase
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-gray-400 font-footer text-xs mb-1">Current Month</p>
                    <p className="text-2xl font-bold text-blue-400 font-hero">
                      ${currentMonthRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets */}
          <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 mt-6">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-purple-400" />
                Client Support Tickets
              </CardTitle>
              <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                Manage and track support requests
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                {supportTicketsList.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold font-footer mb-1">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400 font-footer">{ticket.client}</span>
                        <span className={`px-2 py-1 rounded-md text-xs font-footer ${
                          ticket.priority === 'High' 
                            ? 'bg-red-500/20 text-red-400' 
                            : ticket.priority === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-footer">
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
