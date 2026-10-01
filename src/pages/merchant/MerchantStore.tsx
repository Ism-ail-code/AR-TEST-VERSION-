import { demoStore } from '@/data/products';
import { MapPin, Mail, Globe } from 'lucide-react';

export function MerchantStore() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-brand-900 tracking-tight mb-1">Store</h1>
      <p className="text-sm text-brand-500 mb-6">Manage your store settings</p>

      <div className="bg-white rounded-2xl p-6 border border-brand-200/60">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-brand-900 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-900">{demoStore.name}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-brand-600"><Mail className="w-4 h-4 text-brand-400" />{demoStore.contact.email}</div>
          <div className="flex items-center gap-2 text-brand-600"><Globe className="w-4 h-4 text-brand-400" />{demoStore.contact.website}</div>
          <div className="flex items-center gap-2 text-brand-600 col-span-2"><MapPin className="w-4 h-4 text-brand-400" />{demoStore.location.address}, {demoStore.location.city}, {demoStore.location.state} {demoStore.location.postalCode}</div>
        </div>
      </div>
    </div>
  );
}
