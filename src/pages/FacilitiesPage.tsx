import React from 'react';
import { Facility } from '../types.ts';
import {
  Building,
  BookOpen,
  FlaskConical,
  Monitor,
  Trophy,
  Droplets,
  ShieldCheck,
  Utensils,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface FacilitiesPageProps {
  facilities: Facility[];
}

const iconMap: Record<string, any> = {
  Building,
  BookOpen,
  FlaskConical,
  Monitor,
  Trophy,
  Droplets,
  ShieldCheck,
  Utensils
};

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ facilities }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            School Infrastructure & Learning Amenities
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Campus Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our campus is equipped with student-friendly, hygienic, and modern infrastructure designed to foster a secure, inspiring, and health-conscious learning environment.
          </p>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac) => {
          const Icon = iconMap[fac.iconName] || Building;
          return (
            <div
              key={fac.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                    {fac.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                {fac.highlights && fac.highlights.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {fac.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Swachh Vidyalaya Verified</span>
                <span>Active 2026</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
