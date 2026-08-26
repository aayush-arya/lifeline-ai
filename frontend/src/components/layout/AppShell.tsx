import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import type { User } from '../../types';
import type { AppContext } from '../../lib/outletContext';

interface AppShellProps {
  user: User | null;
  onLogout: () => void;
  notifications: string[];
  contextValue: Omit<AppContext, 'user'>;
}

export function AppShell({ user, onLogout, notifications, contextValue }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          notifications={notifications}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ ...contextValue, user } satisfies AppContext} />
        </main>
      </div>
      <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onLogout={onLogout} />
    </div>
  );
}
