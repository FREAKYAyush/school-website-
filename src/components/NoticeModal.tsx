import React from 'react';
import { Notice } from '../types.ts';
import { X, Calendar, Tag, AlertCircle, FileText, Download, ExternalLink, Printer, CheckCircle } from 'lucide-react';

interface NoticeModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (notice.attachmentData) {
      const a = document.createElement('a');
      a.href = notice.attachmentData;
      a.download = notice.attachmentName || `UHS_Notice_${notice.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a printable text document Blob for the notice
      const textContent = `
=============================================================
         UTKRAMIT HIGH SCHOOL (UHS) MADHULATA
          Raniganj, Araria, Bihar - PIN: 854334
        BSEB Affiliation | U-DISE Code: 10070804607
=============================================================

OFFICIAL CIRCULAR / NOTIFICATION
Ref: UHS/MDL/${notice.id.toUpperCase()}
Date: ${notice.date}
Category: ${notice.category}
Status: ${notice.isImportant ? 'IMPORTANT / PRIORITY' : 'General Notice'}

SUBJECT: ${notice.title}

DETAILS:
${notice.content || notice.description}

-------------------------------------------------------------
By Order of:
Headmaster / Principal (In-charge)
UHS Madhulata, Raniganj, Araria, Bihar
Email: uhsmadhulata607@gmail.com | Phone: 7631729440
=============================================================
`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${notice.attachmentName || `UHS_Notice_${notice.id}.txt`}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pb-1">
              <span>Official School Circular</span>
              <span>·</span>
              <span>Ref: UHS/MDL/{notice.id.toUpperCase()}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {notice.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Metadata Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{notice.date}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-blue-900">{notice.category}</span>
            </span>

            {notice.isImportant && (
              <span className="inline-flex items-center gap-1 text-red-700 bg-red-100/80 px-2 py-0.5 rounded font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Urgent / Important</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:bg-slate-200 rounded transition-colors"
              title="Print Circular"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Brief Summary Box */}
          {notice.description && (
            <div className="bg-blue-50/70 border-l-4 border-blue-600 p-4 rounded-r text-sm text-blue-950 font-medium leading-relaxed">
              {notice.description}
            </div>
          )}

          {/* Full Notice Content */}
          <div className="prose prose-slate text-sm sm:text-base text-slate-800 leading-relaxed space-y-4">
            <p className="whitespace-pre-line">
              {notice.content || notice.description}
            </p>
          </div>

          {/* Institutional Endorsement */}
          <div className="border-t border-slate-200 pt-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Office of the Headmaster / Principal (In-charge)</p>
              <p>Utkramit High School (UHS) Madhulata, Raniganj, Araria, Bihar</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Verified School Notice</span>
            </div>
          </div>

          {/* Attachments & Links Section */}
          {(notice.attachmentName || notice.externalLink) && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Official Attachments & Portals
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {notice.attachmentName && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {notice.attachmentName}</span>
                  </button>
                )}

                {notice.externalLink && (
                  <a
                    href={notice.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Open Linked Web Portal</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            School Code: 34046 · Raniganj Block
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
