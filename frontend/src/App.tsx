import { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Settings, Bell, LogOut, Menu, X, Plus, Zap, Wind, Droplet, TrendingUp, Clock, AlertCircle, ChevronRight, Star, Stethoscope, Users, Shield, ArrowRight, Pulse } from 'lucide-react';
import { User, Hospital, Vital, Appointment } from './types';
import { authAPI, hospitalAPI, vitalAPI, appointmentAPI } from './api';

type Page = 'login' | 'dashboard' | 'hospitals' | 'vitals' | 'appointments' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newVital, setNewVital] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    oxygenLevel: '',
  });

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const res = await authAPI.loginAsGuest();
      if (res.data.success) {
        setUser(res.data.user);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
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
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadHospitals = async () => {
    try {
      const res = await hospitalAPI.getAll();
      if (res.data.success) {
        setHospitals(res.data.hospitals);
      }
    } catch (error) {
      console.error('Failed to load hospitals:', error);
    }
  };

  const loadVitals = async () => {
    try {
      if (user?.id) {
        const res = await vitalAPI.getByUserId(user.id);
        if (res.data.success) {
          setVitals(res.data.vitals);
        }
      }
    } catch (error) {
      console.error('Failed to load vitals:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      if (user?.id) {
        const res = await appointmentAPI.getByUserId(user.id);
        if (res.data.success) {
          setAppointments(res.data.appointments);
        }
      }
    } catch (error) {
      console.error('Failed to load appointments:', error);
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
        alert('✅ Vital signs recorded successfully!');
      }
    } catch (error) {
      console.error('Failed to add vital:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setEmail('');
    setPassword('');
  };

  const handleSOSClick = () => {
    alert('🚨 EMERGENCY ALERT\n\n✓ Ambulance dispatched\n✓ Emergency contacts notified\n✓ Location shared\n\nHelp is on the way.');
  };

  useEffect(() => {
    if (currentPage === 'hospitals' && hospitals.length === 0) {
      loadHospitals();
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'vitals') {
      loadVitals();
    }
  }, [currentPage, user]);

  useEffect(() => {
    if (currentPage === 'appointments') {
      loadAppointments();
    }
  }, [currentPage, user]);

  if (!user) {
    return <LoginPage onGuestLogin={handleGuestLogin} onLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} loading={loading} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-20 bg-white/80 backdrop-blur-sm border-r border-purple-200">
        <div className="p-6 flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>
        <nav className="flex-1 flex flex-col items-center gap-8 py-12">
          <NavIconButton icon={Activity} active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} title="Dashboard" />
          <NavIconButton icon={MapPin} active={currentPage === 'hospitals'} onClick={() => setCurrentPage('hospitals')} title="Hospitals" />
          <NavIconButton icon={Droplet} active={currentPage === 'vitals'} onClick={() => setCurrentPage('vitals')} title="Vitals" />
          <NavIconButton icon={Clock} active={currentPage === 'appointments'} onClick={() => setCurrentPage('appointments')} title="Appointments" />
        </nav>
        <div className="p-6 flex flex-col gap-6">
          <NavIconButton icon={Settings} onClick={() => setCurrentPage('profile')} title="Profile" />
          <NavIconButton icon={LogOut} onClick={handleLogout} title="Logout" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">LifeLine AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={handleLogout} className="p-2.5 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && <DashboardPage user={user} handleSOSClick={handleSOSClick} vitals={vitals} hospitals={hospitals} loadVitals={loadVitals} />}
          {currentPage === 'hospitals' && <HospitalsPage hospitals={hospitals} />}
          {currentPage === 'vitals' && <VitalsPage vitals={vitals} newVital={newVital} setNewVital={setNewVital} onAddVital={handleAddVital} />}
          {currentPage === 'appointments' && <AppointmentsPage appointments={appointments} />}
          {currentPage === 'profile' && <ProfilePage user={user} />}
        </main>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-screen flex flex-col p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-8 text-slate-900">Menu</h2>
            <nav className="flex flex-col gap-3 flex-1">
              <MobileNavButton label="Dashboard" active={currentPage === 'dashboard'} onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }} />
              <MobileNavButton label="Hospitals" active={currentPage === 'hospitals'} onClick={() => { setCurrentPage('hospitals'); setMobileMenuOpen(false); }} />
              <MobileNavButton label="Vitals" active={currentPage === 'vitals'} onClick={() => { setCurrentPage('vitals'); setMobileMenuOpen(false); }} />
              <MobileNavButton label="Appointments" active={currentPage === 'appointments'} onClick={() => { setCurrentPage('appointments'); setMobileMenuOpen(false); }} />
            </nav>
            <div className="flex flex-col gap-2 pt-6 border-t border-slate-200">
              <MobileNavButton label="Settings" onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }} />
              <MobileNavButton label="Logout" onClick={handleLogout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginPage({ onGuestLogin, onLogin, email, setEmail, password, setPassword, loading }: any) {
  return (
    <div className="min-h-screen flex items-stretch bg-white overflow-hidden">
      {/* Left Side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-24">
        <div className="max-w-md mx-auto w-full space-y-12">
          {/* Logo & Title */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">LifeLine AI</h1>
                <p className="text-slate-500 text-sm">Healthcare Platform</p>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Your Health,<br/>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Our Priority</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Monitor your vitals, connect with hospitals, and manage your health securely
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-700 font-semibold">Real-time Health Monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-700 font-semibold">Find Hospitals Instantly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-700 font-semibold">Secure Your Health Data</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-6 pt-6">
            <h3 className="text-2xl font-bold text-slate-900">Get Started</h3>

            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-semibold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold hover:shadow-xl transition-all hover:scale-105 text-lg flex items-center justify-center gap-2 mt-2"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-slate-600 font-semibold text-sm">OR</span>
              </div>
            </div>

            <button
              onClick={onGuestLogin}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold transition-all text-lg"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue as Guest'}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Demo: Use any email and password, or continue as guest
            </p>
            <p className="text-xs text-slate-400">
              By signing in, you agree to our <a href="#" className="text-purple-600 hover:underline">Terms</a> and <a href="#" className="text-purple-600 hover:underline">Privacy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden items-center justify-center p-12">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute right-20 top-1/2 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center space-y-12 max-w-md">
          {/* Health Icons Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all">
              <Pulse className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-white/90 text-sm font-semibold">Health<br/>Monitor</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all">
              <MapPin className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-white/90 text-sm font-semibold">Find<br/>Hospitals</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all">
              <Droplet className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-white/90 text-sm font-semibold">Track<br/>Vitals</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all">
              <Stethoscope className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-white/90 text-sm font-semibold">Consult<br/>Doctors</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/30 space-y-4">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Trusted by Healthcare Professionals</p>
            <div className="flex justify-around">
              <div>
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-white/70 text-xs">Active Users</p>
              </div>
              <div className="w-px bg-white/20"></div>
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-white/70 text-xs">Hospitals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ user, handleSOSClick, vitals }: any) {
  const lastVital = vitals?.[0];

  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Section with Better Heading Hierarchy */}
        <div className="space-y-4">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Welcome</p>
          <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
            Hello,<br/>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* Emergency SOS */}
        <button onClick={handleSOSClick} className="w-full group">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:shadow-2xl transition-all hover:scale-105">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-32 -top-32 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-white/30 flex items-center justify-center backdrop-blur-sm border-2 border-white/50 shrink-0 shadow-lg animate-pulse">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl md:text-4xl font-bold text-white">Emergency Help</h3>
                  <p className="text-red-50 mt-2 text-lg">One-tap access to immediate assistance</p>
                </div>
              </div>
              <ChevronRight className="w-10 h-10 text-white shrink-0 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </button>

        {/* Section Title */}
        <div className="space-y-3 pt-6">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Health Status</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Your Vitals</h2>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard icon={Heart} label="Heart Rate" value={lastVital?.heartRate ? `${lastVital.heartRate}` : '--'} unit="bpm" color="red" />
          <MetricCard icon={Wind} label="Blood Pressure" value={lastVital?.bloodPressure || '--'} unit="" color="purple" />
          <MetricCard icon={Zap} label="Oxygen Level" value={lastVital?.oxygenLevel ? `${lastVital.oxygenLevel}` : '--'} unit="%" color="blue" />
          <MetricCard icon={TrendingUp} label="Temperature" value={lastVital?.temperature ? `${lastVital.temperature}` : '--'} unit="°F" color="orange" />
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-3 pt-6">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Services</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ActionButton icon={Droplet} label="Record Vitals" />
          <ActionButton icon={MapPin} label="Find Hospital" />
          <ActionButton icon={Clock} label="Book Appointment" />
          <ActionButton icon={Activity} label="Health Tips" />
          <ActionButton icon={TrendingUp} label="Reports" />
          <ActionButton icon={Stethoscope} label="Consultations" />
        </div>

        {/* Recent Activity */}
        {vitals.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="space-y-3">
              <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Activity</p>
              <h2 className="text-4xl font-bold text-slate-900">Recent Records</h2>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-4">
              {vitals.slice(0, 4).map((vital: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:shadow-lg transition-all">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{new Date(vital.recordedAt).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-500">HR: {vital.heartRate} • BP: {vital.bloodPressure} • O₂: {vital.oxygenLevel}%</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HospitalsPage({ hospitals }: any) {
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-4">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Network</p>
          <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
            Nearby<br/>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Hospitals</span>
          </h1>
          <p className="text-xl text-slate-600">Find and connect with quality healthcare facilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hospitals?.map((hospital: Hospital) => (
            <div key={hospital._id} className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:scale-105 hover:border-purple-300">
              <div className="p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">{hospital.name}</h3>
                    <p className="text-slate-600 text-base mt-2">{hospital.address}</p>
                    <p className="text-slate-500 text-sm mt-2">📞 {hospital.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-full shrink-0 shadow-lg">
                    <Star className="w-5 h-5 text-white fill-white" />
                    <span className="font-bold text-white">{hospital.rating}</span>
                  </div>
                </div>

                <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl border-2 border-purple-200 shadow-lg">
                  <p className="text-sm text-white/90 font-bold mb-3">Bed Availability</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-purple-600">{hospital.availableBeds}</span>
                    </div>
                    <p className="text-white text-lg"><span className="font-bold">{hospital.availableBeds}</span> of <span className="font-bold">{hospital.beds}</span> beds available</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold text-slate-600 mb-4 uppercase tracking-wider">Specialties</p>
                  <div className="flex flex-wrap gap-3">
                    {hospital.specialties.map((spec: string, idx: number) => (
                      <span key={idx} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 text-sm font-bold rounded-full border-2 border-purple-300">{spec}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-8 border-t-2 border-slate-200">
                  <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105">Call</button>
                  <button className="flex-1 py-3 bg-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-300 transition-all hover:scale-105">Directions</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VitalsPage({ vitals, newVital, setNewVital, onAddVital }: any) {
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-4">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Tracking</p>
          <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
            Health<br/>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Vitals</span>
          </h1>
          <p className="text-xl text-slate-600">Monitor your vital signs for better health insights</p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-10 shadow-lg">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">Record New Vitals</h3>
          <form onSubmit={onAddVital} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <VitalInput label="Heart Rate" placeholder="72" value={newVital.heartRate} onChange={(e) => setNewVital({ ...newVital, heartRate: e.target.value })} />
              <VitalInput label="Blood Pressure" placeholder="120/80" value={newVital.bloodPressure} onChange={(e) => setNewVital({ ...newVital, bloodPressure: e.target.value })} />
              <VitalInput label="Temperature" placeholder="98.6" value={newVital.temperature} onChange={(e) => setNewVital({ ...newVital, temperature: e.target.value })} />
              <VitalInput label="Oxygen Level" placeholder="98" value={newVital.oxygenLevel} onChange={(e) => setNewVital({ ...newVital, oxygenLevel: e.target.value })} />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105 text-lg">
              Record Vitals
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">History</p>
          <h2 className="text-3xl font-bold text-slate-900">Vitals History</h2>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-10 shadow-lg space-y-4">
          {vitals?.length === 0 ? (
            <p className="text-center py-12 text-slate-500 text-lg">No vitals recorded yet.</p>
          ) : (
            vitals.map((vital: Vital, idx: number) => (
              <div key={idx} className="p-6 hover:bg-slate-50 rounded-xl border-2 border-slate-200 transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{new Date(vital.recordedAt).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-500">{new Date(vital.recordedAt).toLocaleTimeString()}</p>
                  </div>
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <VitalMetric label="Heart Rate" value={`${vital.heartRate} bpm`} />
                  <VitalMetric label="Blood Pressure" value={vital.bloodPressure} />
                  <VitalMetric label="Temperature" value={`${vital.temperature}°F`} />
                  <VitalMetric label="Oxygen" value={`${vital.oxygenLevel}%`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AppointmentsPage({ appointments }: any) {
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Schedule</p>
            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Your<br/>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Appointments</span>
            </h1>
          </div>
          <button className="hidden md:flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 text-lg shrink-0">
            <Plus className="w-6 h-6" />
            New
          </button>
        </div>

        {appointments?.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-20 text-center shadow-lg">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Clock className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-700 text-2xl font-bold">No appointments scheduled</p>
            <p className="text-slate-500 mt-3 text-lg">Book your first appointment</p>
            <button className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
              Schedule Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map((apt: Appointment, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{apt.reason}</h3>
                      <p className="text-sm text-slate-500">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="px-6 py-2 bg-green-500 text-white font-bold rounded-full text-sm shadow-lg">{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilePage({ user }: any) {
  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-4">
          <p className="text-lg font-bold text-purple-600 uppercase tracking-wider">Account</p>
          <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
            Profile<br/>
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Settings</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 shadow-lg">
          <div className="flex items-center gap-8 mb-12 pb-12 border-b-2 border-slate-200">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-xl flex-shrink-0">
              <Heart className="w-14 h-14 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-600 text-lg mt-2">{user.email || 'Guest User'}</p>
              <div className="mt-4">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">{user.userType.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <VitalInput label="Full Name" value={user.name} />
            <VitalInput label="Email Address" value={user.email || ''} />
            <VitalInput label="Account Type" value={user.userType} disabled />
            <button className="w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105 text-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const Check = ({ className }: any) => <div className={`text-xs ${className}`}>✓</div>;

function NavIconButton({ icon: Icon, active, onClick, title }: any) {
  return (
    <button onClick={onClick} title={title} className={`p-3.5 rounded-2xl transition-all ${active ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-600'}`}>
      <Icon className="w-6 h-6" />
    </button>
  );
}

function MobileNavButton({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-4 py-3 rounded-lg font-bold transition-all text-left ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
      {label}
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, unit, color }: any) {
  const colorMap: any = {
    red: 'from-red-500 to-rose-500 text-red-600',
    purple: 'from-purple-500 to-pink-500 text-purple-600',
    blue: 'from-blue-500 to-cyan-500 text-blue-600',
    orange: 'from-orange-500 to-amber-500 text-orange-600',
  };

  const bgColorMap: any = {
    red: 'from-red-100 to-rose-100',
    purple: 'from-purple-100 to-pink-100',
    blue: 'from-blue-100 to-cyan-100',
    orange: 'from-orange-100 to-amber-100',
  };

  return (
    <div className={`bg-gradient-to-br ${bgColorMap[color]} rounded-3xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
      <Icon className={`w-10 h-10 ${colorMap[color]} mb-6`} />
      <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-semibold text-slate-600">{unit}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: any) {
  return (
    <button className="p-6 bg-white hover:shadow-lg rounded-2xl border-2 border-slate-200 hover:border-purple-300 transition-all group">
      <Icon className="w-7 h-7 text-purple-600 group-hover:text-blue-600 mx-auto mb-3" />
      <p className="text-sm font-bold text-slate-700 group-hover:text-purple-600 text-center line-clamp-2">{label}</p>
    </button>
  );
}

function VitalInput({ label, placeholder = '', value = '', onChange = () => {}, disabled = false }: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-800 mb-3">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
      />
    </div>
  );
}

function VitalMetric({ label, value }: any) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
