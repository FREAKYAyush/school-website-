import React from 'react';
import { StaffMember } from '../types.ts';
import { UserCheck, Mail, Award, BookOpen, GraduationCap, School } from 'lucide-react';

interface StaffPageProps {
  staff: StaffMember[];
}

export const StaffPage: React.FC<StaffPageProps> = ({ staff }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Dedicated Educators & Leadership
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Teaching & Administrative Faculty
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our experienced, qualified teachers and administrative personnel are devoted to imparting values, critical understanding, and syllabus excellence to every student.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Faculty Avatar Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-800 to-slate-900 text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0">
                  {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-900 mt-0.5">
                    {member.designation}
                  </p>
                </div>
              </div>

              {/* Department & Qualification */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
                    <span className="font-medium text-slate-800">{member.department}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Qualification</span>
                    <span className="font-medium text-slate-800">{member.qualification}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Teaching Experience</span>
                    <span className="font-medium text-slate-800">{member.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email link if available */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-blue-700 hover:underline truncate"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </a>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Faculty</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
