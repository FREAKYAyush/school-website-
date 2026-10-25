import React from 'react';
import { SchoolInfo } from '../types.ts';
import { SchoolEmblem } from '../components/Emblem.tsx';
import { MapPin, Award, CheckCircle, Target, Compass, BookOpen, Clock, Building2 } from 'lucide-react';

interface AboutPageProps {
  schoolInfo: SchoolInfo | null;
  onSelectTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ schoolInfo, onSelectTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Institutional Profile & Legacy
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            About UHS Madhulata
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Utkramit High School Madhulata is an established government educational institution in Raniganj Block of Araria district, Bihar, dedicated to empowering students from rural backgrounds through modern, comprehensive education.
          </p>
        </div>
      </div>

      {/* Overview & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Story & History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <span>School History & Institutional Background</span>
            </h2>

            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                {schoolInfo?.aboutText ||
                  'Utkramit High School (UHS) Madhulata is a premier government higher secondary institution located in Bishanpur Panchayat, Raniganj block of Araria district, Bihar. Dedicated to universal, inclusive, and qualitative education, the institution provides structured learning from Upper Primary through Secondary (Matric) and Higher Secondary (Intermediate) levels.'}
              </p>
              <p>
                Founded in 1960 as a foundational rural primary institution, the school was progressively upgraded ("Utkramit") to meet the growing secondary and higher secondary aspirations of students across Bishanpur and neighbouring rural settlements. Today, it stands as an educational anchor for over 1,200 young minds, with a special emphasis on girl-child education, digital learning, and preparation for BSEB Board Examinations.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {schoolInfo?.mission ||
                  'To impart accessible, equitable, and top-tier secondary education that builds intellectual curiosity, ethical character, digital awareness, and practical skills among all rural youth.'}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {schoolInfo?.vision ||
                  'To emerge as an exemplary model institution of educational transformation where every student—regardless of socioeconomic background—is inspired to dream big, excel academically, and lead with integrity.'}
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span>Core Institutional Objectives</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {(schoolInfo?.objectives || [
                'Deliver student-centered pedagogy aligned with BSEB and NEP 2020 curriculum standards.',
                'Foster 100% literacy, high secondary passing rates, and active scholarship adoption.',
                'Empower girls and marginalized communities through inclusive schooling and digital literacy.',
                'Maintain modern school infrastructure, clean environmental standards, and robust sports facilities.'
              ]).map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Official Details Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <SchoolEmblem size={44} variant="white" />
              <div>
                <h3 className="text-sm font-bold">School Credentials</h3>
                <p className="text-[11px] text-emerald-400">Govt. of Bihar Recognized</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">School Name</span>
                <span className="font-bold text-white text-sm">{schoolInfo?.name || 'UHS MADHULATA'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Affiliation Board</span>
                <span className="text-white font-medium">{schoolInfo?.affiliation || 'Bihar School Examination Board (BSEB), Patna'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">U-DISE Code</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">{schoolInfo?.udiseCode || '10070804607'}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">School Code</span>
                <span className="text-white font-mono">BSEB Code: 34046</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Year Established</span>
                <span className="text-white font-mono">{schoolInfo?.estd || '1960'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Administrative Jurisdiction</span>
              <div className="space-y-1 text-slate-300">
                <p><span className="text-slate-400">Panchayat:</span> Bishanpur Panchayat</p>
                <p><span className="text-slate-400">Post Office:</span> Madhulata</p>
                <p><span className="text-slate-400">Police Station:</span> Raniganj</p>
                <p><span className="text-slate-400">District:</span> Araria, Bihar</p>
                <p><span className="text-slate-400">PIN Code:</span> <span className="font-mono text-emerald-400 font-bold">854334</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onSelectTab('contact')}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View Complete Location & Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
