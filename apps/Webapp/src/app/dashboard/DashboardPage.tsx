import { useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar as CalendarIcon, Clock, TrendingUp, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { Sidebar } from '../components/Sidebar';

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex">
      <Sidebar />
      
      <div className="flex-1 relative md:ml-64">
        {/* Background gradient effects - matching landing theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-hero mb-2">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-cyan-300">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400 font-footer">
              Welcome back! Here's your overview for today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-footer text-gray-300">
                  Total Trades
                </CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-hero">1,234</div>
                <p className="text-xs text-gray-400 font-footer mt-1">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-footer text-gray-300">
                  P&L Today
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-hero">₹12,450</div>
                <p className="text-xs text-green-400 font-footer mt-1">
                  +5.2% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-footer text-gray-300">
                  Win Rate
                </CardTitle>
                <Clock className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-hero">68.5%</div>
                <p className="text-xs text-gray-400 font-footer mt-1">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-footer text-gray-300">
                  Active Strategies
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white font-hero">8</div>
                <p className="text-xs text-gray-400 font-footer mt-1">
                  3 running now
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Card */}
            <Card className="lg:col-span-2 group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  Calendar
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer">
                  {selectedDate ? (
                    <>Selected: {format(selectedDate, "PPP")}</>
                  ) : (
                    <>No date selected</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
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
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold font-hero text-white">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-400 font-footer">
                  Your latest trades and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '10:30 AM', action: 'Buy Order Executed', symbol: 'RELIANCE', type: 'buy' },
                    { time: '09:15 AM', action: 'Sell Order Executed', symbol: 'TCS', type: 'sell' },
                    { time: '08:45 AM', action: 'Strategy Started', symbol: 'Momentum', type: 'info' },
                    { time: 'Yesterday', action: 'Daily Report Generated', symbol: 'Summary', type: 'info' },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'buy' ? 'bg-green-400' :
                        activity.type === 'sell' ? 'bg-red-400' :
                        'bg-blue-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-footer font-medium">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-400 font-footer mt-1">
                          {activity.symbol} • {activity.time}
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

