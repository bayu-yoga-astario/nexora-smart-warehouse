import React from 'react';
import { PackageCheck, Send, ClipboardCheck, Sliders, ShoppingCart, AlertTriangle, RefreshCw } from 'lucide-react';

const activities = [
  {
    icon: PackageCheck,
    color: 'emerald',
    title: 'GR-2026-041 Diterima',
    desc: '120 pcs Smart Sensor Hub dari PT Elco Teknologi',
    time: '8 menit lalu',
    type: 'INBOUND',
  },
  {
    icon: Send,
    color: 'amber',
    title: 'DO-2026-088 Dikirim',
    desc: 'Delivery Order ke PT Global Distribusi — 3 item',
    time: '42 menit lalu',
    type: 'OUTBOUND',
  },
  {
    icon: ShoppingCart,
    color: 'cyan',
    title: 'PO-2026-019 Disetujui',
    desc: 'Purchase Order Aluminium Sheet 500 KG diapprove',
    time: '1 jam lalu',
    type: 'PO',
  },
  {
    icon: ClipboardCheck,
    color: 'violet',
    title: 'Opname Selesai — Bin A-12',
    desc: 'Stock Opname audit area A-12 tanpa selisih',
    time: '3 jam lalu',
    type: 'OPNAME',
  },
  {
    icon: AlertTriangle,
    color: 'rose',
    title: 'Low Stock Terdeteksi',
    desc: 'Industrial Solvent A1 — stok 8 LTR (min 25 LTR)',
    time: '4 jam lalu',
    type: 'ALERT',
  },
  {
    icon: Sliders,
    color: 'slate',
    title: 'Adjustment ADJ-2026-004',
    desc: 'Koreksi stok Bolt M8x40 +80 pcs (selisih opname)',
    time: '6 jam lalu',
    type: 'ADJ',
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   border: 'border-amber-500/20',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'   },
  cyan:    { bg: 'bg-cyan-500/10',    icon: 'text-cyan-400',    border: 'border-cyan-500/20',    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'    },
  violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20',  badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20'  },
  rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-400',    border: 'border-rose-500/20',    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'    },
  slate:   { bg: 'bg-slate-700/40',   icon: 'text-slate-300',   border: 'border-slate-700/40',   badge: 'bg-slate-700/40 text-slate-400 border-slate-700'   },
};

export const RecentActivity = () => {
  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-700/50 border border-slate-700/60">
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-none">Aktivitas Terkini</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time log transaksi gudang</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Timeline */}
      <div className="activity-timeline space-y-0">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          const c = colorMap[act.color] || colorMap.slate;
          const isLast = idx === activities.length - 1;
          return (
            <div key={idx} className={`flex gap-3 ${isLast ? '' : 'pb-4'}`}>
              {/* Icon + line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center z-10 ${c.bg} ${c.border}`}>
                  <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 mt-1 bg-gradient-to-b from-slate-700/60 to-transparent" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{act.title}</p>
                  <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${c.badge}`}>
                    {act.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{act.desc}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">{act.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
