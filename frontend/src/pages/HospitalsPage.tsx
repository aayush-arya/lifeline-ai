import { Star, Phone, Navigation } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Hospital } from '../types';
import { useAppContext } from '../lib/outletContext';

function occupancyTone(availableBeds: number, beds: number) {
  const pct = beds > 0 ? availableBeds / beds : 0;
  if (pct > 0.3) return { bar: 'bg-emerald-500', text: 'text-emerald-700' };
  if (pct > 0.1) return { bar: 'bg-amber-500', text: 'text-amber-700' };
  return { bar: 'bg-red-500', text: 'text-red-700' };
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  const pct = hospital.beds > 0 ? Math.round((hospital.availableBeds / hospital.beds) * 100) : 0;
  const tone = occupancyTone(hospital.availableBeds, hospital.beds);

  return (
    <Card hoverable className="p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{hospital.name}</h3>
          <p className="text-slate-500 text-sm mt-1">{hospital.address}</p>
          {hospital.distanceKm != null && (
            <p className="text-indigo-600 font-semibold text-xs mt-1.5">{hospital.distanceKm} km away</p>
          )}
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-amber-700 text-sm">{hospital.rating}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Bed availability</span>
          <span className={`font-semibold ${tone.text}`}>{hospital.availableBeds} / {hospital.beds} available</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${tone.bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {hospital.specialties.map((spec) => (
          <span key={spec} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
            {spec}
          </span>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <a
          href={hospital.phone ? `tel:${hospital.phone}` : (hospital.mapsUrl || '#')}
          target={hospital.phone ? undefined : '_blank'}
          rel="noreferrer"
          className="flex-1"
        >
          <Button variant="primary" className="w-full">
            <Phone className="w-4 h-4" />
            Call
          </Button>
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button variant="secondary" className="w-full">
            <Navigation className="w-4 h-4" />
            Directions
          </Button>
        </a>
      </div>
    </Card>
  );
}

export function HospitalsPage() {
  const { hospitals, hospitalsSource, locationDenied, onRetryLocation } = useAppContext();

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Network</p>
          <h1 className="text-3xl font-bold text-slate-900">Nearby Hospitals</h1>
          <p className="text-sm text-slate-500">Find and connect with quality healthcare facilities</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live bed availability · {hospitalsSource === 'google-places' ? 'Real hospitals near your location' : 'Demo data (simulated)'}
        </div>

        {locationDenied && (
          <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 font-medium text-sm">Enable location access to see hospitals nearest to you.</p>
            <Button variant="primary" size="sm" onClick={onRetryLocation} className="shrink-0 bg-amber-600 hover:bg-amber-700">
              Enable Location
            </Button>
          </div>
        )}

        {hospitals.length === 0 ? (
          <Card className="p-16 text-center text-slate-500 text-sm">Loading nearby hospitals…</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
