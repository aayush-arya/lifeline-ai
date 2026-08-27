type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400',
  info: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400',
  neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
};

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${VARIANT_CLASSES[variant]}`}>
      {children}
    </span>
  );
}
