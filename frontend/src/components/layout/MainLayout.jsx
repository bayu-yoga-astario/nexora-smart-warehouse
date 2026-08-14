import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Breadcrumb } from './Breadcrumb';

export const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('nexora_sidebar_collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('nexora_sidebar_collapsed', String(next));
      return next;
    });
  };

  const closeMobile = () => setIsMobileOpen(false);
  const openMobile = () => setIsMobileOpen(true);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#070d19] text-slate-100 font-sans relative">

      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-fade-in transition-opacity"
        />
      )}

      {/* Menu Navigasi Samping (Warna Putih Bersih, Fixed Left, Collapsible) */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        closeMobile={closeMobile}
      />

      {/* Konten Utama Aplikasi (Fixed Height, Internal Scroll) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#070d19]">
        {/* Menu Navigasi Atas (Fixed Top, Permanen) */}
        <Navbar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          openMobile={openMobile}
        />

        {/* Workspace Konten Masuk Menu (Hanya area ini yang scroll) */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6 bg-[#070d19] text-slate-100">
          <Breadcrumb />
          <div className="animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
