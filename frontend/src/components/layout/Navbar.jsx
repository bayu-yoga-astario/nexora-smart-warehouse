import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Search, LogOut, Settings, ChevronDown, X,
  Menu, PanelLeftClose, PanelLeftOpen, User, ShieldCheck,
  Check, CheckCheck, Trash2, PackageCheck, AlertTriangle,
  ShoppingCart, Monitor, Send,
  LayoutDashboard, Boxes, FolderTree, Ruler, Truck, Users,
  Building2, MapPin, History, ClipboardCheck, Sliders, AlertOctagon,
  FileSpreadsheet, Receipt, Award, FileCheck, PackageOpen, BoxSelect,
  LineChart, TrendingUp, BrainCircuit, Activity, FileBarChart,
  Upload, Download, UserCog, FileText, ArrowRight, CornerDownLeft, Command,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import { storageService } from '../../services/storageService';

const typeConfig = {
  alert:    { color: 'bg-rose-50 text-rose-600 border-rose-200',         icon: AlertTriangle, iconColor: 'text-rose-500',    dot: 'bg-rose-500' },
  inbound:  { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: PackageCheck,  iconColor: 'text-emerald-500', dot: 'bg-emerald-500' },
  order:    { color: 'bg-blue-50 text-blue-600 border-blue-200',         icon: ShoppingCart,  iconColor: 'text-blue-500',    dot: 'bg-blue-500' },
  outbound: { color: 'bg-amber-50 text-amber-600 border-amber-200',     icon: Send,          iconColor: 'text-amber-500',   dot: 'bg-amber-500' },
  system:   { color: 'bg-slate-100 text-slate-600 border-slate-200',     icon: Monitor,       iconColor: 'text-slate-500',   dot: 'bg-slate-400' },
};

