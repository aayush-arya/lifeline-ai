import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

type Tone = 'red' | 'indigo' | 'blue' | 'amber';

const TONE_CLASSES: Record<Tone, string> = {
  red: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400',
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
  blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
};

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  tone: Tone;
  children?: React.ReactNode;
}

export function MetricCard({ icon: Icon, label, value, unit, tone, children }: MetricCardProps) {
  return (
    <Card hoverable className="p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TONE_CLASSES[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
        {unit && <p className="text-sm text-slate-500 dark:text-slate-400">{unit}</p>}
      </div>
      {children}
    </Card>
  );
}
