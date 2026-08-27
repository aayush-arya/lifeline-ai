import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bell, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme';

interface HeaderProps {
  notifications: string[];
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
}

export function Header({ notifications, mobileMenuOpen, onToggleMobileMenu, onLogout }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!showNotifications) return;
    const onClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showNotifications]);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 dark:text-slate-300" /> : <Menu className="w-5 h-5 dark:text-slate-300" />}
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center md:hidden">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">LifeLine AI</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-slate-300" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length} new)` : ''}`}
            aria-expanded={showNotifications}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 z-50">
              <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-2 text-sm">Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No new notifications</p>
              ) : (
                <div className="space-y-2.5">
                  {notifications.map((n, i) => (
                    <p key={i} className="text-sm text-slate-600 dark:text-slate-300 pb-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                      {n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/profile')}
          aria-label="Settings"
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <button
          onClick={onLogout}
          aria-label="Logout"
          className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </header>
  );
}
