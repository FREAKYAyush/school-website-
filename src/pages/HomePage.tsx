import React from 'react';
import { SchoolInfo, Notice, Facility } from '../types.ts';
import { NoticeCard } from '../components/NoticeCard.tsx';
import { SchoolEmblem } from '../components/Emblem.tsx';
import {
  Bell,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  schoolInfo: SchoolInfo | null;
  notices: Notice[];
  facilities: Facility[];
  onSelectTab: (tab: string) => void;
  onReadNotice: (notice: Notice) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  schoolInfo,
  notices,
  facilities,
  onSelectTab,
  onReadNotice
}) => {
  // Get latest 5 published notices
  const latestNotices = notices
    .filter((n) => n.isPublished !== false)
    .slice(0, 5);

  const urgentNotice = notices.find((n) => n.isImportant && n.isPublished !== false);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Breaking / High Priority Notice Ribbon if any */}
      {urgentNotice && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-xs border-b border-amber-600">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="bg-red-700 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide animate-pulse">
                URGENT NOTICE
              </span>
              <span className="truncate max-w-xl text-slate-950 font-bold">
                {urgentNotice.title}
              </span>
            </div>
            <button
              onClick={() => onReadNotice(urgentNotice)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 hover:underline shrink-0 bg-white/40 hover:bg-white/70 px-2.5 py-1 rounded transition-colors"
            >
              <span>Read Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle patterned backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: School Title & Mission */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BSEB Affiliated Secondary & Higher Secondary Institution</span>
              </div>

              <div className="space-y-2">
                <span className="text-sm sm:text-base font-semibold text-emerald-400 tracking-wider uppercase font-sans block">
                  {schoolInfo?.hindiName || 'उत्क्रमित उच्च माध्यमिक विद्यालय, मधुलता'}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {schoolInfo?.name || 'UHS MADHULATA RANIGANJ ARARIA'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-mono pt-1">
                  U-DISE: {schoolInfo?.udiseCode || '10070804607'} · Established {schoolInfo?.estd || '1960'} · Raniganj, Araria (Bihar)
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Dedicated to providing high quality, equitable, and character-building education to every child. Empowering students with modern classrooms, practical science education, digital literacy, and holistic sports in Bishanpur Panchayat.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectTab('notices')}
                  className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all active:scale-95"
                >
                  <Bell className="w-4 h-4" />
                  <span>Check Notice Board</span>
                </button>

                <button
                  onClick={() => onSelectTab('academics')}
                  className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Courses & Academics</span>
                </button>

                <button
                  onClick={() => onSelectTab('contact')}
                  className="flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <span>Contact Office</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">100%</div>
                  <div className="text-xs text-slate-400">Free Textbooks & DBT</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">1,200+</div>
                  <div className="text-xs text-slate-400">Enrolled Students</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">Class 6-12</div>
                  <div className="text-xs text-slate-400">Secondary & +2 Streams</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-blue-400 font-mono">BSEB</div>
                  <div className="text-xs text-slate-400">Patna Curriculum</div>
                </div>
              </div>
            </div>

            {/* Right Column: Institutional Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <SchoolEmblem size={44} variant="white" />
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        Official Notice Dispatch
                      </div>
                      <div className="text-[11px] text-emerald-400">
                        Live Digital Notice Board
                      </div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-300">
                    Latest announcements released by the school administration for students, guardians, and teachers:
                  </p>

                  <div className="space-y-2">
                    {latestNotices.slice(0, 3).map((notice) => (
                      <div
                        key={notice.id}
                        onClick={() => onReadNotice(notice)}
                        className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-emerald-400">{notice.category}</span>
                          <span className="font-mono">{notice.date}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-100 group-hover:text-blue-300 line-clamp-1">
                          {notice.title}
                        </h4>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectTab('notices')}
                    className="w-full mt-2 py-2.5 px-3 text-xs font-bold text-blue-200 bg-blue-900/50 hover:bg-blue-900/80 border border-blue-700/50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View All School Circulars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LATEST NOTICES & NOTIFICATIONS (CRITICAL REQUIREMENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 text-blue-700" />
              <span>Official Circulars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Notices & Notifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Official circulars, examinations, admission dates, and holiday updates published by the school administration.
            </p>
          </div>

          <button
            onClick={() => {
              onSelectTab('notices');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors self-start sm:self-auto shrink-0"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {latestNotices.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-200 text-slate-500">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No new notifications at this time.</p>
            <p className="text-xs text-slate-400 mt-1">Please check back soon for administrative circulars.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onReadMore={onReadNotice}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Headmaster / Principal Message Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Portrait / Emblem Card */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-900 to-emerald-700 flex items-center justify-center text-white shadow-lg p-1.5 mb-4">
                <SchoolEmblem size={96} variant="white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {schoolInfo?.principalName || 'Shri R. K. Mandal'}
              </h3>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                {schoolInfo?.principalDesignation || 'Headmaster / Principal (In-charge)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {schoolInfo?.principalQualification || 'M.Sc., B.Ed. · 22+ Years in Service'}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 w-full text-xs text-slate-500 space-y-1">
                <p>UHS Madhulata, Raniganj</p>
                <p>Araria, Bihar - 854334</p>
              </div>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800">
                <Award className="w-4 h-4 text-blue-700" />
                <span>Message from the Headmaster</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                "Nurturing Character, Scientific Conscience, and Academic Excellence"
              </h2>

              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3 font-normal">
                <p>
                  {schoolInfo?.principalMessage ||
                    'Welcome to Utkramit High School (UHS) Madhulata. Our commitment is to foster holistic education, discipline, scientific temper, and ethical values in every student from our rural community. We strive to provide modern learning facilities, dedicated faculty, and an empowering atmosphere where every child can realize their fullest potential and contribute constructively to society and our nation.'}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  "Education is the most powerful weapon which you can use to change the world. At UHS Madhulata, we welcome parents and guardians as our essential partners in this noble endeavor."
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Equal Learning Opportunities</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Safe & Disciplined Environment</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Co-curricular & Sports Focus</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. School Facilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Campus Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              School Facilities & Amenities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Equipped with student-friendly amenities conforming to state government standards.
            </p>
          </div>

          <button
            onClick={() => {
              onSelectTab('facilities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
          >
            <span>Explore All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {facilities.slice(0, 4).map((facility) => (
            <div
              key={facility.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-xs transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                {facility.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {facility.description}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                {facility.category}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Quick Contact Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold">Have Questions or Need Admissions Assistance?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Reach out to the school administrative counter in Madhulata, Raniganj.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${schoolInfo?.phone || '7631729440'}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {schoolInfo?.phone || '7631729440'}</span>
            </a>

            <button
              onClick={() => onSelectTab('contact')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Contact Form & Map</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