// Comprehensive registry of all searchable menus with keywords and icons
const menuRegistry = [
  // Dashboard
  {
    id: 'm-dashboard',
    title: 'Dashboard Utama',
    subtitle: 'Ringkasan KPI, Aliran Stok, & Alert',
    category: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-teal-600 bg-teal-50',
    keywords: ['dashboard', 'beranda', 'home', 'ringkasan', 'kpi', 'overview', 'statistik', 'grafik', 'utama']
  },
  // Master Data
  {
    id: 'm-products',
    title: 'Master Produk & SKU',
    subtitle: 'Katalog SKU, Barcode, Stok & Harga Produk',
    category: 'Master Data',
    path: '/master-data/products',
    icon: Boxes,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['produk', 'product', 'sku', 'barcode', 'barang', 'item', 'katalog', 'daftar produk', 'harga', 'stok']
  },
  {
    id: 'm-categories',
    title: 'Kategori Produk',
    subtitle: 'Klasifikasi & Kelompok Kategori Barang',
    category: 'Master Data',
    path: '/master-data/categories',
    icon: FolderTree,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['kategori', 'category', 'golongan', 'kelompok barang', 'klasifikasi', 'jenis']
  },
  {
    id: 'm-units',
    title: 'Satuan Unit (UOM)',
    subtitle: 'Daftar Satuan Ukur (PCS, KG, BOX, Meter, Pallet)',
    category: 'Master Data',
    path: '/master-data/units',
    icon: Ruler,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['satuan', 'unit', 'uom', 'pcs', 'kg', 'box', 'meter', 'liter', 'pallet', 'dimensi']
  },
  {
    id: 'm-suppliers',
    title: 'Data Supplier & Pemasok',
    subtitle: 'Vendor Terdaftar, Kontak & Penilaian Rating',
    category: 'Master Data',
    path: '/master-data/suppliers',
    icon: Truck,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['supplier', 'suplier', 'pemasok', 'vendor', 'mitra', 'kontak supplier', 'alamat vendor']
  },
  {
    id: 'm-customers',
    title: 'Data Pelanggan (Customer)',
    subtitle: 'Klien B2B, Perusahaan Korporat & Distribusi',
    category: 'Master Data',
    path: '/master-data/customers',
    icon: Users,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['pelanggan', 'customer', 'klien', 'client', 'b2b', 'corporate', 'pembeli']
  },
  {
    id: 'm-warehouses',
    title: 'Manajemen Gudang (Warehouses)',
    subtitle: 'Daftar DC, Transit WH & Gudang Regional',
    category: 'Master Data',
    path: '/master-data/warehouses',
    icon: Building2,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['gudang', 'warehouse', 'dc', 'distribution center', 'lokasi gudang', 'hub', 'cabang']
  },
  {
    id: 'm-locations',
    title: 'Lokasi Rak & Bin Gudang',
    subtitle: 'Struktur Zona, Rak, Shelf, dan Bin Penyimpanan',
    category: 'Master Data',
    path: '/master-data/locations',
    icon: MapPin,
    color: 'text-blue-600 bg-blue-50',
    keywords: ['lokasi', 'location', 'rak', 'bin', 'rack', 'shelf', 'zona', 'zone', 'tata letak']
  },
  // Inventory
  {
    id: 'm-stock',
    title: 'Stock Overview / Level Stok',
    subtitle: 'Monitoring Ketersediaan Stok Real-Time',
    category: 'Inventory',
    path: '/inventory/stock',
    icon: PackageCheck,
    color: 'text-emerald-600 bg-emerald-50',
    keywords: ['stock', 'stok', 'persediaan', 'level stok', 'sisa stok', 'inventory', 'kuantitas', 'ketersediaan']
  },
  {
    id: 'm-movement',
    title: 'Mutasi & Pergerakan Stok',
    subtitle: 'Log Riwayat Inbound, Outbound & Transfer',
    category: 'Inventory',
    path: '/inventory/movement',
    icon: History,
    color: 'text-emerald-600 bg-emerald-50',
    keywords: ['mutasi', 'movement', 'riwayat stok', 'log mutasi', 'inbound', 'outbound', 'transfer stok']
  },
  {
    id: 'm-opname',
    title: 'Stock Opname (Stock Audit)',
    subtitle: 'Pencocokan Stok Fisik vs Sistem & Rekonsiliasi',
    category: 'Inventory',
    path: '/inventory/opname',
    icon: ClipboardCheck,
    color: 'text-emerald-600 bg-emerald-50',
    keywords: ['opname', 'stock opname', 'audit stok', 'hitung fisik', 'cek stok', 'verifikasi']
  },
  {
    id: 'm-adjustment',
    title: 'Penyesuaian Stok (Adjustment)',
    subtitle: 'Koreksi Selisih, Kerusakan Fisik, atau Penemuan',
    category: 'Inventory',
    path: '/inventory/adjustment',
    icon: Sliders,
    color: 'text-emerald-600 bg-emerald-50',
    keywords: ['penyesuaian', 'adjustment', 'adjust stok', 'koreksi', 'barang rusak', 'kehilangan', 'tambah kurangi stok']
  },
  {
    id: 'm-slow-moving',
    title: 'Deteksi Slow Moving & Dead Stock',
    subtitle: 'Identifikasi Barang Lambat Laku & Modal Tertahan',
    category: 'Inventory',
    path: '/inventory/slow-moving',
    icon: AlertOctagon,
    color: 'text-amber-600 bg-amber-50',
    keywords: ['slow moving', 'dead stock', 'barang macet', 'lambat laku', 'stagnan', 'modal tertahan']
  },
  // Procurement
  {
    id: 'm-pr',
    title: 'Permintaan Pembelian (PR)',
    subtitle: 'Pengajuan Pembelian Barang Departemen',
    category: 'Procurement',
    path: '/procurement/purchase-request',
    icon: FileSpreadsheet,
    color: 'text-indigo-600 bg-indigo-50',
    keywords: ['pr', 'purchase request', 'permintaan pembelian', 'pengajuan beli', 'usulan barang']
  },
  {
    id: 'm-po',
    title: 'Purchase Order (PO)',
    subtitle: 'Order Pembelian Resmi ke Supplier / Vendor',
    category: 'Procurement',
    path: '/procurement/purchase-order',
    icon: ShoppingCart,
    color: 'text-indigo-600 bg-indigo-50',
    keywords: ['po', 'purchase order', 'pesanan pembelian', 'order vendor', 'surat pesanan']
  },
  {
    id: 'm-gr',
    title: 'Penerimaan Barang (Goods Receipt)',
    subtitle: 'Inbound QC, Penerimaan Fisik & Dokumen GR',
    category: 'Procurement',
    path: '/procurement/goods-receipt',
    icon: Receipt,
    color: 'text-indigo-600 bg-indigo-50',
    keywords: ['gr', 'goods receipt', 'penerimaan barang', 'inbound barang', 'qc penerimaan', 'surat tanda terima']
  },
  {
    id: 'm-supplier-perf',
    title: 'Kinerja Supplier (Performance)',
    subtitle: 'Metrik Lead Time, Akurasi & Kualitas Vendor',
    category: 'Procurement',
    path: '/procurement/supplier-performance',
    icon: Award,
    color: 'text-indigo-600 bg-indigo-50',
    keywords: ['kinerja supplier', 'supplier performance', 'rating vendor', 'skor vendor', 'evaluasi supplier', 'lead time']
  },
  // Outbound
  {
    id: 'm-mr',
    title: 'Permintaan Material (MR)',
    subtitle: 'Permintaan Pengeluaran Barang Proyek/Produksi',
    category: 'Outbound',
    path: '/outbound/material-request',
    icon: FileCheck,
    color: 'text-purple-600 bg-purple-50',
    keywords: ['mr', 'material request', 'permintaan material', 'pengeluaran barang', 'ambil barang proyek']
  },
  {
    id: 'm-picking',
    title: 'Proses Picking',
    subtitle: 'Daftar Pengambilan Barang per Bin / Zona',
    category: 'Outbound',
    path: '/outbound/picking',
    icon: PackageOpen,
    color: 'text-purple-600 bg-purple-50',
    keywords: ['picking', 'pick list', 'ambil stok', 'pengambilan barang', 'pemilahan']
  },
  {
    id: 'm-packing',
    title: 'Proses Packing',
    subtitle: 'Pengepakan, Labeling & Validasi Kemasan',
    category: 'Outbound',
    path: '/outbound/packing',
    icon: BoxSelect,
    color: 'text-purple-600 bg-purple-50',
    keywords: ['packing', 'kemas', 'pengemasan', 'packing list', 'kardus', 'label']
  },
  {
    id: 'm-do',
    title: 'Surat Jalan (Delivery Order)',
    subtitle: 'Penerbitan DO & Dokumen Pengiriman Pelanggan',
    category: 'Outbound',
    path: '/outbound/delivery-order',
    icon: Send,
    color: 'text-purple-600 bg-purple-50',
    keywords: ['surat jalan', 'do', 'delivery order', 'dokumen kirim', 'pengiriman customer']
  },
  {
    id: 'm-shipment',
    title: 'Pengiriman & Ekspedisi (Shipment)',
    subtitle: 'Tracking Kurir, Armada & Status Pengantaran',
    category: 'Outbound',
    path: '/outbound/shipment',
    icon: Truck,
    color: 'text-purple-600 bg-purple-50',
    keywords: ['shipment', 'pengiriman', 'kurir', 'ekspedisi', 'armada', 'truk', 'tracking status']
  },
  // Analytics
  {
    id: 'm-analytics',
    title: 'Analitik Inventory',
    subtitle: 'Statistik Komprehensif & Tren Pergudangan',
    category: 'Analytics',
    path: '/analytics/inventory-analytics',
    icon: LineChart,
    color: 'text-cyan-600 bg-cyan-50',
    keywords: ['analitik', 'analytics', 'tren inventory', 'grafik perputaran', 'analisis stok']
  },
  {
    id: 'm-forecast',
    title: 'Demand Forecasting (AI)',
    subtitle: 'Prediksi Permintaan Barang 30-90 Hari ke Depan',
    category: 'Analytics',
    path: '/analytics/demand-forecast',
    icon: TrendingUp,
    color: 'text-cyan-600 bg-cyan-50',
    keywords: ['forecast', 'demand forecast', 'prediksi ai', 'estimasi penjualan', 'machine learning']
  },
  {
    id: 'm-reorder',
    title: 'Rekomendasi Reorder Point',
    subtitle: 'Kalkulasi Otomatis Safety Stock & ROP',
    category: 'Analytics',
    path: '/analytics/reorder-recommendation',
    icon: BrainCircuit,
    color: 'text-cyan-600 bg-cyan-50',
    keywords: ['reorder', 'reorder point', 'rop', 'safety stock', 'saran beli', 'rekomendasi stok']
  },
  {
    id: 'm-health',
    title: 'Kesehatan Inventory (Health Score)',
    subtitle: 'Rasio Perputaran, Dead Stock & Risiko Stockout',
    category: 'Analytics',
    path: '/analytics/inventory-health',
    icon: Activity,
    color: 'text-cyan-600 bg-cyan-50',
    keywords: ['kesehatan inventory', 'health score', 'turnover', 'risiko habis', 'skor efisiensi']
  },
  // Reports
  {
    id: 'm-rep-stock',
    title: 'Laporan Stok & Inventory',
    subtitle: 'Rekapitulasi Nilai Aset & Kuantitas Stok',
    category: 'Laporan',
    path: '/reports/stock-report',
    icon: FileBarChart,
    color: 'text-rose-600 bg-rose-50',
    keywords: ['laporan stok', 'stock report', 'rekap persediaan', 'nilai aset', 'laporan inventaris']
  },
  {
    id: 'm-rep-inbound',
    title: 'Laporan Inbound',
    subtitle: 'Rekap Penerimaan Barang dari Supplier',
    category: 'Laporan',
    path: '/reports/inbound-report',
    icon: FileBarChart,
    color: 'text-rose-600 bg-rose-50',
    keywords: ['laporan inbound', 'inbound report', 'rekap masuk', 'penerimaan barang masuk']
  },
  {
    id: 'm-rep-outbound',
    title: 'Laporan Outbound',
    subtitle: 'Rekap Pengeluaran & Surat Jalan Pelanggan',
    category: 'Laporan',
    path: '/reports/outbound-report',
    icon: FileBarChart,
    color: 'text-rose-600 bg-rose-50',
    keywords: ['laporan outbound', 'outbound report', 'rekap keluar', 'pengiriman keluar']
  },
  {
    id: 'm-rep-purchase',
    title: 'Laporan Pembelian',
    subtitle: 'Rekap Realisasi Purchase Order & Biaya',
    category: 'Laporan',
    path: '/reports/purchase-report',
    icon: FileBarChart,
    color: 'text-rose-600 bg-rose-50',
    keywords: ['laporan pembelian', 'purchase report', 'biaya po', 'rekap belanja']
  },
  // Import / Export
  {
    id: 'm-import',
    title: 'Import Data Excel',
    subtitle: 'Unggah Data Massal Produk, Stok, & Master',
    category: 'Import / Export',
    path: '/import-export/import',
    icon: Upload,
    color: 'text-teal-600 bg-teal-50',
    keywords: ['import', 'unggah excel', 'upload excel', 'import produk', 'xlsx', 'csv']
  },
  {
    id: 'm-export',
    title: 'Export Data Laporan',
    subtitle: 'Unduh Rekapitulasi Format Excel, CSV, & PDF',
    category: 'Import / Export',
    path: '/import-export/export',
    icon: Download,
    color: 'text-teal-600 bg-teal-50',
    keywords: ['export', 'ekspor data', 'download excel', 'unduh csv', 'cetak pdf']
  },
  // Administration
  {
    id: 'm-account',
    title: 'Pengaturan Akun & Profil',
    subtitle: 'Kelola Profil Pengguna, Foto & Ganti Password',
    category: 'Administrasi',
    path: '/administration/account-settings',
    icon: UserCog,
    color: 'text-slate-600 bg-slate-100',
    keywords: ['pengaturan akun', 'account settings', 'profil', 'ganti password', 'keamanan', 'ubah sandi']
  },
  {
    id: 'm-users',
    title: 'Kelola Pengguna (Users)',
    subtitle: 'Daftar Akun Staff, Supervisor, & Admin',
    category: 'Administrasi',
    path: '/administration/users',
    icon: Users,
    color: 'text-slate-600 bg-slate-100',
    keywords: ['kelola pengguna', 'users', 'tambah user', 'daftar staf', 'karyawan', 'akun']
  },
  {
    id: 'm-roles',
    title: 'Role & Izin Hak Akses (RBAC)',
    subtitle: 'Konfigurasi Matrix Hak Akses Modul',
    category: 'Administrasi',
    path: '/administration/roles',
    icon: ShieldCheck,
    color: 'text-slate-600 bg-slate-100',
    keywords: ['role', 'roles', 'izin', 'permissions', 'rbac', 'hak akses', 'otoritas']
  },
  {
    id: 'm-audit',
    title: 'Log Audit & Rekam Jejak',
    subtitle: 'Riwayat Aktivitas & Perubahan Data Sistem',
    category: 'Administrasi',
    path: '/administration/audit-logs',
    icon: FileText,
    color: 'text-slate-600 bg-slate-100',
    keywords: ['audit log', 'log audit', 'riwayat aktivitas', 'rekam jejak', 'aktivitas pengguna']
  },
];

