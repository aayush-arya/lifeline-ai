import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, Hospital, Vital, Appointment } from './types';
import { authAPI, hospitalAPI, vitalAPI, appointmentAPI, userAPI, setAuthToken } from './api';
import { getLocationOnce, type Coordinates } from './lib/geolocation';
import { ToastProvider, useToast } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { VitalsPage } from './pages/VitalsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ProfilePage } from './pages/ProfilePage';
import type { NewVitalForm, BookingForm } from './lib/outletContext';

function AppRoutes() {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalsSource, setHospitalsSource] = useState('mock');
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newVital, setNewVital] = useState<NewVitalForm>({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    oxygenLevel: '',
  });

  const [location_, setLocation] = useState<Coordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({ hospitalId: '', reason: '', date: '' });

  const loadHospitals = async () => {
    try {
      let loc = location_;
      if (!loc) {
        loc = await getLocationOnce();
        setLocationStatus(loc ? 'granted' : 'denied');
        if (loc) setLocation(loc);
      }
      const res = loc ? await hospitalAPI.getNearby(loc.lat, loc.lng) : await hospitalAPI.getAll();
      if (res.data.success) {
        setHospitals(res.data.hospitals);
        setHospitalsSource((res.data as { source?: string }).source || 'mock');
      }
    } catch (error) {
      console.error('Failed to load hospitals:', error);
    }
  };

  const loadVitals = async (uid?: string) => {
    const id = uid || user?.id;
    if (!id) return;
    try {
      const res = await vitalAPI.getByUserId(id);
      if (res.data.success) setVitals(res.data.vitals);
    } catch (error) {
      console.error('Failed to load vitals:', error);
    }
  };

  const loadAppointments = async (uid?: string) => {
    const id = uid || user?.id;
    if (!id) return;
    try {
      const res = await appointmentAPI.getByUserId(id);
      if (res.data.success) setAppointments(res.data.appointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const res = await authAPI.loginAsGuest();
      if (res.data.success) {
        setUser(res.data.user);
        setAuthToken(res.data.token);
        loadVitals(res.data.user.id);
        loadAppointments(res.data.user.id);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showToast('Guest login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authAPI.login(email, password);
      if (res.data.success) {
        setUser(res.data.user);
        setAuthToken(res.data.token);
        loadVitals(res.data.user.id);
        loadAppointments(res.data.user.id);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) return;

      const vitalData = {
        userId: user.id,
        heartRate: parseInt(newVital.heartRate),
        bloodPressure: newVital.bloodPressure,
        temperature: parseFloat(newVital.temperature),
        oxygenLevel: parseInt(newVital.oxygenLevel),
        weight: 0,
        height: 0,
        bloodGlucose: 0,
      };

      const res = await vitalAPI.create(vitalData);
      if (res.data.success) {
        setNewVital({ heartRate: '', bloodPressure: '', temperature: '', oxygenLevel: '' });
        loadVitals();
        showToast('Vital signs recorded successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to add vital:', error);
      showToast('Failed to record vitals. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setEmail('');
    setPassword('');
    setHospitals([]);
    setVitals([]);
    setAppointments([]);
    navigate('/login');
  };

  const handleSOSClick = async () => {
    const loc = location_ || (await getLocationOnce());
    const locText = loc
      ? `location shared (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`
      : 'location unavailable — enable location access for a faster response';
    showToast(`Ambulance dispatched, emergency contacts notified — ${locText}. Help is on the way.`, 'success');
  };

  const openBookingModal = () => {
    navigate('/appointments');
    if (hospitals.length === 0) loadHospitals();
    setShowBookingModal(true);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      const res = await appointmentAPI.create({
        patientId: user.id,
        doctorId: '',
        hospitalId: bookingForm.hospitalId,
        reason: bookingForm.reason,
        appointmentDate: bookingForm.date ? (new Date(bookingForm.date) as unknown as Date) : (new Date() as unknown as Date),
        status: 'scheduled',
        notes: '',
      });
      if (res.data.success) {
        setShowBookingModal(false);
        setBookingForm({ hospitalId: '', reason: '', date: '' });
        loadAppointments();
        showToast('Appointment scheduled successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
      showToast('Failed to schedule appointment. Please try again.', 'error');
    }
  };

  const handleSaveProfile = async ({ name, email: newEmail }: { name: string; email: string }) => {
    if (!user?.id) return;
    try {
      const res = await userAPI.update(user.id, { name, email: newEmail });
      if (res.data.success) {
        setUser(res.data.user);
        showToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  useEffect(() => {
    if (location.pathname !== '/hospitals') return;
    loadHospitals();
    const interval = setInterval(loadHospitals, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location_]);

  useEffect(() => {
    if (location.pathname === '/vitals') loadVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user]);

  useEffect(() => {
    if (location.pathname === '/appointments') loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user]);

  const notificationItems = [
    ...(vitals[0] ? [`Last vitals recorded on ${new Date(vitals[0].recordedAt).toLocaleString()}`] : []),
    ...appointments
      .filter((a) => new Date(a.appointmentDate as unknown as string) > new Date())
      .slice(0, 3)
      .map((a) => `Upcoming: ${a.reason} on ${new Date(a.appointmentDate as unknown as string).toLocaleDateString()}`),
  ];

  const sharedContext = {
    hospitals,
    hospitalsSource,
    locationDenied: locationStatus === 'denied',
    onRetryLocation: () => {
      setLocationStatus('idle');
      setLocation(null);
      loadHospitals();
    },
    vitals,
    newVital,
    setNewVital,
    onAddVital: handleAddVital,
    appointments,
    showBookingModal,
    setShowBookingModal,
    bookingForm,
    setBookingForm,
    onBookAppointment: handleBookAppointment,
    onOpenBooking: openBookingModal,
    onSaveProfile: handleSaveProfile,
    onSOSClick: handleSOSClick,
    onRecordVitals: () => navigate('/vitals'),
    onFindHospital: () => navigate('/hospitals'),
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              onGuestLogin={handleGuestLogin}
              onLogin={handleLogin}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
            />
          )
        }
      />
      <Route element={<AppShell user={user} onLogout={handleLogout} notifications={notificationItems} contextValue={sharedContext} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/vitals" element={<VitalsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
