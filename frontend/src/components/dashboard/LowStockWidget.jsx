import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const lowStockItems = [
  { sku: 'SKU-ELE-001', name: 'Smart Sensor Hub',       stock: 12,  min: 50,  unit: 'PCS', severity: 'critical' },
  { sku: 'SKU-RAW-002', name: 'Aluminum Alloy Sheet',   stock: 45,  min: 100, unit: 'KG',  severity: 'critical' },
  { sku: 'SKU-PCK-007', name: 'Bubble Wrap Roll 50m',   stock: 18,  min: 30,  unit: 'PCS', severity: 'warning'  },
  { sku: 'SKU-ELE-014', name: 'Li-Ion Battery Pack 5V', stock: 31,  min: 60,  unit: 'PCS', severity: 'warning'  },
  { sku: 'SKU-CHM-003', name: 'Industrial Solvent A1',  stock: 8,   min: 25,  unit: 'LTR', severity: 'critical' },
  { sku: 'SKU-MEC-021', name: 'Stainless Bolt M8x40',   stock: 220, min: 500, unit: 'PCS', severity: 'warning'  },
];

const severityConfig = {
  critical: {
    bar: 'bg-rose-500',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    label: 'Critical',
    dot: 'bg-rose-400',
  },
  warning: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    label: 'Warning',
    dot: 'bg-amber-400',
  },
};

export const LowStockWidget = () => {
  const criticalCount = lowStockItems.filter((i) => i.severity === 'critical').length;

  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-none">Low Stock Alert</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{criticalCount} item critical · {lowStockItems.length} total</p>
          </div>
        </div>
        <Link
          to="/inventory/stock"
          className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold transition-colors"
        >
          Lihat Semua <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {lowStockItems.map((item, idx) => {
          const pct = Math.round((item.stock / item.min) * 100);
          const cfg = severityConfig[item.severity];
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#090f1d] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{item.sku}</span>
                  <span className="text-xs text-slate-200 truncate hidden sm:block font-medium">{item.name}</span>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              {/* Progress bar */}
              <div className="progress-bar mt-1">
                <div
                  className={`progress-bar-fill ${cfg.bar}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-400 sm:hidden truncate">{item.name}</span>
                <span className="text-[10px] text-slate-400 ml-auto font-mono">
                  {item.stock} / {item.min} {item.unit} ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
