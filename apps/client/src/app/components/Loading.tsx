import { cn } from './ui/utils';

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
  sidebarCollapsed?: boolean;
}

export function LoadingPage({ 
  message = 'Loading...', 
  withSidebar = false,
  sidebarCollapsed = false 
}: LoadingPageProps) {
  return (
    <div className="h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex overflow-hidden">
      {withSidebar && (
        <div className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm border-r border-white/10 z-20",
          sidebarCollapsed ? "w-20" : "w-80"
        )} />
      )}
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-hidden flex items-center justify-center",
        withSidebar && (sidebarCollapsed ? "ml-20" : "ml-80")
      )}>
        <div className="text-center">
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

