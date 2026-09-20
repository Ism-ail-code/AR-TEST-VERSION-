import { Settings, Bell, Shield, Palette } from 'lucide-react';

export function MerchantSettings() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-900 tracking-tight mb-1">Settings</h1>
      <p className="text-sm text-brand-500 mb-6">Manage your account preferences</p>

      <div className="space-y-4">
        {[
          { icon: Bell, title: 'Notifications', desc: 'Configure email and push notification preferences', status: 'Enabled' },
          { icon: Shield, title: 'Security', desc: 'Manage passwords and two-factor authentication', status: 'Active' },
          { icon: Palette, title: 'Appearance', desc: 'Customize your dashboard theme and branding', status: 'Default' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-2xl p-5 border border-brand-200/60 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-900">{item.title}</p>
              <p className="text-xs text-brand-400 mt-0.5">{item.desc}</p>
            </div>
            <span className="text-2xs font-semibold text-brand-400 bg-surface-100 px-2.5 py-1 rounded-full">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
