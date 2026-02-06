import { cn } from './ui/utils';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../contexts/SidebarContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-b-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-2',
  };

  return (
    <div className={cn('inline-block animate-spin rounded-full border-blue-400', sizeClasses[size], className)} />
  );
}

interface LoadingPageProps {
  message?: string;
  withSidebar?: boolean;
}

export function LoadingPage({ 
  message = 'Loading...', 
  withSidebar = false
}: LoadingPageProps) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      {withSidebar && <Sidebar />}
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden flex items-center justify-center",
        withSidebar && (isCollapsed ? "ml-20" : "ml-80")
      )}>
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <div className="relative z-10 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 dark:text-gray-400 mt-4">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export function LoadingCard({ message = 'Loading...', className }: LoadingCardProps) {
  return (
    <div className={cn(
      'text-center py-12',
      className
    )}>
      <LoadingSpinner size="md" />
      <p className="text-gray-400 dark:text-gray-400 mt-4">{message}</p>
    </div>
  );
}

interface LoadingInlineProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingInline({ message, size = 'md', className }: LoadingInlineProps) {
  return (
    <div className={cn('text-center', className)}>
      <LoadingSpinner size={size} />
      {message && (
        <p className="text-gray-400 dark:text-gray-400 mt-4">{message}</p>
      )}
    </div>
  );
}

