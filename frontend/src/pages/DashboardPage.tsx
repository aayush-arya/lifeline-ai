import { useState } from 'react';
import { Heart, Wind, Zap, TrendingUp, AlertTriangle, ChevronRight, Droplet, MapPin, Clock, Activity, Stethoscope, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActionButton } from '../components/dashboard/ActionButton';
import { Sparkline } from '../components/ui/Sparkline';
import { useAppContext } from '../lib/outletContext';

const HEALTH_TIPS = [
  'Drink at least 8 glasses of water a day to stay properly hydrated.',
  'Aim for 7-9 hours of sleep each night to support heart and immune health.',
  'Take a 10-minute walk after meals to help regulate blood sugar.',
  'Check your blood pressure regularly, especially if you have a family history of hypertension.',
  'Practice deep breathing for 5 minutes daily to reduce stress and lower resting heart rate.',
  'Limit sodium intake to under 2,300mg a day to support healthy blood pressure.',
];

export function DashboardPage() {
  const { user, vitals, onSOSClick, onRecordVitals, onFindHospital, onOpenBooking } = useAppContext();
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const lastVital = vitals?.[0];
  const heartRates = vitals.slice(0, 7).map((v) => Number(v.heartRate) || 0).filter(Boolean);
  const avg = (key: 'heartRate' | 'oxygenLevel') =>
    vitals.length ? Math.round(vitals.reduce((s, v) => s + Number(v[key] || 0), 0) / vitals.length) : 0;

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Welcome back</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Hello, {user.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <button onClick={onSOSClick} className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-2xl">
          <div className="rounded-2xl p-6 md:p-8 bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white">Emergency Help</h3>
                <p className="text-red-100 mt-1 text-sm">One-tap access to immediate assistance</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Your Vitals</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={Heart} label="Heart Rate" value={lastVital?.heartRate ? `${lastVital.heartRate}` : '--'} unit="bpm" tone="red">
              {heartRates.length > 1 && <Sparkline values={heartRates} colorClassName="bg-red-500" />}
            </MetricCard>
            <MetricCard icon={Wind} label="Blood Pressure" value={lastVital?.bloodPressure || '--'} tone="indigo" />
            <MetricCard icon={Zap} label="Oxygen Level" value={lastVital?.oxygenLevel ? `${lastVital.oxygenLevel}` : '--'} unit="%" tone="blue" />
            <MetricCard icon={TrendingUp} label="Temperature" value={lastVital?.temperature ? `${lastVital.temperature}` : '--'} unit="°F" tone="amber" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <ActionButton icon={Droplet} label="Record Vitals" onClick={onRecordVitals} />
            <ActionButton icon={MapPin} label="Find Hospital" onClick={onFindHospital} />
            <ActionButton icon={Clock} label="Book Appointment" onClick={onOpenBooking} />
            <ActionButton icon={Activity} label="Health Tips" onClick={() => setShowTipsModal(true)} />
            <ActionButton icon={TrendingUp} label="Reports" onClick={() => setShowReportsModal(true)} />
            <ActionButton icon={Stethoscope} label="Consultations" onClick={onFindHospital} />
          </div>
        </div>

        {vitals.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Recent Records</p>
            <Card className="divide-y divide-slate-100 dark:divide-slate-800">
              {vitals.slice(0, 4).map((vital, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{new Date(vital.recordedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">HR: {vital.heartRate} · BP: {vital.bloodPressure} · O₂: {vital.oxygenLevel}%</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {showTipsModal && (
        <Modal title="Health Tips" onClose={() => setShowTipsModal(false)}>
          <ul className="space-y-3.5">
            {HEALTH_TIPS.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {showReportsModal && (
        <Modal title="Health Report" onClose={() => setShowReportsModal(false)}>
          {vitals.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No vitals recorded yet — record some vitals to see your report.</p>
          ) : (
            <div className="space-y-3">
              {[
                ['Total Records', String(vitals.length)],
                ['Average Heart Rate', `${avg('heartRate')} bpm`],
                ['Average Oxygen Level', `${avg('oxygenLevel')}%`],
                ['Latest Blood Pressure', vitals[0]?.bloodPressure || '--'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{value}</p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
