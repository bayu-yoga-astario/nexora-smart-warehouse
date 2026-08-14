import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell
} from 'recharts';
import { ArrowDownToLine, Send } from 'lucide-react';

const weekData = [
  { day: 'Sen', Inbound: 124, Outbound: 88 },
  { day: 'Sel', Inbound: 158, Outbound: 115 },
  { day: 'Rab', Inbound: 182, Outbound: 164 },
  { day: 'Kam', Inbound: 215, Outbound: 143 },
  { day: 'Jum', Inbound: 194, Outbound: 228 },
  { day: 'Sab', Inbound: 82,  Outbound: 61 },
  { day: 'Min', Inbound: 46,  Outbound: 29 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1520] border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl text-xs">
      <p className="text-slate-400 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
          <span className="text-slate-300">{p.name}</span>
          <span className="ml-auto font-bold text-white font-mono">{p.value.toLocaleString()} units</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between">
        <span className="text-slate-500">Net Flow</span>
        <span className={`font-bold font-mono ${
          (payload[0]?.value ?? 0) >= (payload[1]?.value ?? 0)
            ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {((payload[0]?.value ?? 0) - (payload[1]?.value ?? 0) >= 0 ? '+' : '')}
          {(payload[0]?.value ?? 0) - (payload[1]?.value ?? 0)} units
        </span>
      </div>
    </div>
  );
};

export const TransactionChart = () => {
  const [activeDay, setActiveDay] = useState(null);

  const totalInbound  = weekData.reduce((s, d) => s + d.Inbound, 0);
  const totalOutbound = weekData.reduce((s, d) => s + d.Outbound, 0);
  const netFlow = totalInbound - totalOutbound;

  return (
    <div className="glass-card p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 mb-0.5">
            Inbound vs Outbound — Mingguan
          </h3>
          <p className="text-xs text-slate-400">
            Volume pergerakan barang 7 hari terakhir
          </p>
        </div>
        {/* Net flow badge */}
        <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border font-mono ${
          netFlow >= 0
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
        }`}>
          Net {netFlow >= 0 ? '+' : ''}{netFlow}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Total Inbound</p>
            <p className="text-sm font-black text-white font-mono">{totalInbound.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Send className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Total Outbound</p>
            <p className="text-sm font-black text-white font-mono">{totalOutbound.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weekData}
            barGap={3}
            barCategoryGap="30%"
            onMouseLeave={() => setActiveDay(null)}
            margin={{ top: 0, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="transparent"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)', radius: 6 }} />
            <Bar dataKey="Inbound" name="Inbound" radius={[4,4,0,0]}>
              {weekData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={activeDay === index ? '#10b981' : 'rgba(16,185,129,0.75)'}
                  onMouseEnter={() => setActiveDay(index)}
                />
              ))}
            </Bar>
            <Bar dataKey="Outbound" name="Outbound" radius={[4,4,0,0]}>
              {weekData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={activeDay === index ? '#f59e0b' : 'rgba(245,158,11,0.75)'}
                  onMouseEnter={() => setActiveDay(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pl-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
          <span className="text-[11px] text-slate-400 font-medium">Inbound</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
          <span className="text-[11px] text-slate-400 font-medium">Outbound</span>
        </div>
      </div>
    </div>
  );
};
