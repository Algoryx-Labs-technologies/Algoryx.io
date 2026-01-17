import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, BookOpen, List, CreditCard, Eye, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export function CoursesPage() {
  const { isCollapsed } = useSidebar();

  // Mock data - replace with actual data from your API
  const totalStudents = 1247;
  const totalCourses = 23;
  const totalSubscriptions = 3456;
  const totalViewership = 8921;

  const courseList = [
    { id: 1, name: 'Introduction to Algorithms', students: 234, status: 'Active', viewership: 2156 },
    { id: 2, name: 'Data Structures Fundamentals', students: 189, status: 'Active', viewership: 1823 },
    { id: 3, name: 'Machine Learning Basics', students: 312, status: 'Active', viewership: 2845 },
    { id: 4, name: 'Web Development Mastery', students: 156, status: 'Active', viewership: 1247 },
    { id: 5, name: 'Python Programming', students: 278, status: 'Active', viewership: 850 },
  ];

  // Prepare data for pie chart
  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];
  
  const viewershipData = courseList.map((course, index) => ({
    name: course.name,
    value: course.viewership,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-footer font-semibold mb-1">{payload[0].name}</p>
          <p className="text-blue-400 font-footer text-sm">
            Viewership: <span className="text-white">{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-gray-400 font-footer text-xs mt-1">
            {((payload[0].value / totalViewership) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for slices smaller than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-footer font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-auto",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        {/* Background gradient effects - matching landing theme */}
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
                Courses Dashboard
              </span>
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-footer text-sm">
              Overview of your courses and student engagement
            </p>
          </div>

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Number of Students */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {totalStudents.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Active learners
                </p>
              </CardContent>
            </Card>

            {/* Total Number of Courses */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  Total Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {totalCourses}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Available courses
                </p>
              </CardContent>
            </Card>

            {/* Total Course Subscription */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  Total Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {totalSubscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Course enrollments
                </p>
              </CardContent>
            </Card>

            {/* Course Viewership */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-sm font-semibold font-hero text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  Course Viewership
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-3xl font-bold text-white font-hero mb-1">
                  {totalViewership.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 font-footer">
                  Total views
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Course List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Course Viewership Distribution Pie Chart */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-400" />
                  Course Viewership Distribution
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  Viewership breakdown by course
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={viewershipData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {viewershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                          <span className="text-gray-300 font-footer text-sm">
                            {value}
                          </span>
                        )}
                        iconType="circle"
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {viewershipData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-400 font-footer">{item.name}</span>
                      </div>
                      <span className="text-white font-footer font-semibold">
                        {item.value.toLocaleString()} views
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course List Card */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
                  <List className="h-5 w-5 text-blue-400" />
                  Course List
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer text-sm mt-1">
                  All available courses and their enrollment statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-3">
                  {courseList.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-semibold font-footer mb-1">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400 font-footer">
                            {course.students} students
                          </span>
                          <span className="text-gray-400 font-footer">
                            {course.viewership.toLocaleString()} views
                          </span>
                          <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-footer">
                            {course.status}
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
    </div>
  );
}
