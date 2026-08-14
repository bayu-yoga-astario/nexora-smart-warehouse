import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, FolderTree, Truck, Users,
  Building2, MapPin, PackageCheck, History, ClipboardCheck,
  Sliders, AlertOctagon, FileSpreadsheet, ShoppingCart, Receipt,
  Award, FileCheck, PackageOpen, BoxSelect, Send, TrendingUp,
  LineChart, BrainCircuit, Activity, FileBarChart, Upload,
  Download, ShieldCheck, UserCog, FileText, ChevronDown,
  Layers, Ruler, ChevronLeft, ChevronRight, X, ChevronsUpDown
} from 'lucide-react';
import { authService } from '../../services/authService';

const navSections = [
  {
    key: 'dashboard',
    single: true,
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    key: 'masterData',
    title: 'MASTER DATA',
    icon: FolderTree,
    items: [
      { name: 'Produk',      path: '/master-data/products',   icon: Boxes          },
      { name: 'Kategori',    path: '/master-data/categories', icon: FolderTree     },
      { name: 'Satuan',      path: '/master-data/units',      icon: Ruler          },
      { name: 'Supplier',    path: '/master-data/suppliers',  icon: Truck          },
      { name: 'Pelanggan',   path: '/master-data/customers',  icon: Users          },
      { name: 'Gudang',      path: '/master-data/warehouses', icon: Building2      },
      { name: 'Lokasi',      path: '/master-data/locations',  icon: MapPin         },
    ],
  },
  {
    key: 'inventory',
    title: 'INVENTORY',
    icon: PackageCheck,
    items: [
      { name: 'Stock Overview',  path: '/inventory/stock',       icon: PackageCheck },
      { name: 'Mutasi Stok',     path: '/inventory/movement',    icon: History      },
      { name: 'Stock Opname',    path: '/inventory/opname',      icon: ClipboardCheck },
      { name: 'Penyesuaian',     path: '/inventory/adjustment',  icon: Sliders      },
      { name: 'Slow Moving',     path: '/inventory/slow-moving', icon: AlertOctagon },
    ],
  },
  {
    key: 'procurement',
    title: 'PROCUREMENT',
    icon: ShoppingCart,
    items: [
      { name: 'Permintaan Pembelian', path: '/procurement/purchase-request',    icon: FileSpreadsheet },
      { name: 'Purchase Order',       path: '/procurement/purchase-order',       icon: ShoppingCart    },
      { name: 'Penerimaan Barang',    path: '/procurement/goods-receipt',        icon: Receipt         },
      { name: 'Kinerja Supplier',     path: '/procurement/supplier-performance', icon: Award           },
    ],
  },
  {
    key: 'outbound',
    title: 'OUTBOUND',
    icon: Send,
    items: [
      { name: 'Permintaan Material', path: '/outbound/material-request', icon: FileCheck  },
      { name: 'Picking',             path: '/outbound/picking',          icon: PackageOpen },
      { name: 'Packing',             path: '/outbound/packing',          icon: BoxSelect   },
      { name: 'Surat Jalan',         path: '/outbound/delivery-order',   icon: Send        },
      { name: 'Pengiriman',          path: '/outbound/shipment',         icon: Truck       },
    ],
  },
  {
    key: 'analytics',
    title: 'ANALYTICS',
    icon: LineChart,
    items: [
      { name: 'Analitik Inventory',  path: '/analytics/inventory-analytics',     icon: LineChart     },
      { name: 'Demand Forecast',     path: '/analytics/demand-forecast',         icon: TrendingUp    },
      { name: 'Reorder Suggestion',  path: '/analytics/reorder-recommendation',  icon: BrainCircuit  },
      { name: 'Kesehatan Inventory', path: '/analytics/inventory-health',        icon: Activity      },
    ],
  },
  {
    key: 'reports',
    title: 'LAPORAN',
    icon: FileBarChart,
    items: [
      { name: 'Laporan Stok',      path: '/reports/stock-report',    icon: FileBarChart },
      { name: 'Laporan Inbound',   path: '/reports/inbound-report',  icon: FileBarChart },
      { name: 'Laporan Outbound',  path: '/reports/outbound-report', icon: FileBarChart },
      { name: 'Laporan Pembelian', path: '/reports/purchase-report', icon: FileBarChart },
    ],
  },
  {
    key: 'importExport',
    title: 'IMPORT / EXPORT',
    icon: Upload,
    items: [
      { name: 'Import Excel', path: '/import-export/import', icon: Upload   },
      { name: 'Export Data',  path: '/import-export/export', icon: Download },
    ],
  },
  {
    key: 'administration',
    title: 'ADMINISTRASI',
    icon: ShieldCheck,
    items: [
      { name: 'Pengaturan Akun',  path: '/administration/account-settings', icon: UserCog   },
      { name: 'Kelola Pengguna',  path: '/administration/users',            icon: Users     },
      { name: 'Role & Izin',      path: '/administration/roles',            icon: ShieldCheck },
      { name: 'Log Audit',        path: '/administration/audit-logs',       icon: FileText  },
    ],
  },
];

