import {
  ChevronLeft,
  ChevronRight,
  Bell,
  CreditCard,
  MessageSquare,
  Star,
  FileText,
  LogOut,
  GitBranch,
  FolderKanban,
  LayoutDashboard,
  CalendarDays,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from './ui/utils';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from './BrandLogo';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { signOut } = useAuth();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: GitBranch,
      label: 'Sales Pipeline',
      path: '/sales-pipeline',
    },
    {
      icon: FolderKanban,
      label: 'Current Projects',
      path: '/current-projects',
    },
    {
      icon: CalendarDays,
      label: 'Meetings',
      path: '/meetings',
    },
    {
      icon: FileText,
      label: 'Requirements',
      path: '/requirements',
    },
    {
      icon: Star,
      label: 'Feedback',
      path: '/feedback',
    },
    {
      icon: MessageSquare,
      label: 'Support Tickets',
      path: '/support-tickets',
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
    },
    {
      icon: CreditCard,
      label: 'Payments',
      path: '/payments',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm border-r border-white/10 z-20 hidden md:block transition-all duration-300",
      isCollapsed ? "w-20" : "w-80"
    )}>
      {/* Logo/Brand */}
      <div
        className={cn(
          'flex items-center border-b border-white/10 shrink-0',
          isCollapsed ? 'h-16 flex-col justify-center gap-2 px-2 py-3' : 'h-16 justify-between gap-2 px-4',
        )}
      >
        <BrandLogo collapsed={isCollapsed} className={isCollapsed ? 'mx-auto' : 'min-w-0 flex-1'} />
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10 text-gray-400 hover:text-white shrink-0',
            isCollapsed && 'mx-auto',
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-footer",
                active
                  ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-white shadow-[0_0_8px_rgba(59,130,246,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0",
                active ? "text-blue-400" : "text-gray-500"
              )} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate('/login');
          }}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-footer text-gray-400 hover:text-white hover:bg-white/5 border border-transparent',
            isCollapsed && 'justify-center px-2',
          )}
          title={isCollapsed ? 'Sign out' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0 text-gray-500" />
          {!isCollapsed && <span className="font-medium">Sign out</span>}
        </button>
      </div>
    </div>
  );
}

