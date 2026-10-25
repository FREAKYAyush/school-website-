import React, { useState, useEffect } from 'react';
import {
  SchoolInfo,
  Notice,
  StaffMember,
  Facility,
  GalleryItem,
  AcademicData,
  ContactMessage,
  AdminUser
} from '../types.ts';
import { api } from '../services/api.ts';
import { AdminNoticeModal } from '../components/AdminNoticeModal.tsx';
import {
  Shield,
  Bell,
  Building,
  Users,
  Image,
  BookOpen,
  MessageSquare,
  Key,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  Eye,
  AlertCircle,
  CheckCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  schoolInfo: SchoolInfo | null;
  notices: Notice[];
  staff: StaffMember[];
  facilities: Facility[];
  gallery: GalleryItem[];
  academics: AcademicData | null;
  onRefreshData: () => Promise<void>;
  onReadNotice: (notice: Notice) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  schoolInfo,
  notices,
  staff,
  facilities,
  gallery,
  academics,
  onRefreshData,
  onReadNotice
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    'notices' | 'school-info' | 'staff' | 'facilities' | 'gallery' | 'academics' | 'messages' | 'security'
  >('notices');

  // Notice modal state
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // School info form state
  const [infoForm, setInfoForm] = useState<Partial<SchoolInfo>>({});
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoError, setInfoError] = useState('');

  // Staff form modal / editing
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);

  // Facility form modal / editing
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Partial<Facility> | null>(null);

  // Gallery modal / form
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    category: 'School Campus',
    date: new Date().toISOString().split('T')[0]
  });

  // Contact messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Change password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Action status message banner
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check auth on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (schoolInfo) {
      setInfoForm(schoolInfo);
    }
  }, [schoolInfo]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'messages') {
      loadMessages();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuthentication = async () => {
    try {
      setCheckingAuth(true);
      const res = await api.verifyAuth();
      if (res.authenticated && res.admin) {
        setIsAuthenticated(true);
        setCurrentUser(res.admin);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    try {
      setLoggingIn(true);
      setLoginError('');
      const res = await api.login(loginEmail.trim(), loginPassword);
      if (res.success) {
        setIsAuthenticated(true);
        setCurrentUser(res.admin);
        await onRefreshData();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginPassword('');
  };

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatusBanner({ type, message });
    setTimeout(() => {
      setStatusBanner(null);
    }, 4500);
  };

  // -------------------------------------------------------------------------
  // NOTICE ACTIONS
  // -------------------------------------------------------------------------
  const handleOpenAddNotice = () => {
    setEditingNotice(null);
    setIsNoticeModalOpen(true);
  };

  const handleOpenEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotice = async (noticeData: Partial<Notice>) => {
    if (editingNotice) {
      await api.updateNotice(editingNotice.id, noticeData);
      showStatus('success', `Notice "${noticeData.title}" updated successfully.`);
    } else {
      await api.createNotice(noticeData);
      showStatus('success', `New notice "${noticeData.title}" published successfully.`);
    }
    await onRefreshData();
  };

  const handleDeleteNotice = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete notice "${title}"?`)) {
      try {
        await api.deleteNotice(id);
        showStatus('success', 'Notice deleted successfully.');
        await onRefreshData();
      } catch (err: any) {
        showStatus('error', err.message || 'Failed to delete notice.');
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await api.togglePublishNotice(id);
      showStatus(
        'success',
        res.isPublished ? 'Notice is now Published.' : 'Notice set to Unpublished / Draft.'
      );
      await onRefreshData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to toggle status.');
    }
  };

  const handleToggleImportant = async (id: string) => {
    try {
      const res = await api.toggleImportantNotice(id);
      showStatus(
        'success',
        res.isImportant ? 'Notice marked as IMPORTANT.' : 'Removed IMPORTANT mark.'
      );
      await onRefreshData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to toggle important.');
    }
  };

  // -------------------------------------------------------------------------
  // SCHOOL INFO ACTIONS
  // -------------------------------------------------------------------------
  const handleSaveSchoolInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingInfo(true);
      setInfoSuccess('');
      setInfoError('');
      await api.updateSchoolInfo(infoForm);
      setInfoSuccess('School information updated successfully!');
      showStatus('success', 'School details updated and live on website.');
      await onRefreshData();
    } catch (err: any) {
      setInfoError(err.message || 'Failed to update school details.');
    } finally {
      setSavingInfo(false);
    }
  };

  // -------------------------------------------------------------------------
  // MESSAGES
  // -------------------------------------------------------------------------
  const loadMessages = async () => {
    try {
      setLoadingMessages(true);
      const msgs = await api.getContactMessages();
      setContactMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Delete this inquiry message?')) {
      try {
        await api.deleteContactMessage(id);
        setContactMessages((prev) => prev.filter((m) => m.id !== id));
        showStatus('success', 'Message removed.');
      } catch (err: any) {
        showStatus('error', err.message || 'Failed to delete message.');
      }
    }
  };

  // -------------------------------------------------------------------------
  // SECURITY & PASSWORD
  // -------------------------------------------------------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setChangingPass(true);
      setPassError('');
      setPassSuccess('');
      const res = await api.changePassword(currentPass, newPass);
      setPassSuccess(res.message || 'Password changed successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  const handleResetDemoData = async () => {
    if (
      window.confirm(
        'Are you sure you want to restore the official default demo database? Any newly added notices or changes will be reset to default.'
      )
    ) {
      try {
        await api.resetDemo();
        showStatus('success', 'Database restored to official default records.');
        await onRefreshData();
      } catch (err: any) {
        showStatus('error', err.message || 'Failed to reset.');
      }
    }
  };

  // -------------------------------------------------------------------------
  // RENDER: LOGIN FORM (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------------------
  if (checkingAuth) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Verifying administrator session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Top Lock Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Staff Notice & Admin Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              UHS MADHULATA RANIGANJ ARARIA — Secure Authorized Staff Login. Only authorized staff can update, add, or change school notices.
            </p>
          </div>

          {/* Quick-fill helper notice for authorized staff */}
          <div className="bg-emerald-50 border-b border-emerald-100 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-900">Authorized Staff Notice Credentials:</p>
              <div className="font-mono text-[11px] bg-white/90 p-2.5 rounded border border-emerald-200 text-slate-800 space-y-1">
                <p>Staff ID: <span className="font-bold text-emerald-900">prince@123</span></p>
                <p>Password: <span className="font-bold text-emerald-900">123456</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('prince@123');
                  setLoginPassword('123456');
                }}
                className="mt-1 text-emerald-800 hover:underline font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Click to Auto-fill Staff Credentials (prince@123) →</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Staff Login ID
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="prince@123"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Staff Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-hidden font-mono"
                />
              </div>

              <div className="text-[11px] text-slate-500 italic">
                Note: Only authorized staff with ID <strong className="text-slate-700">prince@123</strong> has permissions to change school notifications.
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {loggingIn ? (
                  <span>Verifying Staff Credentials...</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Sign In as Staff</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Banner / Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AUTHENTICATED ADMINISTRATOR SESSION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            School Administration Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Logged in as: <span className="text-white font-medium">{currentUser?.email}</span> · UHS Madhulata, Raniganj, Araria
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleOpenAddNotice}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Notice</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Floating Status Banner */}
      {statusBanner && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all animate-in slide-in-from-top-2 ${
            statusBanner.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}
        >
          {statusBanner.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{statusBanner.message}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm">
        {[
          { id: 'notices', label: 'Notifications Management', icon: Bell, badge: notices.length },
          { id: 'school-info', label: 'School Info & Headmaster', icon: Building },
          { id: 'staff', label: 'Staff Directory', icon: Users, badge: staff.length },
          { id: 'facilities', label: 'Facilities', icon: Building, badge: facilities.length },
          { id: 'gallery', label: 'Gallery Photos', icon: Image, badge: gallery.length },
          { id: 'messages', label: 'Visitor Inquiries', icon: MessageSquare },
          { id: 'security', label: 'Password & Settings', icon: Key }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-blue-700 text-blue-900 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TAB 1: NOTICES MANAGEMENT (CORE FEATURE) */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          {/* Authorized Staff Notice Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                ✓
              </span>
              <div>
                <p className="font-bold text-emerald-950 text-sm">
                  Authorized Staff Access: <span className="font-mono text-emerald-800">prince@123</span>
                </p>
                <p className="text-emerald-800 text-xs">
                  Exclusive permission granted: Only this staff member can add, edit, delete, publish, or mark notices as important.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full text-[11px] font-mono">
              Role: Notice Staff In-charge
            </span>
          </div>

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                School Notifications & Circulars ({notices.length})
              </h2>
              <p className="text-xs text-slate-500">
                Create, edit, toggle important status, or publish/unpublish school circulars instantly.
              </p>
            </div>

            <button
              onClick={handleOpenAddNotice}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Notice</span>
            </button>
          </div>

          {/* Notices Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Important</th>
                    <th className="py-3 px-3">Attachment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notices.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Preview */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-bold text-slate-900 text-sm line-clamp-1">{n.title}</div>
                        <div className="text-slate-500 text-[11px] line-clamp-1">{n.description || n.content}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {n.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-600">
                        {n.date}
                      </td>

                      {/* Publish Toggle Button */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(n.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                            n.isPublished !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {n.isPublished !== false ? 'Published' : 'Unpublished (Draft)'}
                        </button>
                      </td>

                      {/* Important Toggle Button */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleImportant(n.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                            n.isImportant
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title="Click to toggle important indicator"
                        >
                          {n.isImportant ? '★ Important' : 'Standard'}
                        </button>
                      </td>

                      {/* Attachment indicator */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {n.attachmentName ? (
                          <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-medium">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{n.attachmentName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => onReadNotice(n)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded"
                          title="View Notice Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditNotice(n)}
                          className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded"
                          title="Edit Notice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(n.id, n.title)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 2: SCHOOL INFO & HEADMASTER */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'school-info' && (
        <form onSubmit={handleSaveSchoolInfo} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              School Profile, Address & Headmaster Details
            </h2>
            <p className="text-xs text-slate-500">
              Updates made here will update the header, footer, homepage, and contact page.
            </p>
          </div>

          {infoSuccess && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{infoSuccess}</span>
            </div>
          )}

          {infoError && (
            <div className="bg-red-50 text-red-800 p-3 rounded text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{infoError}</span>
            </div>
          )}

          {/* School Name & Hindi Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                School Name
              </label>
              <input
                type="text"
                value={infoForm.name || ''}
                onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Hindi Name (विद्यालय का नाम)
              </label>
              <input
                type="text"
                value={infoForm.hindiName || ''}
                onChange={(e) => setInfoForm({ ...infoForm, hindiName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>
          </div>

          {/* Contact Details: Phone, Email, UDISE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Official Phone Number
              </label>
              <input
                type="text"
                value={infoForm.phone || ''}
                onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={infoForm.email || ''}
                onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                U-DISE Code
              </label>
              <input
                type="text"
                value={infoForm.udiseCode || ''}
                onChange={(e) => setInfoForm({ ...infoForm, udiseCode: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Address breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Location & Panchayat
              </label>
              <input
                type="text"
                value={infoForm.location || ''}
                onChange={(e) => setInfoForm({ ...infoForm, location: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Post Office
              </label>
              <input
                type="text"
                value={infoForm.postOffice || ''}
                onChange={(e) => setInfoForm({ ...infoForm, postOffice: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Police Station
              </label>
              <input
                type="text"
                value={infoForm.policeStation || ''}
                onChange={(e) => setInfoForm({ ...infoForm, policeStation: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={infoForm.pinCode || ''}
                onChange={(e) => setInfoForm({ ...infoForm, pinCode: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Principal Details */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Principal / Headmaster Section
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Headmaster Name
                </label>
                <input
                  type="text"
                  value={infoForm.principalName || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, principalName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={infoForm.principalDesignation || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, principalDesignation: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Headmaster Welcome Message
              </label>
              <textarea
                value={infoForm.principalMessage || ''}
                onChange={(e) => setInfoForm({ ...infoForm, principalMessage: e.target.value })}
                rows={4}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* About Text, Mission & Vision */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              School Overview, Mission & Vision
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                About the School
              </label>
              <textarea
                value={infoForm.aboutText || ''}
                onChange={(e) => setInfoForm({ ...infoForm, aboutText: e.target.value })}
                rows={4}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Mission Statement
                </label>
                <textarea
                  value={infoForm.mission || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, mission: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Vision Statement
                </label>
                <textarea
                  value={infoForm.vision || ''}
                  onChange={(e) => setInfoForm({ ...infoForm, vision: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={savingInfo}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              {savingInfo ? 'Saving...' : 'Save School Information'}
            </button>
          </div>
        </form>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 3: STAFF DIRECTORY */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Faculty List ({staff.length})</h2>
            <button
              onClick={() => {
                const name = window.prompt('Enter Teacher Name:');
                if (!name) return;
                const designation = window.prompt('Enter Designation (e.g. Teacher TGT):', 'Secondary Teacher (TGT)');
                const department = window.prompt('Enter Department/Subject:', 'Mathematics');
                if (name && designation) {
                  api.createStaff({
                    name,
                    designation,
                    department: department || 'General',
                    qualification: 'B.Ed.',
                    experience: '5 Years'
                  }).then(() => {
                    onRefreshData();
                    showStatus('success', 'Staff member added.');
                  });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                  <p className="text-xs text-blue-800 font-medium">{member.designation}</p>
                  <p className="text-xs text-slate-500 mt-1">{member.department} · {member.qualification}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove ${member.name}?`)) {
                      api.deleteStaff(member.id).then(() => {
                        onRefreshData();
                        showStatus('success', 'Staff member removed.');
                      });
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 4: FACILITIES */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Campus Facilities ({facilities.length})</h2>
            <button
              onClick={() => {
                const title = window.prompt('Enter Facility Title:');
                if (!title) return;
                const description = window.prompt('Enter Facility Description:');
                api.createFacility({
                  title,
                  category: 'Campus Infrastructure',
                  description: description || '',
                  highlights: ['Maintained for student safety']
                }).then(() => {
                  onRefreshData();
                  showStatus('success', 'Facility created.');
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facility</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facilities.map((fac) => (
              <div key={fac.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-700">{fac.category}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{fac.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${fac.title}?`)) {
                      api.deleteFacility(fac.id).then(() => {
                        onRefreshData();
                        showStatus('success', 'Facility deleted.');
                      });
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded shrink-0 ml-2"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 5: GALLERY */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Gallery Items ({gallery.length})</h2>
            <button
              onClick={() => {
                const title = window.prompt('Enter Event/Photo Title:');
                if (!title) return;
                const cat = window.prompt('Category (School Campus, Events, Sports, Republic Day, Independence Day):', 'Events');
                const desc = window.prompt('Short Description:', 'Event celebration at school');
                api.createGalleryItem({
                  title,
                  category: (cat as any) || 'Events',
                  description: desc || ''
                }).then(() => {
                  onRefreshData();
                  showStatus('success', 'Gallery item added.');
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Gallery Photo Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase">{item.category}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${item.title}?`)) {
                      api.deleteGalleryItem(item.id).then(() => {
                        onRefreshData();
                        showStatus('success', 'Item removed.');
                      });
                    }
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 6: VISITOR INQUIRIES */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Visitor Contact Inquiries ({contactMessages.length})
            </h2>
            <button
              onClick={loadMessages}
              className="text-xs text-blue-700 hover:underline font-semibold"
            >
              Refresh Messages
            </button>
          </div>

          {loadingMessages ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading inquiries...</div>
          ) : contactMessages.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contactMessages.map((msg) => (
                <div key={msg.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] text-blue-800 font-semibold">{msg.subject}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                        {msg.phone && <span>Phone: {msg.phone}</span>}
                        {msg.email && <span>Email: {msg.email}</span>}
                        <span>Date: {new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded leading-relaxed">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 7: PASSWORD & SETTINGS */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Change Administrator Password
            </h3>

            {passSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="bg-red-50 text-red-800 p-3 rounded text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{passError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {/* Reset Demo Data & Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Database Maintenance & Reset
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you wish to restore the clean official sample notices, staff list, and school information back to the original demo baseline, you can reset the database with one click.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetDemoData}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Restore Default Sample Notices & Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notice Modal for adding/editing notice */}
      <AdminNoticeModal
        isOpen={isNoticeModalOpen}
        noticeToEdit={editingNotice}
        onClose={() => setIsNoticeModalOpen(false)}
        onSave={handleSaveNotice}
      />
    </div>
  );
};
