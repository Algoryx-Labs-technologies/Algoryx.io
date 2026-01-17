import { Sidebar } from '../components/Sidebar';
import { CalendarWidget } from './widgets/CalendarWidget';
import { NewsWidget } from './widgets/NewsWidget';
import { ProjectsAndRequirementsWidget } from './widgets/ProjectsAndRequirementsWidget';
import { InboxWidget } from './widgets/InboxWidget';
import { ProfileWidget } from './widgets/ProfileWidget';
import { NotificationsWidget } from './widgets/NotificationsWidget';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';

export function DashboardPage() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden",
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

        {/* Content - Full height, no scrolling */}
        <div className="relative z-10 h-full w-full px-8 flex flex-col overflow-hidden">
          {/* Welcome Message - Enhanced and Personalized */}
          <div className="mb-2 flex-shrink-0 pt-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-hero tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent dark:from-blue-300 dark:via-cyan-200 dark:to-blue-400">
                {(() => {
                  const hour = new Date().getHours();
                  if (hour < 12) return "Good Morning";
                  if (hour < 17) return "Good Afternoon";
                  return "Good Evening";
                })()}
              </span>
              <span className="text-white dark:text-white ml-3">
                John
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-300 mt-3 font-serif italic tracking-wide">
              Welcome back to <span className="text-blue-400 dark:text-blue-400 font-semibold not-italic">AlgoryxLabs</span> <span className="mx-2 text-gray-500 dark:text-gray-500">•</span> <span className="text-gray-400 dark:text-gray-400">Dashboard</span>
            </p>
          </div>

          {/* Widgets Grid - Centered vertically with equal gaps */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="grid grid-cols-12 gap-2 auto-rows-fr max-w-[88%] max-h-[70%] w-full">
            {/* Calendar - Top Left, spans 2 rows */}
            <div className="col-span-12 md:col-span-3 row-span-2 min-h-0 m-1">
              <CalendarWidget />
            </div>
            
            {/* Projects & Requirements - Center Top, 1 row */}
            <div className="col-span-12 md:col-span-6 min-h-0 m-1">
              <ProjectsAndRequirementsWidget />
            </div>
            
            {/* Messages - Top Right */}
            <div className="col-span-12 md:col-span-3 min-h-0 m-1">
              <InboxWidget />
            </div>
            
            {/* Profile - Below Projects & Requirements, Left */}
            <div className="col-span-12 md:col-span-3 min-h-0 m-1">
              <ProfileWidget />
            </div>
            
            {/* Notifications - Below Projects & Requirements, Right */}
            <div className="col-span-12 md:col-span-3 min-h-0 m-1">
              <NotificationsWidget />
            </div>
            
            {/* News - Bottom Right */}
            <div className="col-span-12 md:col-span-3 min-h-0 m-1">
              <NewsWidget />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

