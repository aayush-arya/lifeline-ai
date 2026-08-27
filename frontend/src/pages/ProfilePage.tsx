import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Badge } from '../components/ui/Badge';
import { useAppContext } from '../lib/outletContext';

export function ProfilePage() {
  const { user, onSaveProfile } = useAppContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSaveProfile({ name, email });
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Account</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Profile Settings</h1>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <Heart className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{user.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{user.email || 'Guest User'}</p>
              <div className="mt-3">
                <Badge variant="info">{user.userType.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Account Type" value={user.userType} disabled />
            <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
