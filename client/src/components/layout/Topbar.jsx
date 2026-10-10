import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from '../../constants/nav.js';
import ApiStatus from '../ApiStatus.jsx';

function getPageTitle(pathname) {
  if (pathname === '/') return 'Dashboard';
  const match = NAV_ITEMS.find((item) => item.to !== '/' && pathname.startsWith(item.to));
  return match ? match.label : 'Page not found';
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Healthcare operations issue tracking
          </p>
        </div>

        <ApiStatus />
      </div>
    </header>
  );
}
