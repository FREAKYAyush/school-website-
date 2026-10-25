import React, { useState, useEffect } from 'react';
import {
  SchoolInfo,
  Notice,
  StaffMember,
  Facility,
  GalleryItem,
  AcademicData
} from './types.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { NoticeModal } from './components/NoticeModal.tsx';
import { AdminNoticeModal } from './components/AdminNoticeModal.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { NoticesPage } from './pages/NoticesPage.tsx';
import { AcademicsPage } from './pages/AcademicsPage.tsx';
import { FacilitiesPage } from './pages/FacilitiesPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { StaffPage } from './pages/StaffPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [academics, setAcademics] = useState<AcademicData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState<Notice | null>(null);
  const [adminAddNoticeModalOpen, setAdminAddNoticeModalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Read URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (
      [
        'home',
        'about',
        'notices',
        'academics',
        'facilities',
        'gallery',
        'staff',
        'contact',
        'admin'
      ].includes(hash)
    ) {
      setCurrentTab(hash);
    }

    const handleHashChange = () => {
      const current = window.location.hash.replace('#', '');
      if (current) {
        setCurrentTab(current);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load all initial data from backend API
  const loadAllData = async () => {
    try {
      setLoading(true);
      // Verify auth first
      const authRes = await api.verifyAuth().catch(() => ({ authenticated: false }));
      setIsAdminLoggedIn(Boolean(authRes.authenticated));

      // Fetch all public & admin data in parallel
      const [
        infoData,
        noticesData,
        staffData,
        facilitiesData,
        galleryData,
        academicsData
      ] = await Promise.all([
        api.getSchoolInfo().catch(() => null),
        api.getNotices({ includeUnpublished: authRes.authenticated }).catch(() => []),
        api.getStaff().catch(() => []),
        api.getFacilities().catch(() => []),
        api.getGallery().catch(() => []),
        api.getAcademics().catch(() => null)
      ]);

      if (infoData) setSchoolInfo(infoData);
      setNotices(noticesData);
      setStaff(staffData);
      setFacilities(facilitiesData);
      setGallery(galleryData);
      if (academicsData) setAcademics(academicsData);
    } catch (err) {
      console.error('Failed to load school data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleReadNotice = async (notice: Notice) => {
    setSelectedNoticeForModal(notice);
    // Optionally fetch full notice details to increment view counter
    try {
      const fullNotice = await api.getNotice(notice.id);
      setSelectedNoticeForModal(fullNotice);
    } catch {
      // ignore
    }
  };

  const handleSaveNewNotice = async (noticeData: Partial<Notice>) => {
    await api.createNotice(noticeData);
    await loadAllData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        schoolInfo={schoolInfo}
        unreadNoticesCount={notices.filter((n) => n.isImportant && n.isPublished !== false).length}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading && !schoolInfo ? (
          <div className="max-w-md mx-auto my-24 p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-800">Loading UHS Madhulata School Portal...</p>
            <p className="text-xs text-slate-500 mt-1">Connecting to official database...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                schoolInfo={schoolInfo}
                notices={notices}
                facilities={facilities}
                onSelectTab={handleSelectTab}
                onReadNotice={handleReadNotice}
              />
            )}

            {currentTab === 'about' && (
              <AboutPage
                schoolInfo={schoolInfo}
                onSelectTab={handleSelectTab}
              />
            )}

            {currentTab === 'notices' && (
              <NoticesPage
                notices={notices}
                onReadNotice={handleReadNotice}
                isAdminLoggedIn={isAdminLoggedIn}
                onOpenAddNotice={() => setAdminAddNoticeModalOpen(true)}
                onSelectTab={handleSelectTab}
              />
            )}

            {currentTab === 'academics' && (
              <AcademicsPage academics={academics} />
            )}

            {currentTab === 'facilities' && (
              <FacilitiesPage facilities={facilities} />
            )}

            {currentTab === 'gallery' && (
              <GalleryPage gallery={gallery} />
            )}

            {currentTab === 'staff' && (
              <StaffPage staff={staff} />
            )}

            {currentTab === 'contact' && (
              <ContactPage schoolInfo={schoolInfo} />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                schoolInfo={schoolInfo}
                notices={notices}
                staff={staff}
                facilities={facilities}
                gallery={gallery}
                academics={academics}
                onRefreshData={loadAllData}
                onReadNotice={handleReadNotice}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer schoolInfo={schoolInfo} onSelectTab={handleSelectTab} />

      {/* Public Notice Reader Modal */}
      <NoticeModal
        notice={selectedNoticeForModal}
        onClose={() => setSelectedNoticeForModal(null)}
      />

      {/* Admin Quick Add Notice Modal */}
      <AdminNoticeModal
        isOpen={adminAddNoticeModalOpen}
        noticeToEdit={null}
        onClose={() => setAdminAddNoticeModalOpen(false)}
        onSave={handleSaveNewNotice}
      />
    </div>
  );
}
