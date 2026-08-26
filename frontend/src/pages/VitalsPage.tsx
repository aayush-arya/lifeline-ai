import { Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Sparkline } from '../components/ui/Sparkline';
import { useAppContext } from '../lib/outletContext';

export function VitalsPage() {
  const { vitals, newVital, setNewVital, onAddVital } = useAppContext();
  const heartRates = vitals.slice(0, 10).map((v) => Number(v.heartRate) || 0).filter(Boolean);

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Tracking</p>
          <h1 className="text-3xl font-bold text-slate-900">Health Vitals</h1>
          <p className="text-sm text-slate-500">Monitor your vital signs for better health insights</p>
        </div>

        {heartRates.length > 1 && (
          <Card className="p-6 flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Heart rate trend</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{heartRates[0]} bpm</p>
              <p className="text-xs text-slate-500 mt-0.5">Last {heartRates.length} readings</p>
            </div>
            <div className="h-12 w-40">
              <Sparkline values={heartRates} colorClassName="bg-red-500" />
            </div>
          </Card>
        )}

        <Card className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Record New Vitals</h3>
          <form onSubmit={onAddVital} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                label="Heart Rate"
                placeholder="72"
                value={newVital.heartRate}
                onChange={(e) => setNewVital({ ...newVital, heartRate: e.target.value })}
              />
              <TextField
                label="Blood Pressure"
                placeholder="120/80"
                value={newVital.bloodPressure}
                onChange={(e) => setNewVital({ ...newVital, bloodPressure: e.target.value })}
              />
              <TextField
                label="Temperature"
                placeholder="98.6"
                value={newVital.temperature}
                onChange={(e) => setNewVital({ ...newVital, temperature: e.target.value })}
              />
              <TextField
                label="Oxygen Level"
                placeholder="98"
                value={newVital.oxygenLevel}
                onChange={(e) => setNewVital({ ...newVital, oxygenLevel: e.target.value })}
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Record Vitals
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">History</p>
          {vitals.length === 0 ? (
            <Card className="p-16 text-center text-slate-500 text-sm">No vitals recorded yet.</Card>
          ) : (
            <Card className="divide-y divide-slate-100">
              {vitals.map((vital, idx) => (
                <div key={idx} className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{new Date(vital.recordedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">{new Date(vital.recordedAt).toLocaleTimeString()}</p>
                    </div>
                    <Activity className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      ['Heart Rate', `${vital.heartRate} bpm`],
                      ['Blood Pressure', vital.bloodPressure],
                      ['Temperature', `${vital.temperature}°F`],
                      ['Oxygen', `${vital.oxygenLevel}%`],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                        <p className="text-sm font-bold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
