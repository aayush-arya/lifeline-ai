import { Heart, Activity, MapPin, Droplet, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';

interface LoginPageProps {
  onGuestLogin: () => void;
  onLogin: (e: React.FormEvent) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
}

const FEATURES = ['Real-time Health Monitoring', 'Find Hospitals Instantly', 'Secure Your Health Data'];

export function LoginPage({ onGuestLogin, onLogin, email, setEmail, password, setPassword, loading }: LoginPageProps) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md mx-auto w-full space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">LifeLine AI</h1>
              <p className="text-slate-500 text-xs">Healthcare Platform</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              Your Health,<br />
              <span className="text-indigo-600">Our Priority</span>
            </h2>
            <p className="text-lg text-slate-600">
              Monitor your vitals, connect with hospitals, and manage your health securely.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                <span className="text-slate-700 text-sm font-medium">{f}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Get Started</h3>
            <form onSubmit={onLogin} className="space-y-4">
              <TextField
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-slate-500 text-xs font-semibold">OR</span>
              </div>
            </div>

            <Button variant="secondary" size="lg" className="w-full" onClick={onGuestLogin} disabled={loading}>
              {loading ? 'Loading...' : 'Continue as Guest'}
            </Button>
          </div>

          <div className="text-center space-y-1.5 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">Demo account: demo@lifeline.ai / demo1234 — or continue as guest</p>
            <p className="text-xs text-slate-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-indigo-600 hover:underline">Privacy</a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -left-16 bottom-16 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center space-y-10 max-w-md">
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: Activity, label: 'Health\nMonitor' },
              { icon: MapPin, label: 'Find\nHospitals' },
              { icon: Droplet, label: 'Track\nVitals' },
              { icon: Stethoscope, label: 'Consult\nDoctors' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/20">
                <Icon className="w-7 h-7 text-white mx-auto mb-2.5" />
                <p className="text-white/90 text-sm font-semibold whitespace-pre-line">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/20 space-y-3">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Trusted by Healthcare Professionals</p>
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-white/60 text-xs">Active Users</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-white/60 text-xs">Hospitals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
