import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Store,
  Settings,
  ArrowLeft,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { demoStore } from '@/data/demo';

const sidebarNav = [
  { to: '/merchant', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/merchant/products', label: 'Products', icon: Package },
  { to: '/merchant/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/merchant/store', label: 'Store', icon: Store },
  { to: '/merchant/settings', label: 'Settings', icon: Settings },
];

export function MerchantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-brand-200/60">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={closeSidebar}>
          <div className="w-8 h-8 rounded-lg bg-brand-900 flex items-center justify-center group-hover:bg-brand-800 transition-colors">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-900 truncate">{demoStore.name}</p>
            <p className="text-2xs text-brand-400">Merchant Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-brand-500 hover:bg-brand-100 hover:text-brand-700'
              }`
            }
            onClick={closeSidebar}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* DEMO badge */}
      <div className="px-5 py-4 border-t border-brand-200/60">
        <div className="bg-accent-50 rounded-xl px-3 py-2.5 border border-accent-100">
          <p className="text-2xs font-semibold text-accent-700 uppercase tracking-wider">Demo Mode</p>
          <p className="text-2xs text-accent-600/70 mt-0.5">All data is simulated</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop sidebar - always visible on lg+ */}
      <aside className="w-64 bg-white border-r border-brand-200/60 flex flex-col shrink-0 sticky top-0 h-screen max-lg:hidden">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-brand-900/40" />
      </div>

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-brand-200/60 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={closeSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-500 hover:bg-brand-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-brand-200/60 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center text-brand-500 hover:bg-brand-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <Link to="/" className="text-brand-400 hover:text-brand-600 transition-colors max-lg:hidden">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="relative">
              <Search className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                aria-label="Search products"
                className="h-9 pl-9 pr-4 bg-surface-100 border border-brand-200/60 rounded-lg text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 focus:border-accent-400 w-48 sm:w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center text-brand-500 hover:bg-brand-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-500 rounded-full border-2 border-white text-2xs text-white font-bold flex items-center justify-center"
                aria-label={`${3} notifications`}
              >
                3
              </span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-brand-200/60">
              <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold">
                M
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-brand-400 max-sm:hidden" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
