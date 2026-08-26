import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

type Tone = 'red' | 'indigo' | 'blue' | 'amber';

const TONE_CLASSES: Record<Tone, string> = {
  red: 'bg-red-50 text-red-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
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
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {unit && <p className="text-sm text-slate-500">{unit}</p>}
      </div>
      {children}
    </Card>
  );
}
