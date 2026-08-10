import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { Wordmark } from '@/components/common/Wordmark';
import { ThemeSelector } from '@/components/common/ThemeSelector';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useAuth } from '@/features/auth/AuthContext';
import { ADMIN_NAV } from './adminNav';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const current = ADMIN_NAV.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  );

  return (
    <div className="flex min-h-screen bg-cream-100 dark:bg-charcoal-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-wood-500/15 bg-cream-50 transition-transform dark:border-copper-400/15 dark:bg-charcoal-900 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Wordmark size="sm" />
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Cerrar menú">
            <X size={22} />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {ADMIN_NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-wood-800 text-cream-100 dark:bg-copper-500 dark:text-charcoal-950'
                    : 'text-wood-700 hover:bg-wood-500/10 dark:text-cream-200'
                }`
              }
            >
              <Icon size={18} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-charcoal-950/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-wood-500/15 bg-cream-50/95 px-4 backdrop-blur dark:border-copper-400/15 dark:bg-charcoal-900/95 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden" aria-label="Abrir menú">
              <Menu size={24} />
            </button>
            <div>
              <p className="text-xs text-wood-500 dark:text-cream-200/50">MarzTone · Admin</p>
              <h1 className="text-lg font-semibold text-wood-900 dark:text-cream-100">
                {current?.label ?? 'Panel'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeSelector />
            <span className="hidden text-sm text-wood-600 dark:text-cream-200/70 sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={() => void logout()}
              className="flex items-center gap-1 rounded-lg border border-wood-500/25 px-3 py-2 text-sm text-wood-700 hover:bg-wood-500/10 dark:border-copper-400/25 dark:text-cream-200"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
