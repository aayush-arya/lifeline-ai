import { NavLink } from 'react-router-dom';
import { Heart, Activity, MapPin, Droplet, Clock, Settings, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: Activity, label: 'Dashboard' },
  { to: '/hospitals', icon: MapPin, label: 'Hospitals' },
  { to: '/vitals', icon: Droplet, label: 'Vitals' },
  { to: '/appointments', icon: Clock, label: 'Appointments' },
];

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="hidden md:flex flex-col w-20 bg-white border-r border-slate-200">
      <div className="p-5 flex justify-center">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
      </div>
      <nav className="flex-1 flex flex-col items-center gap-3 py-8">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            title={label}
            className={({ isActive }) =>
              `p-3 rounded-xl transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>
      <div className="p-5 flex flex-col gap-3">
        <NavLink
          to="/profile"
          aria-label="Profile"
          title="Profile"
          className={({ isActive }) =>
            `p-3 rounded-xl transition-colors flex justify-center ${
              isActive ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Settings className="w-5 h-5" />
        </NavLink>
        <button
          onClick={onLogout}
          aria-label="Logout"
          title="Logout"
          className="p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
