import React, { useState } from 'react';
import { SchoolInfo } from '../types.ts';
import { SchoolEmblem } from './Emblem.tsx';
import { Phone, Mail, Menu, X, Shield, Bell, MapPin } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  schoolInfo: SchoolInfo | null;
  unreadNoticesCount?: number;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  schoolInfo,
  unreadNoticesCount = 0,
  isAdminLoggedIn = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'notices', label: 'Notices', badge: unreadNoticesCount > 0 ? unreadNoticesCount : undefined },
    { id: 'academics', label: 'Academics' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'staff', label: 'Staff' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      {/* Top Government / School Utility Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs font-normal">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Madhulata, Raniganj, Araria, Bihar</span>
              <span className="sm:hidden">Raniganj, Araria</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-mono">PIN: 854334</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              U-DISE: {schoolInfo?.udiseCode || '10070804607'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${schoolInfo?.phone || '7631729440'}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{schoolInfo?.phone || '7631729440'}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`mailto:${schoolInfo?.email || 'uhsmadhulata607@gmail.com'}`}
              className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Mail className="w-3 h-3 text-emerald-400" />
              <span>{schoolInfo?.email || 'uhsmadhulata607@gmail.com'}</span>
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                isAdminLoggedIn
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3 text-emerald-300" />
              <span>{isAdminLoggedIn ? 'Staff Panel (prince@123)' : 'Staff Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Zone */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none py-2"
          >
            <SchoolEmblem size={52} />
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase font-sans">
                {schoolInfo?.hindiName || 'उत्क्रमित उच्च माध्यमिक विद्यालय, मधुलता'}
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-blue-900 transition-colors">
                {schoolInfo?.name || 'UHS MADHULATA RANIGANJ ARARIA'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Affiliated to BSEB Patna · Established 1960
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'text-blue-900 font-semibold bg-blue-50/80 shadow-xs'
                      : 'hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('notices')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Bell className="w-3.5 h-3.5 text-blue-700 animate-bounce" />
              <span>Notice Board</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('notices')}
              className="p-2 text-blue-800 bg-blue-50 rounded-lg relative sm:hidden"
              aria-label="Notices"
            >
              <Bell className="w-5 h-5" />
              {unreadNoticesCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1 py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentTab === item.id
                    ? 'bg-blue-700 text-white font-semibold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      currentTab === item.id ? 'bg-white text-blue-900' : 'bg-red-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{isAdminLoggedIn ? 'Open Staff Dashboard (prince@123)' : 'Staff Notice Login (prince@123)'}</span>
            </button>
            <div className="text-center text-xs text-slate-500 py-1">
              Raniganj, Araria · PIN 854334 · Tel: 7631729440
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
