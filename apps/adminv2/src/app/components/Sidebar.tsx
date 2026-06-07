import { useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Briefcase,
  CreditCard,
  MessageSquare,
  Star,
  FileText,
  LogOut,
  GitBranch,
  FolderKanban,
  LayoutDashboard,
  CalendarDays,
  Users,
  StickyNote,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from './ui/utils';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from './BrandLogo';

const menuItems: { icon: LucideIcon; label: string; path: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: GitBranch, label: 'Sales Pipeline', path: '/sales-pipeline' },
  { icon: FolderKanban, label: 'Current Projects', path: '/current-projects' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: Users, label: 'Teams', path: '/teams' },
  { icon: StickyNote, label: 'Notes', path: '/notes' },
  { icon: CalendarDays, label: 'Meetings', path: '/meetings' },
  { icon: FileText, label: 'Requirements', path: '/requirements' },
  { icon: Star, label: 'Feedback', path: '/feedback' },
  { icon: MessageSquare, label: 'Support Tickets', path: '/support-tickets' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Wallet, label: 'Revenue & Expense', path: '/revenue-expense' },
];

const sidebarPanelClass =
  'bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm border-white/10';

interface SidebarPanelProps {
  isCollapsed: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  showCollapseToggle?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

function SidebarPanel({
  isCollapsed,
  activePath,
  onNavigate,
  onSignOut,
  showCollapseToggle = false,
  onToggleCollapse,
  onClose,
}: SidebarPanelProps) {
  const isActive = (path: string) => activePath === path;

  return (
    <>
      <div
        className={cn(
          'flex items-center border-b border-white/10 shrink-0',
          isCollapsed ? 'h-16 flex-col justify-center gap-2 px-2 py-3' : 'h-16 justify-between gap-2 px-4',
        )}
      >
        <BrandLogo collapsed={isCollapsed} className={isCollapsed ? 'mx-auto' : 'min-w-0 flex-1'} />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white shrink-0"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {showCollapseToggle && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
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
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-footer',
                active
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-white shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent',
                isCollapsed && 'justify-center px-2',
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn('h-5 w-5 shrink-0', active ? 'text-blue-400' : 'text-gray-500')}
              />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="shrink-0 p-4 border-t border-white/10">
        <button
          type="button"
          onClick={onSignOut}
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
    </>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobile } = useSidebar();
  const { signOut } = useAuth();

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    closeMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-80 flex-col border-r transition-transform duration-300 md:hidden',
          sidebarPanelClass,
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarPanel
          isCollapsed={false}
          activePath={location.pathname}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
          onClose={closeMobile}
        />
      </div>

      <div
        className={cn(
          'fixed left-0 top-0 z-20 hidden h-screen flex-col border-r transition-all duration-300 md:flex',
          sidebarPanelClass,
          isCollapsed ? 'w-20' : 'w-80',
        )}
      >
        <SidebarPanel
          isCollapsed={isCollapsed}
          activePath={location.pathname}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
          showCollapseToggle
          onToggleCollapse={toggleSidebar}
        />
      </div>
    </>
  );
}
