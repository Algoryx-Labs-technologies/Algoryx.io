import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from './ui/utils';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      <Sidebar />
      <MobileNavbar />

      <div
        className={cn(
          'flex-1 relative transition-all duration-300 h-screen overflow-auto pt-14 md:pt-0',
          isCollapsed ? 'md:ml-20' : 'md:ml-80',
        )}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10" />

        <div className="relative z-10 h-full w-full px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-hero mb-2">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-cyan-300">
                {title}
              </span>
            </h1>
            {description && (
              <p className="text-gray-400 font-footer text-sm md:text-base">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
