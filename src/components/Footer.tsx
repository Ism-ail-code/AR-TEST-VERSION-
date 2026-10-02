import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { demoStore } from '@/data/products';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-brand-300">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{demoStore.name[0]}</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">{demoStore.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-brand-400">
              {demoStore.tagline}
            </p>
            <Link
              to="/merchant"
              className="mt-4 inline-flex items-center gap-1.5 text-2xs text-brand-500 hover:text-white transition-colors"
            >
              Merchant dashboard <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link to="/products" className="text-sm text-brand-400 hover:text-white transition-colors">All furniture</Link></li>
              <li><Link to="/products?room=Living%20Room" className="text-sm text-brand-400 hover:text-white transition-colors">Living Room</Link></li>
              <li><Link to="/products?room=Bedroom" className="text-sm text-brand-400 hover:text-white transition-colors">Bedroom</Link></li>
              <li><Link to="/products?room=Dining" className="text-sm text-brand-400 hover:text-white transition-colors">Dining</Link></li>
              <li><Link to="/products?category=Lighting" className="text-sm text-brand-400 hover:text-white transition-colors">Lighting</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" />
                <span className="text-sm text-brand-400">
                  {demoStore.location.address}<br />
                  {demoStore.location.city}, {demoStore.location.state} {demoStore.location.postalCode}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <a href={`mailto:${demoStore.contact.email}`} className="text-sm text-brand-400 hover:text-white transition-colors">
                  {demoStore.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="text-sm text-brand-400">{demoStore.contact.phone}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-4">Follow</h4>
            <ul className="space-y-2.5">
              {demoStore.socialMedia.instagram && (
                <li>
                  <a href={demoStore.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-white transition-colors inline-flex items-center gap-1">
                    Instagram <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              )}
              {demoStore.socialMedia.pinterest && (
                <li>
                  <a href={demoStore.socialMedia.pinterest} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-white transition-colors inline-flex items-center gap-1">
                    Pinterest <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              )}
              {demoStore.socialMedia.facebook && (
                <li>
                  <a href={demoStore.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-white transition-colors inline-flex items-center gap-1">
                    Facebook <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs text-brand-500">
            &copy; {year} {demoStore.name}. All rights reserved.
          </p>
          <p className="text-2xs text-brand-600">
            Designed in Austin, TX &nbsp;&middot;&nbsp; AR by{' '}
            <span className="text-brand-500">Rapidify</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
