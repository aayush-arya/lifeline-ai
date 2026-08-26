import { Plus, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Modal } from '../components/ui/Modal';
import type { Hospital } from '../types';
import { useAppContext } from '../lib/outletContext';

export function AppointmentsPage() {
  const {
    appointments,
    hospitals,
    showBookingModal,
    setShowBookingModal,
    bookingForm,
    setBookingForm,
    onBookAppointment,
    onOpenBooking,
  } = useAppContext();

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Schedule</p>
            <h1 className="text-3xl font-bold text-slate-900">Your Appointments</h1>
          </div>
          <Button onClick={onOpenBooking} className="hidden md:inline-flex shrink-0">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>

        {appointments.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Clock className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-700 text-lg font-bold">No appointments scheduled</p>
            <p className="text-slate-500 mt-1.5 text-sm">Book your first appointment</p>
            <Button onClick={onOpenBooking} className="mt-6 mx-auto">
              Schedule Now
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt, idx) => (
              <Card key={idx} hoverable className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{apt.reason}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(apt.appointmentDate as unknown as string).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs shrink-0">
                  {apt.status}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showBookingModal && (
        <Modal title="Book Appointment" onClose={() => setShowBookingModal(false)}>
          <form onSubmit={onBookAppointment} className="space-y-4">
            <div>
              <label htmlFor="hospital-select" className="block text-sm font-semibold text-slate-700 mb-1.5">Hospital</label>
              <select
                id="hospital-select"
                required
                value={bookingForm.hospitalId}
                onChange={(e) => setBookingForm({ ...bookingForm, hospitalId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="">Select a hospital</option>
                {hospitals?.map((h: Hospital) => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>
            </div>
            <TextField
              label="Reason for Visit"
              placeholder="Annual check-up"
              value={bookingForm.reason}
              onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
            />
            <TextField
              label="Date & Time"
              type="datetime-local"
              required
              value={bookingForm.date}
              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
            />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Confirm
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
