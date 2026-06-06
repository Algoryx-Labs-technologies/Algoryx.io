import { Menu } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSidebar } from '../contexts/SidebarContext';

export function MobileNavbar() {
  const { toggleMobile } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-slate-900/95 px-4 backdrop-blur-sm md:hidden">
      <button
        type="button"
        onClick={toggleMobile}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <BrandLogo />
    </header>
  );
}
