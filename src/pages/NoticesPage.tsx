import React, { useState, useMemo } from 'react';
import { Notice, NoticeCategory } from '../types.ts';
import { NoticeCard } from '../components/NoticeCard.tsx';
import { Bell, Search, Filter, AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';

interface NoticesPageProps {
  notices: Notice[];
  onReadNotice: (notice: Notice) => void;
  isAdminLoggedIn?: boolean;
  onOpenAddNotice?: () => void;
  onSelectTab?: (tab: string) => void;
}

const CATEGORIES = [
  'All',
  'Examination',
  'Academic',
  'Holidays',
  'Admission',
  'Scholarship',
  'General',
  'Sports'
];

export const NoticesPage: React.FC<NoticesPageProps> = ({
  notices,
  onReadNotice,
  isAdminLoggedIn = false,
  onOpenAddNotice,
  onSelectTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => n.isPublished !== false)
      .filter((n) => {
        if (selectedCategory !== 'All' && n.category !== selectedCategory) {
          return false;
        }
        if (showImportantOnly && !n.isImportant) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.category.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [notices, selectedCategory, searchQuery, showImportantOnly]);

  const urgentCount = notices.filter((n) => n.isImportant && n.isPublished !== false).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-600/40">
            <Bell className="w-3.5 h-3.5" />
            <span>Digital Bulletin Board · Live Official Announcements</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            School Notices & Circulars
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            All official announcements regarding BSEB examinations, academic holidays, state scholarships, admission schedules, and school events are posted here for students and guardians.
          </p>

          <p className="text-xs text-slate-400 pt-1">
            Notice Updates & Changes: Restricted to authorized staff (<span className="text-emerald-400 font-mono font-medium">prince@123</span>).
          </p>
        </div>

        <div className="mt-4 sm:mt-0 sm:absolute sm:right-8 sm:top-10 z-10 flex flex-col sm:items-end gap-2">
          {isAdminLoggedIn ? (
            <>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-2.5 py-1 rounded-md">
                ✓ Staff In-charge: prince@123
              </span>
              {onOpenAddNotice && (
                <button
                  onClick={onOpenAddNotice}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish New Notice</span>
                </button>
              )}
            </>
          ) : (
            onSelectTab && (
              <button
                onClick={() => onSelectTab('admin')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Staff Login to update or change notices"
              >
                <span>Staff Notice Login (prince@123)</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars by title, subject, examination keyword..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setShowImportantOnly(!showImportantOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                showImportantOnly
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Important Only ({urgentCount})</span>
            </button>

            {(searchQuery || selectedCategory !== 'All' || showImportantOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowImportantOnly(false);
                }}
                className="text-xs text-blue-700 hover:underline font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (Functional filter tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notices Count Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <span className="font-bold text-slate-800">{filteredNotices.length}</span> notices
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          {showImportantOnly ? ' (Important only)' : ''}
        </span>
        <span className="text-[11px] text-slate-400">
          Notices are officially signed by Headmaster Office
        </span>
      </div>

      {/* Notice List Grid */}
      {filteredNotices.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
          <Bell className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No notices found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery
              ? `No circulars matching "${searchQuery}". Try a different keyword.`
              : 'There are no published circulars matching the selected criteria.'}
          </p>
          {(searchQuery || selectedCategory !== 'All' || showImportantOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowImportantOnly(false);
              }}
              className="mt-4 px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onReadMore={onReadNotice}
            />
          ))}
        </div>
      )}
    </div>
  );
};
