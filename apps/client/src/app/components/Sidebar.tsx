import { LayoutDashboard, ChevronLeft, ChevronRight, FolderKanban, MessageSquare, FileText, Users, CreditCard, MessageCircle, Calendar, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from './ui/utils';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    {
      icon: MessageSquare,
      label: 'Messages',
      path: '/messages',
    },
    {
      icon: Calendar,
      label: 'Meetings',
      path: '/meetings',
    },
    {
      icon: FileText,
      label: 'Requirements',
      path: '/requirements',
    },
    {
      icon: Users,
      label: 'Community',
      path: '/community',
    },
    {
      icon: CreditCard,
      label: 'Payments',
      path: '/payments',
    },
    {
      icon: MessageCircle,
      label: 'Feedback',
      path: '/feedback',
    },
  ];

  const isActive = (path: string) => {
    // Exact match
    if (location.pathname === path) return true;
    // For projects, also match project detail pages (e.g., /projects/:id)
    if (path === '/projects' && location.pathname.startsWith('/projects/')) return true;
    return false;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Sign out from Supabase (clears session and cookies)
      await signOut();
      
      // Clear localStorage (remove any cached data)
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Navigate to auth page
      navigate('/auth', { replace: true });
      
      // Force reload to ensure all state is cleared
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, try to navigate to auth page
      navigate('/auth', { replace: true });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-sm border-r border-white/10 z-20 hidden md:block transition-all duration-300 flex flex-col",
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
              "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10 text-gray-400 hover:text-white",
              isCollapsed && "mx-auto"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-5 px-6 py-3 rounded-lg transition-all duration-200 font-footer text-lg",
                  active
                    ? "bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-white shadow-[0_0_8px_rgba(59,130,246,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent",
                  isCollapsed && "justify-center px-4"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "h-7 w-7 shrink-0",
                  active ? "text-blue-400" : "text-gray-500"
                )} />
                {!isCollapsed && (
                  <span className="font-semibold text-lg">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className={cn(
              "w-full flex items-center gap-5 px-6 py-3 rounded-lg transition-all duration-200 font-footer text-lg text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30",
              isCollapsed && "justify-center px-4"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-7 w-7 shrink-0 text-gray-500" />
            {!isCollapsed && (
              <span className="font-semibold text-lg">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog - Rendered outside sidebar to center on page */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isLoggingOut && setShowLogoutDialog(false)}
          />
          
          {/* Dialog */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 p-8 shadow-2xl max-w-lg w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Confirm Logout</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-300 text-base leading-relaxed">
                Are you sure you want to logout from your account?
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm leading-relaxed">
                  <span className="text-gray-300 font-medium">Please note:</span> You will be signed out of your current session. Any unsaved changes or work in progress may be lost. You can always sign back in using your credentials.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutDialog(false)}
                disabled={isLoggingOut}
                className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 font-semibold shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

