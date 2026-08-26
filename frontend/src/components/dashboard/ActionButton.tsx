import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function ActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <p className="text-xs font-semibold text-slate-700 text-center leading-tight">{label}</p>
    </button>
  );
}
