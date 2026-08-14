import React from 'react';
import { Flame } from 'lucide-react';

const topProducts = [
  { rank: 1, sku: 'SKU-ELE-001', name: 'Smart Sensor Hub',        movement: 1284, trend: '+18%', color: '#06b6d4',  pct: 100 },
  { rank: 2, sku: 'SKU-RAW-002', name: 'Aluminum Alloy Sheet',    movement: 984,  trend: '+11%', color: '#10b981',  pct: 76  },
  { rank: 3, sku: 'SKU-PCK-007', name: 'Bubble Wrap Roll 50m',    movement: 820,  trend: '+4%',  color: '#a78bfa',  pct: 64  },
  { rank: 4, sku: 'SKU-MEC-021', name: 'Stainless Bolt M8x40',    movement: 715,  trend: '+22%', color: '#f59e0b',  pct: 56  },
  { rank: 5, sku: 'SKU-CHM-003', name: 'Industrial Solvent A1',   movement: 542,  trend: '-3%',  color: '#f43f5e',  pct: 42  },
];

const rankColor = ['#FFD700', '#C0C0C0', '#CD7F32'];

export const TopProducts = () => {
  return (
    <div className="glass-card p-5 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Flame className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 leading-none">Top Moving Products</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Produk dengan pergerakan tertinggi bulan ini</p>
        </div>
      </div>

      {/* Product rows */}
      <div className="space-y-3">
        {topProducts.map((p, idx) => {
          const isPositive = p.trend.startsWith('+');
          return (
            <div key={idx} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Rank badge */}
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                  style={{
                    background: idx < 3 ? `${rankColor[idx]}18` : 'rgba(255,255,255,0.04)',
                    color: idx < 3 ? rankColor[idx] : '#64748b',
                    border: `1px solid ${idx < 3 ? `${rankColor[idx]}30` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {p.rank}
                </span>
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-200 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {p.trend}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-300">
                        {p.movement.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 font-mono">{p.sku}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="progress-bar ml-8">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${p.pct}%`, background: p.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
