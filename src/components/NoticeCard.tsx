import React from 'react';
import { Notice } from '../types.ts';
import { Calendar, AlertCircle, FileText, ArrowRight, Download, ExternalLink } from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  onReadMore: (notice: Notice) => void;
  compact?: boolean;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onReadMore, compact = false }) => {
  const isPdf = notice.attachmentType === 'pdf' || notice.attachmentName?.endsWith('.pdf');

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notice.attachmentData) {
      const a = document.createElement('a');
      a.href = notice.attachmentData;
      a.download = notice.attachmentName || `UHS_Notice_${notice.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Trigger read more modal where complete text can be read or saved
      onReadMore(notice);
    }
  };

  return (
    <article
      onClick={() => onReadMore(notice)}
      className={`group relative bg-white border rounded-xl p-5 transition-all duration-200 cursor-pointer hover:shadow-md ${
        notice.isImportant
          ? 'border-red-300 bg-red-50/20 hover:border-red-400'
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      {/* Top clean metadata line (Anti-slop Zero-Pill discipline) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2.5">
        <div className="flex items-center gap-2">
          {notice.isImportant && (
            <span className="flex items-center gap-1 font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded text-[11px]">
              <AlertCircle className="w-3 h-3 text-red-600" />
              IMPORTANT
            </span>
          )}
          <span className="font-semibold text-blue-900">{notice.category}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="flex items-center gap-1 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <time dateTime={notice.date}>{notice.date}</time>
          </span>
        </div>

        {notice.attachmentName && (
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <FileText className="w-3 h-3 text-emerald-600" />
            <span>Document Attached</span>
          </span>
        )}
      </div>

      {/* Notice Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug line-clamp-2 mb-2">
        {notice.title}
      </h3>

      {/* Description Snippet */}
      {!compact && notice.description && (
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {notice.description}
        </p>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs mt-3">
        <button
          type="button"
          onClick={() => onReadMore(notice)}
          className="inline-flex items-center gap-1.5 font-semibold text-blue-700 group-hover:text-blue-900 hover:underline"
        >
          <span>Read Full Notice</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center gap-2">
          {notice.attachmentName && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
              title="Download Attached Document"
            >
              <Download className="w-3 h-3 text-emerald-700" />
              <span className="hidden sm:inline">PDF</span>
              <span>Download</span>
            </button>
          )}

          {notice.externalLink && (
            <a
              href={notice.externalLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
              title="Open External Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
