import React from 'react';
import { SchoolInfo } from '../types.ts';
import { SchoolEmblem } from './Emblem.tsx';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  schoolInfo: SchoolInfo | null;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ schoolInfo, onSelectTab }) => {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-emerald-600">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SchoolEmblem size={54} variant="white" />
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block">
                  {schoolInfo?.hindiName || 'उत्क्रमित उच्च माध्यमिक विद्यालय'}
                </span>
                <span className="text-base font-bold text-white tracking-tight leading-tight block">
                  {schoolInfo?.name || 'UHS MADHULATA'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utkramit High School Madhulata is committed to fostering academic brilliance, character formation, and equal opportunity for every student in Bishanpur Panchayat, Raniganj, Araria.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p><span className="text-slate-300 font-medium">BSEB Affiliation:</span> Patna</p>
              <p><span className="text-slate-300 font-medium">U-DISE Code:</span> {schoolInfo?.udiseCode || '10070804607'}</p>
              <p><span className="text-slate-300 font-medium">Established:</span> {schoolInfo?.estd || '1960'}</p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About School & History' },
                { id: 'notices', label: 'School Notice Board' },
                { id: 'academics', label: 'Academics & Examination' },
                { id: 'facilities', label: 'Campus Facilities' },
                { id: 'gallery', label: 'Photo & Event Gallery' },
                { id: 'staff', label: 'Teaching & Office Staff' },
                { id: 'contact', label: 'Contact & Directions' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSelectTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left text-slate-400 hover:translate-x-1 duration-150 inline-block"
                  >
                    → {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Important Bihar Education Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Important Portals
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="http://biharboardonline.bihar.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Bihar School Examination Board (BSEB)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://medhasoft.bih.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Medhasoft Student DBT Portal Bihar</span>
                </a>
              </li>
              <li>
                <a
                  href="https://pmsonline.bih.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Post Matric Scholarship Portal (PMS)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://diksha.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>DIKSHA National Digital Learning</span>
                </a>
              </li>
              <li>
                <a
                  href="https://state.bihar.gov.in/educationbihar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Education Department, Govt. of Bihar</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details & Administration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Official Contact
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">UHS MADHULATA RANIGANJ ARARIA</p>
                  <p className="text-slate-400">Madhulata, Bishanpur Panchayat</p>
                  <p className="text-slate-400">Post Office: Madhulata</p>
                  <p className="text-slate-400">Police Station: Raniganj</p>
                  <p className="text-slate-400">Araria, Bihar - <span className="font-mono text-emerald-300">854334</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${schoolInfo?.phone || '7631729440'}`} className="hover:text-emerald-400 font-mono">
                  {schoolInfo?.phone || '7631729440'}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${schoolInfo?.email || 'uhsmadhulata607@gmail.com'}`} className="hover:text-emerald-400 break-all">
                  {schoolInfo?.email || 'uhsmadhulata607@gmail.com'}
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectTab('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authorized School Admin Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-black/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {currentYear} UHS MADHULATA RANIGANJ ARARIA. All Rights Reserved.</p>
          <p className="flex items-center gap-3">
            <span>Raniganj, Araria, Bihar - 854334</span>
            <span>·</span>
            <span>Developed for Rural Education Advancement</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
