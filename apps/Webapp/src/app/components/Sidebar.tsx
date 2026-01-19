import { LayoutDashboard, ChevronLeft, ChevronRight, FolderKanban } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from './ui/utils';
import { useSidebar } from '../contexts/SidebarContext';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: FolderKanban,
      label: 'My Projects',
      path: '/projects',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm border-r border-white/10 z-20 hidden md:block transition-all duration-300",
      isCollapsed ? "w-20" : "w-80"
    )}>
      {/* Logo/Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg font-hero">A</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg font-hero">A</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10 text-gray-400 hover:text-white",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
    </div>
  );
}