export const Sidebar = ({ isCollapsed = false, toggleCollapse, isMobileOpen = false, closeMobile }) => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const filteredNavSections = navSections.filter(section => {
    if (section.key === 'administration' && currentUser?.role !== 'admin') {
      return false;
    }
    return true;
  });
  const [openSections, setOpenSections] = useState({
    masterData: false,
    inventory: true,
    procurement: false,
    outbound: false,
    analytics: false,
    reports: false,
    importExport: false,
    administration: false,
  });

  const [hoveredSection, setHoveredSection] = useState(null);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActive = (path) => location.pathname === path;
  const isSectionActive = (items = []) => items.some((item) => location.pathname === item.path);

  // Auto-open active section
  React.useEffect(() => {
    const newOpen = {};
    filteredNavSections.forEach((s) => {
      if (!s.single && s.items && isSectionActive(s.items)) {
        newOpen[s.key] = true;
      }
    });
    if (Object.keys(newOpen).length > 0) {
      setOpenSections((prev) => ({ ...prev, ...newOpen }));
    }
  }, [location.pathname]);

  // Expand all / Collapse all toggle
  const toggleAllSections = () => {
    const allOpen = Object.values(openSections).every(Boolean);
    const updated = {};
    filteredNavSections.forEach((s) => {
      if (!s.single) updated[s.key] = !allOpen;
    });
    setOpenSections(updated);
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col h-screen flex-shrink-0 z-40 select-none shadow-[2px_0_12px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${
        isMobileOpen
          ? 'fixed inset-y-0 left-0 translate-x-0 w-64'
          : 'hidden md:flex'
      }`}
    >
      {/* ── Brand Header ─────────────────────────────────── */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-200/80 flex-shrink-0 bg-white">
        <Link to="/dashboard" onClick={closeMobile} className="flex items-center gap-3 min-w-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/20 flex-shrink-0 border border-teal-400/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <h1 className="text-base font-black tracking-widest bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent leading-none">
                NEXORA
              </h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-0.5 font-bold">WMS · ERP</p>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={closeMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Desktop Collapse / Expand Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            title="Sembunyikan / Perkecil Menu (Collapse)"
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Quick Expand/Collapse Submenu Control (When Expanded) ── */}
      {!isCollapsed && (
        <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Modul Navigasi</span>
          <button
            onClick={toggleAllSections}
            title="Buka / Tutup Semua Kategori"
            className="text-[10px] font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 hover:underline transition-all"
          >
            <ChevronsUpDown className="w-3 h-3" />
            <span>Buka/Tutup</span>
          </button>
        </div>
      )}

      {/* ── Navigation List ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-2.5 py-2 space-y-1 bg-white">
        {filteredNavSections.map((section) => {
          if (section.single) {
            const Icon = section.icon;
            const active = isActive(section.path);
            return (
              <div key={section.key} className="relative group">
                <Link
                  to={section.path}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    active
                      ? 'bg-teal-50 text-teal-700 shadow-xs border border-teal-200/90'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  {!isCollapsed && <span>{section.title}</span>}
                </Link>

                {/* Floating tooltip when collapsed */}
                {isCollapsed && (
                  <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700/60">
                    {section.title}
                  </div>
                )}
              </div>
            );
          }

          const SectionIcon = section.icon;
          const sectionActive = isSectionActive(section.items);
          const isOpen = openSections[section.key];

          // Collapsed state: Icon with hover flyout menu
          if (isCollapsed) {
            return (
              <div
                key={section.key}
                className="relative group flex justify-center py-1"
                onMouseEnter={() => setHoveredSection(section.key)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <button
                  onClick={() => toggleSection(section.key)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    sectionActive
                      ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={section.title}
                >
                  <SectionIcon className="w-4 h-4" />
                </button>

                {/* Floating flyout dropdown panel on hover */}
                {hoveredSection === section.key && (
                  <div className="fixed left-20 ml-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-scale-in">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center gap-2">
                      <SectionIcon className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">{section.title}</span>
                    </div>
                    <div className="mt-1 space-y-0.5 max-h-64 overflow-y-auto">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const itemActive = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMobile}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              itemActive
                                ? 'bg-teal-50 text-teal-700 font-bold border border-teal-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <ItemIcon className={`w-3.5 h-3.5 flex-shrink-0 ${itemActive ? 'text-teal-600' : 'text-slate-400'}`} />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Expanded state: standard accordions
          return (
            <div key={section.key} className="pt-1">
              <button
                onClick={() => toggleSection(section.key)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all ${
                  sectionActive
                    ? 'text-teal-700 bg-teal-50/60'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <SectionIcon className={`w-3.5 h-3.5 ${sectionActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="tracking-wider">{section.title}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'}`}
                />
              </button>

              {isOpen && (
                <div className="mt-1 mb-1 ml-3 pl-2.5 border-l-2 border-slate-100 space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobile}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          active
                            ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom Footer / Expand Button ────────────────── */}
      <div className="px-3 py-3 border-t border-slate-200/80 flex items-center justify-between bg-white flex-shrink-0">
        {isCollapsed ? (
          <button
            onClick={toggleCollapse}
            title="Buka / Perlebar Menu (Expand)"
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">v1.0 · Live</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
              Enterprise
            </span>
          </>
        )}
      </div>
    </aside>
  );
};
