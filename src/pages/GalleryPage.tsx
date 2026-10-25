import React, { useState, useMemo } from 'react';
import { GalleryItem } from '../types.ts';
import { Image, Filter, Calendar, X, ZoomIn, School, Award, Trophy, Flag, BookOpen } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

const CATEGORIES = [
  'All',
  'School Campus',
  'Events',
  'Cultural Programs',
  'Sports',
  'Independence Day',
  'Republic Day',
  'Classrooms'
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return gallery;
    return gallery.filter((item) => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Republic Day':
      case 'Independence Day':
        return {
          bg: 'from-amber-600 via-white to-emerald-700',
          cardBg: 'bg-emerald-950/90',
          icon: Flag,
          accent: 'text-amber-400'
        };
      case 'Sports':
        return {
          bg: 'from-blue-600 to-indigo-900',
          cardBg: 'bg-blue-950/90',
          icon: Trophy,
          accent: 'text-blue-400'
        };
      case 'Events':
      case 'Cultural Programs':
        return {
          bg: 'from-purple-600 to-indigo-950',
          cardBg: 'bg-purple-950/90',
          icon: Award,
          accent: 'text-purple-300'
        };
      default:
        return {
          bg: 'from-slate-800 to-slate-950',
          cardBg: 'bg-slate-900',
          icon: School,
          accent: 'text-emerald-400'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            School Life & Archival Photos
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Photo & Event Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Capturing joyous moments of learning, national celebrations, sports victories, and campus life at UHS Madhulata.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
        <span className="text-slate-500 font-semibold mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          <span>Filter:</span>
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const theme = getCategoryTheme(item.category);
          const Icon = theme.icon;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              {/* Visual Card Media Container */}
              <div
                className={`h-48 sm:h-52 w-full ${theme.cardBg} relative flex flex-col items-center justify-center p-6 text-white text-center overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

                <div className="relative z-20 flex flex-col items-center space-y-2 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Icon className={`w-6 h-6 ${theme.accent}`} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-sm font-bold text-white px-2 line-clamp-2">
                    {item.title}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-white/90 bg-black/60 px-2 py-0.5 rounded">
                  <ZoomIn className="w-3 h-3" />
                  <span>View Details</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-blue-900">{item.category}</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-700 font-semibold flex items-center justify-between">
                  <span>UHS Madhulata Campus Archive</span>
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-300 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  {selectedItem.category} · {selectedItem.date}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="h-44 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-6 text-center border border-slate-700">
                <School className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="text-sm font-bold">{selectedItem.title}</p>
                <p className="text-xs text-slate-400 mt-1">UHS Madhulata, Raniganj, Araria</p>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed">
                {selectedItem.description}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Ref ID: {selectedItem.id}</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-medium text-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
