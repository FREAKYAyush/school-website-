import React, { useState } from 'react';
import { AcademicData } from '../types.ts';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  ClipboardList,
  Utensils,
  CheckCircle,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface AcademicsPageProps {
  academics: AcademicData | null;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ academics }) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'calendar' | 'exams' | 'guidelines' | 'middaymeal'>('classes');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Curriculum, Examinations & Calendar
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Academic Programs & Standards
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Conforming strictly to the Bihar School Examination Board (BSEB), Patna curriculum standards, NEP guidelines, and state government secondary educational goals.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm">
        {[
          { id: 'classes', label: 'Classes & Streams', icon: GraduationCap },
          { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
          { id: 'exams', label: 'Examinations & Evaluation', icon: FileCheck },
          { id: 'guidelines', label: 'Student Guidelines', icon: ClipboardList },
          { id: 'middaymeal', label: 'PM POSHAN Meal Plan', icon: Utensils }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-blue-700 text-blue-900 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Classes & Streams */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(academics?.classes || []).map((cls, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                    {cls.ageGroup} · {cls.medium}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {cls.classLevel}
                  </h3>
                  <div className="text-xs font-medium text-blue-800 bg-blue-50 px-2.5 py-1 rounded inline-block mb-3">
                    {cls.streams}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Subjects Offered:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {cls.subjects.map((sub, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  Affiliated Course: BSEB Patna syllabus
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Academic Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0 text-blue-700" />
            <span>
              Academic session runs from April to March. Dates are subject to Bihar Education Department notices.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(academics?.calendar || []).map((cal, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
                  {cal.month}
                </h3>
                <div className="space-y-2.5">
                  {cal.events.map((ev, eIdx) => (
                    <div key={eIdx} className="flex items-start gap-2.5 text-xs">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                        {ev.date}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-slate-800 font-medium block leading-tight">
                          {ev.title}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {ev.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Examinations & Evaluation */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">
            Evaluation Pattern & Board Examinations
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {academics?.evaluationPattern ||
              'Evaluation strictly conforms to the Bihar School Examination Board (BSEB) continuous and terminal evaluation framework. Assessments comprise periodic unit tests, quarterly terminal examinations, science lab practicals, project assignments, and annual board examinations.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Internal Continuous Assessment</h4>
              <p className="text-xs text-slate-600">
                Monthly unit tests, notebook checking, homework completion, oral assessments, and class attendance monitoring (min 75% attendance mandatory).
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">BSEB Matric & Intermediate Boards</h4>
              <p className="text-xs text-slate-600">
                Annual Matriculation (Class 10) and Intermediate (Class 12) examinations conducted by BSEB at designated examination sub-centers with strict invigilation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">
            Student Code of Conduct & Rules
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            {(academics?.guidelines || []).map((guide, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>{guide}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 5: Mid-Day Meal */}
      {activeTab === 'middaymeal' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                PM POSHAN / Mid-Day Meal Nutrition Program
              </h2>
              <p className="text-xs text-slate-500">
                Government of Bihar Nutritional Standard Initiative
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {academics?.midDayMealInfo ||
              'Under the Government of Bihar PM POSHAN (Mid-Day Meal) scheme, warm, freshly cooked nutritious meals are served daily to students with weekly menus including khichdi, green vegetables, dal, rice, seasonal fruits, and boiled eggs/soya bean on allocated days.'}
          </p>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-100 p-3 font-bold text-slate-800 border-b border-slate-200">
              Weekly Meal Distribution Overview
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-3 flex justify-between">
                <span className="font-semibold text-slate-800">Monday & Thursday:</span>
                <span className="text-slate-600">Steamed Rice, Protein Lentil Dal, Mixed Vegetable Sabzi</span>
              </div>
              <div className="p-3 flex justify-between bg-slate-50/50">
                <span className="font-semibold text-slate-800">Tuesday & Friday:</span>
                <span className="text-slate-600">Rice, Soya Chunks Curry / Boiled Egg, Seasonal Greens</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-semibold text-slate-800">Wednesday & Saturday:</span>
                <span className="text-slate-600">Nutritious Vegetable Khichdi, Chokha, Seasonal Fruits</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
