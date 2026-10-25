import React, { useState, useEffect } from 'react';
import { Notice, NoticeCategory } from '../types.ts';
import { X, Upload, FileText, CheckCircle, AlertCircle, Eye, EyeOff, Link as LinkIcon, Trash2 } from 'lucide-react';

interface AdminNoticeModalProps {
  noticeToEdit: Notice | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (noticeData: Partial<Notice>) => Promise<void>;
}

const CATEGORIES: NoticeCategory[] = [
  'Academic',
  'Examination',
  'Holidays',
  'Admission',
  'Scholarship',
  'General',
  'Sports'
];

export const AdminNoticeModal: React.FC<AdminNoticeModalProps> = ({
  noticeToEdit,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentData, setAttachmentData] = useState('');
  const [attachmentType, setAttachmentType] = useState<'pdf' | 'doc' | 'image' | 'link'>('pdf');
  const [externalLink, setExternalLink] = useState('');

  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (noticeToEdit) {
      setTitle(noticeToEdit.title || '');
      setCategory(noticeToEdit.category || 'General');
      setDate(noticeToEdit.date || new Date().toISOString().split('T')[0]);
      setDescription(noticeToEdit.description || '');
      setContent(noticeToEdit.content || '');
      setIsImportant(Boolean(noticeToEdit.isImportant));
      setIsPublished(noticeToEdit.isPublished !== false);
      setAttachmentName(noticeToEdit.attachmentName || '');
      setAttachmentData(noticeToEdit.attachmentData || '');
      setAttachmentType(noticeToEdit.attachmentType || 'pdf');
      setExternalLink(noticeToEdit.externalLink || '');
    } else {
      // Default for new notice
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setCategory('General');
      setDate(today);
      setDescription('');
      setContent('');
      setIsImportant(false);
      setIsPublished(true);
      setAttachmentName('');
      setAttachmentData('');
      setAttachmentType('pdf');
      setExternalLink('');
    }
    setIsPreview(false);
    setError('');
  }, [noticeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit. Please upload a smaller file.');
      return;
    }

    setAttachmentName(file.name);
    if (file.name.endsWith('.pdf')) {
      setAttachmentType('pdf');
    } else if (file.type.startsWith('image/')) {
      setAttachmentType('image');
    } else {
      setAttachmentType('doc');
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentData(reader.result as string);
      setError('');
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachmentName('');
    setAttachmentData('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Notice title is mandatory.');
      return;
    }
    if (!date) {
      setError('Notice publication date is mandatory.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave({
        title: title.trim(),
        category,
        date,
        description: description.trim(),
        content: (content || description).trim(),
        isImportant,
        isPublished,
        attachmentName: attachmentName.trim() || undefined,
        attachmentData: attachmentData || undefined,
        attachmentType,
        externalLink: externalLink.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save notice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">
              {noticeToEdit ? 'Edit Notice / Notification' : 'Add New Notice'}
            </h2>
            <span className="text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded font-mono">
              Admin CMS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${
                isPreview ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isPreview ? 'Back to Editor' : 'Preview Notice'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-6 py-2.5 text-xs font-medium border-b border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {isPreview ? (
            /* Live Preview Mode */
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-medium">
                Live Preview: This is how the notice will appear to visitors on the website.
              </div>

              <div className="bg-white border rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  {isImportant && (
                    <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                      IMPORTANT
                    </span>
                  )}
                  <span className="font-semibold text-blue-900">{category}</span>
                  <span>·</span>
                  <span>{date || 'Today'}</span>
                  <span>·</span>
                  <span className={isPublished ? 'text-emerald-700' : 'text-slate-500 italic'}>
                    {isPublished ? 'Published' : 'Draft / Unpublished'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {title || 'Untitled Notice'}
                </h3>

                {description && (
                  <p className="text-sm font-medium text-slate-700 bg-blue-50/60 p-3 rounded mb-4">
                    {description}
                  </p>
                )}

                <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed mb-4">
                  {content || description || 'No detailed content specified.'}
                </div>

                {(attachmentName || externalLink) && (
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                    {attachmentName && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attached: {attachmentName}</span>
                      </span>
                    )}
                    {externalLink && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded font-medium">
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Link: {externalLink}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Form Editor Mode */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BSEB Matric Annual Examination Schedule 2026"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                />
              </div>

              {/* Category & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Publication Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Status Toggles: Important & Published */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">Mark as Important</span>
                    <span className="text-xs text-slate-500">Highlights this notice with red badge</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">Publish Immediately</span>
                    <span className="text-xs text-slate-500">Visible to public on homepage and notice board</span>
                  </div>
                </label>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Short Summary / Brief (Shown on homepage card)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="A concise 1-2 sentence overview of the notice..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                />
              </div>

              {/* Full Detailed Content */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Full Detailed Notice / Circular Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Enter complete circular text, instructions, required documents, timings, and official directives..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-mono text-xs sm:text-sm"
                />
              </div>

              {/* PDF Document Upload & Attachment */}
              <div className="border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/50">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Upload PDF / Document Attachment (Optional)
                </label>

                {attachmentName ? (
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="truncate max-w-xs">{attachmentName}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        Attached
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="text-red-600 hover:text-red-700 p-1 text-xs flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg cursor-pointer bg-white transition-colors">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-700">Click to choose PDF or document</span>
                      <span className="text-[11px] text-slate-400">PDF, DOC, PNG up to 15MB</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Optional External Link */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Optional External Web Link (e.g. BSEB or Scholarship Portal)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://biharboardonline.bihar.gov.in"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!isPreview && (
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Preview First
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{noticeToEdit ? 'Save Changes' : 'Publish Notice'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