export const Navbar = ({ isCollapsed = false, toggleCollapse, openMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Load notifications and subscribe to updates
  const refreshNotifications = useCallback(() => {
    setNotifications(notificationService.getAll());
    setUnreadCount(notificationService.getUnreadCount());
  }, []);

  useEffect(() => {
    refreshNotifications();
    window.addEventListener(notificationService.EVENT_NAME, refreshNotifications);
    return () => window.removeEventListener(notificationService.EVENT_NAME, refreshNotifications);
  }, [refreshNotifications]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Search Results (Menus + Products + Data Items)
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // If empty query, show quick popular recommendations
    if (!q) {
      const quickPicks = menuRegistry.filter((m) =>
        ['/dashboard', '/master-data/products', '/inventory/stock', '/procurement/purchase-order', '/outbound/delivery-order', '/analytics/demand-forecast'].includes(m.path)
      );
      return {
        menus: quickPicks,
        products: [],
        orders: [],
        isQuickPicks: true,
        totalItems: quickPicks.length
      };
    }

    // Match Menus
    const matchedMenus = menuRegistry.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(q);
      const inSubtitle = m.subtitle.toLowerCase().includes(q);
      const inCategory = m.category.toLowerCase().includes(q);
      const inKeywords = m.keywords.some((k) => k.toLowerCase().includes(q));
      return inTitle || inSubtitle || inCategory || inKeywords;
    });

    // Match Products from localStorage
    let matchedProducts = [];
    try {
      const products = storageService.get('products') || [];
      matchedProducts = products.filter((p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      ).slice(0, 4);
    } catch {
      matchedProducts = [];
    }

    // Match Orders / Transactions
    let matchedOrders = [];
    try {
      const poList = storageService.get('purchaseOrders') || [];
      const doList = storageService.get('deliveryOrders') || [];
      
      const pos = poList
        .filter((po) => (po.po_no && po.po_no.toLowerCase().includes(q)) || (po.supplier && po.supplier.toLowerCase().includes(q)))
        .map((po) => ({
          id: `po-${po.id}`,
          title: `Purchase Order: ${po.po_no}`,
          subtitle: `${po.supplier} · Status: ${po.status}`,
          path: '/procurement/purchase-order',
          type: 'PO',
          icon: ShoppingCart,
          color: 'text-indigo-600 bg-indigo-50'
        }));

      const dos = doList
        .filter((d) => (d.do_no && d.do_no.toLowerCase().includes(q)) || (d.customer && d.customer.toLowerCase().includes(q)))
        .map((d) => ({
          id: `do-${d.id}`,
          title: `Surat Jalan: ${d.do_no}`,
          subtitle: `${d.customer} · Status: ${d.status}`,
          path: '/outbound/delivery-order',
          type: 'DO',
          icon: Send,
          color: 'text-purple-600 bg-purple-50'
        }));

      matchedOrders = [...pos, ...dos].slice(0, 3);
    } catch {
      matchedOrders = [];
    }

    const totalItems = matchedMenus.length + matchedProducts.length + matchedOrders.length;

    return {
      menus: matchedMenus,
      products: matchedProducts,
      orders: matchedOrders,
      isQuickPicks: false,
      totalItems
    };
  }, [query]);

  const handleSelectSearchItem = (item) => {
    setIsSearchOpen(false);
    setQuery('');
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleGoToSettings = () => {
    setShowProfile(false);
    navigate('/administration/account-settings');
  };

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
    navigate('/login');
  };

  const handleNotifClick = (notif) => {
    notificationService.markAsRead(notif.id);
    setShowNotif(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    notificationService.markAllAsRead();
  };

  const handleDeleteNotif = (e, id) => {
    e.stopPropagation();
    notificationService.remove(id);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    notificationService.clearAll();
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'AD';

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">

      {/* ── Left: Menu Toggle & Global Search ──────────────────────── */}
      <div className="flex items-center gap-2.5 flex-1 max-w-xl relative">

        {/* Mobile drawer trigger */}
        <button
          onClick={openMobile}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse / Expand Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-all border border-slate-200/70 shadow-2xs"
          title={isCollapsed ? 'Buka Menu Lengkap' : 'Tutup / Perkecil Menu'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-teal-600" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Global Interactive Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Cari menu, produk, SKU, PO, surat jalan..."
            className="w-full pl-8 pr-9 py-1.5 bg-slate-50/90 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10 transition-all shadow-inner"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* ── Search Results Dropdown ──────────────────────── */}
          {isSearchOpen && (
            <div
              ref={searchDropdownRef}
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-scale-in max-h-[460px] flex flex-col"
            >
              {/* Dropdown Header */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {searchResults.isQuickPicks
                      ? 'Pilihan Menu Populer'
                      : `Hasil Pencarian untuk "${query}" (${searchResults.totalItems})`}
                  </span>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-600"
                >
                  Tutup
                </button>
              </div>

              {/* Scrollable Results List */}
              <div className="p-2 overflow-y-auto space-y-3 divide-y divide-slate-100">
                {searchResults.totalItems === 0 ? (
                  <div className="py-8 text-center px-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">Tidak ada menu atau data ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Coba cari dengan kata kunci lain seperti <i>"stok", "produk", "gudang", "po", "mutasi"</i>
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Section: Menus */}
                    {searchResults.menus.length > 0 && (
                      <div className="space-y-1 pt-1 first:pt-0">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {searchResults.isQuickPicks ? 'Pilihan Menu Populer' : 'Navigasi Menu'}
                        </div>
                        {searchResults.menus.map((m) => {
                          const IconComp = m.icon || Boxes;
                          return (
                            <button
                              key={m.id || m.path}
                              type="button"
                              onClick={() => handleSelectSearchItem(m)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left hover:bg-teal-50/80 border border-transparent hover:border-teal-200/60 text-slate-800 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${m.color || 'bg-slate-100 text-slate-600'} group-hover:bg-teal-600 group-hover:text-white`}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold leading-tight truncate group-hover:text-teal-900">{m.title}</p>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 border border-slate-200 flex-shrink-0">
                                      {m.category}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{m.subtitle}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                <span className="text-[10px] font-bold flex items-center gap-1 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span>Buka Menu</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Section: Products */}
                    {searchResults.products.length > 0 && (
                      <div className="space-y-1 pt-2">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Data Produk & SKU
                        </div>
                        {searchResults.products.map((p) => {
                          return (
                            <button
                              key={`p-${p.id}`}
                              type="button"
                              onClick={() => handleSelectSearchItem({ path: '/master-data/products' })}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left hover:bg-blue-50/80 border border-transparent hover:border-blue-200/60 text-slate-800 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                >
                                  <Boxes className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold leading-tight truncate group-hover:text-blue-900">{p.name}</p>
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-blue-100/70 text-blue-700">
                                      {p.sku}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    Stok: <b className="text-slate-600">{p.stock} {p.unit || 'PCS'}</b> · {p.warehouse || 'Gudang'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                <span className="text-[10px] font-bold flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span>Lihat Produk</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Section: Transactions & Orders */}
                    {searchResults.orders.length > 0 && (
                      <div className="space-y-1 pt-2">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Transaksi & Dokumen
                        </div>
                        {searchResults.orders.map((o) => {
                          const OrderIcon = o.icon || FileText;
                          return (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => handleSelectSearchItem(o)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left hover:bg-purple-50/80 border border-transparent hover:border-purple-200/60 text-slate-800 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${o.color || 'bg-purple-50 text-purple-600'} group-hover:bg-purple-600 group-hover:text-white`}
                                >
                                  <OrderIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold leading-tight truncate group-hover:text-purple-900">{o.title}</p>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{o.subtitle}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                <span className="text-[10px] font-bold flex items-center gap-1 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span>Buka Dokumen</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-teal-700">NEXORA Quick Menu Search</span>
                <span>Klik pada menu atau hasil pencarian untuk membuka halaman</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Actions: System, Notif, Profile ──────────── */}
      <div className="flex items-center gap-2">

        {/* Live status badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Online</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif((v) => !v);
              setShowProfile(false);
              setIsSearchOpen(false);
            }}
            className="relative p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-extrabold text-white flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 mt-2 w-96 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pusat Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-teal-600 font-bold cursor-pointer hover:underline flex items-center gap-1 hover:text-teal-800 transition-colors"
                        title="Tandai semua dibaca"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Tandai dibaca
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-[10px] text-slate-400 font-bold cursor-pointer hover:text-rose-500 hover:underline flex items-center gap-1 transition-colors"
                        title="Hapus semua notifikasi"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <Bell className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-500">Tidak ada notifikasi</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Semua sudah tertangani 👍</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const cfg = typeConfig[n.type] || typeConfig.system;
                      const TypeIcon = cfg.icon;
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${
                            n.unread ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${n.unread ? 'bg-white border border-slate-200 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                            <TypeIcon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs leading-snug ${n.unread ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>
                                {n.title}
                              </p>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${cfg.color}`}>
                                  {n.type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.text}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <p className="text-[10px] text-slate-400 font-mono">{notificationService.formatTimeAgo(n.time)}</p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {n.unread && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); notificationService.markAsRead(n.id); }}
                                    className="p-1 rounded-md hover:bg-teal-100 text-teal-600 transition-colors"
                                    title="Tandai dibaca"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => handleDeleteNotif(e, n.id)}
                                  className="p-1 rounded-md hover:bg-rose-100 text-rose-500 transition-colors"
                                  title="Hapus notifikasi"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Unread dot */}
                          {n.unread && (
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${cfg.dot}`} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/30 text-center">
                    <span className="text-[10px] font-medium text-slate-400">
                      {notifications.length} notifikasi · {unreadCount} belum dibaca
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotif(false);
              setIsSearchOpen(false);
            }}
            className="flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center font-black text-xs text-white shadow-md shadow-teal-500/20 flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">{user?.role || 'Super Admin'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-2 w-60 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator NEXORA'}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user?.email || 'admin@nexora.com'}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/80">
                    {user?.role || 'Super Admin'}
                  </span>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={handleGoToSettings}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-teal-600" />
                    <span>Pengaturan Akun</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

