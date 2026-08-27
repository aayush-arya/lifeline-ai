import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/vitals', label: 'Vitals' },
  { to: '/appointments', label: 'Appointments' },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileNav({ open, onClose, onLogout }: MobileNavProps) {
  if (!open) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-3 rounded-lg font-semibold transition-colors text-left ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-64 h-full flex flex-col p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-slate-50">Menu</h2>
        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-200 dark:border-slate-800">
          <NavLink to="/profile" className={linkClass} onClick={onClose}>
            Settings
          </NavLink>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-4 py-3 rounded-lg font-semibold text-left text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
