import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Map, Library, LogOut, ExternalLink, type LucideIcon } from 'lucide-react';
import { isAdminAuthed, logoutAdmin } from '@/lib/admin';
import { cn } from '@/lib/utils';

interface AdminNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description?: string;
}

const adminNavItems: AdminNavItem[] = [
  {
    label: 'Roadmap editor',
    path: '/admin/roadmap',
    icon: Map,
    description: 'Edit reference tasks & tags',
  },
  {
    label: 'Resources editor',
    path: '/admin/resources',
    icon: Library,
    description: 'Edit categories & resources',
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdminAuthed()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0d14] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-aicc-purple to-aicc-violet flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-xl font-bold text-gray-900 dark:text-white">Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 px-2 pb-1.5 pt-1">
            Tools
          </div>
          {adminNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-colors',
                  active
                    ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                )}
              >
                <Icon className={cn('shrink-0 w-4 h-4 mt-0.5', active ? 'text-aicc-purple dark:text-aicc-purple-light' : 'text-gray-400 dark:text-gray-500')} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            View site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
