import React, { useState, useEffect } from 'react';
import {
  Boxes, Banknote, PackageCheck, AlertTriangle,
  RefreshCw, Calendar, TrendingUp, Activity
} from 'lucide-react';
import { StatCard }          from '../../components/dashboard/StatCard';
import { StockChart }        from '../../components/dashboard/StockChart';
import { TransactionChart }  from '../../components/dashboard/TransactionChart';
import { LowStockWidget }    from '../../components/dashboard/LowStockWidget';
import { RecentActivity }    from '../../components/dashboard/RecentActivity';
import { WarehouseCapacity } from '../../components/dashboard/WarehouseCapacity';
import { TopProducts }       from '../../components/dashboard/TopProducts';

// ─── Sparkline data per card ──────────────────────────────
const sparkTotal  = [3,4,4,5,5,6,6,7,7,8,8,9].map((v)=>({v}));
const sparkValue  = [8,9,11,10,14,13,16,15,18,20,22,24].map((v)=>({v}));
const sparkInb    = [10,14,12,18,20,23,19,25,22,28,24,23].map((v)=>({v}));
const sparkAlerts = [12,10,9,11,8,9,7,10,9,8,7,7].map((v)=>({v}));

// ─── Real-time clock ─────────────────────────────────────
const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

// ─── Operational KPI quick stats ─────────────────────────
const quickStats = [
  { label: 'Active PO',      value: '14',  icon: PackageCheck, color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  { label: 'Pending PR',     value: '6',   icon: TrendingUp,   color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  { label: 'Shipments Today',value: '8',   icon: Activity,     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Audit Pending',  value: '3',   icon: AlertTriangle,color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
];

const Dashboard = () => {
  const now = useClock();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6 pb-8">

      {/* ── Page Header ────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dashboard Operasional
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">{dateStr}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{timeStr}</span>
          </div>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d1627] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white hover:border-white/[0.16] hover:bg-[#121f36] transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Muat Ulang Data</span>
        </button>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────── */}
      <div key={refreshKey} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Total Produk"
          rawValue={1284}
          suffix=" SKU"
          change="+12.5%"
          trend="up"
          icon={Boxes}
          color="cyan"
          sparkData={sparkTotal}
          subtitle="vs 1.141 SKU bulan lalu"
        />
        <StatCard
          title="Nilai Stok"
          prefix="Rp "
          rawValue={2.4}
          suffix="B"
          change="+8.2%"
          trend="up"
          icon={Banknote}
          color="emerald"
          sparkData={sparkValue}
          subtitle="Total valuasi inventaris gudang"
        />
        <StatCard
          title="Pending Inbound"
          rawValue={23}
          suffix=" GR"
          change="+3"
          trend="up"
          icon={PackageCheck}
          color="amber"
          sparkData={sparkInb}
          subtitle="Goods Receipt menunggu verifikasi"
        />
        <StatCard
          title="Low Stock Alerts"
          rawValue={7}
          suffix=" item"
          change="-2"
          trend="down"
          icon={AlertTriangle}
          color="rose"
          sparkData={sparkAlerts}
          subtitle="3 critical · 4 warning"
        />
      </div>

      {/* ── Quick Operational KPIs ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickStats.map((q, i) => {
          const Icon = q.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0d1627] border border-white/[0.08] hover:border-white/[0.16] transition-all shadow-sm"
            >
              <div className={`p-2 rounded-xl ${q.bg}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${q.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-medium truncate">{q.label}</p>
                <p className={`text-base font-extrabold font-mono leading-none mt-0.5 ${q.color}`}>{q.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StockChart />
        <TransactionChart />
      </div>

      {/* ── Bottom Widgets Row ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LowStockWidget />
        <RecentActivity />
      </div>

      {/* ── Bottom 2 — New Widgets ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WarehouseCapacity />
        <TopProducts />
      </div>
    </div>
  );
};

export default Dashboard;
