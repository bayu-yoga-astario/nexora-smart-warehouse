import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Building2 } from 'lucide-react';

const warehouses = [
  { name: 'Gudang Utama A',  used: 7820, total: 10000, color: '#06b6d4' },
  { name: 'Gudang Barat B',  used: 4350, total: 8000,  color: '#10b981' },
  { name: 'Gudang Timur C',  used: 3100, total: 5000,  color: '#f59e0b' },
  { name: 'Cold Storage D',  used: 1200, total: 2000,  color: '#a78bfa' },
];

const RADIAN = Math.PI / 180;

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pct = Math.round((d.used / d.total) * 100);
  return (
    <div className="bg-[#0d1520] border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl text-xs">
      <p className="font-semibold text-slate-200 mb-2">{d.name}</p>
      <div className="flex justify-between gap-6">
        <span className="text-slate-500">Terpakai</span>
        <span className="text-white font-mono font-bold">{d.used.toLocaleString()} / {d.total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between gap-6 mt-1">
        <span className="text-slate-500">Kapasitas</span>
        <span className="font-mono font-bold" style={{ color: d.color }}>{pct}%</span>
      </div>
    </div>
  );
};

export const WarehouseCapacity = () => {
  const totalUsed  = warehouses.reduce((s, w) => s + w.used, 0);
  const totalCap   = warehouses.reduce((s, w) => s + w.total, 0);
  const overallPct = Math.round((totalUsed / totalCap) * 100);

  const pieData = warehouses.map((w) => ({ ...w, value: w.used }));

  return (
    <div className="glass-card p-5 rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <Building2 className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 leading-none">Kapasitas Gudang</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Utilisasi ruang per warehouse</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut chart */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={64}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={<CustomLabel />}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-white font-mono leading-none">{overallPct}%</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Used</span>
          </div>
        </div>

        {/* Warehouse list */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {warehouses.map((w, i) => {
            const pct = Math.round((w.used / w.total) * 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: w.color }} />
                    <span className="text-[11px] text-slate-400 truncate">{w.name}</span>
                  </div>
                  <span className="text-[11px] font-bold font-mono flex-shrink-0 ml-2"
                    style={{ color: w.color }}>
                    {pct}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%`, background: w.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
