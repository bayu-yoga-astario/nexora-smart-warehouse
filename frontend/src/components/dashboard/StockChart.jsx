import React, { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const allData = {
  '3M': [
    { label: 'Apr', stock: 5100, value: 1.58 },
    { label: 'May', stock: 5800, value: 1.87 },
    { label: 'Jun', stock: 6300, value: 2.10 },
  ],
  '6M': [
    { label: 'Jan', stock: 4200, value: 1.22 },
    { label: 'Feb', stock: 4600, value: 1.41 },
    { label: 'Mar', stock: 3900, value: 1.14 },
    { label: 'Apr', stock: 5100, value: 1.58 },
    { label: 'May', stock: 5800, value: 1.87 },
    { label: 'Jun', stock: 6300, value: 2.10 },
  ],
  '1Y': [
    { label: 'Jul\'25', stock: 3100, value: 0.89 },
    { label: 'Aug\'25', stock: 3450, value: 1.02 },
    { label: 'Sep\'25', stock: 3700, value: 1.11 },
    { label: 'Oct\'25', stock: 4100, value: 1.24 },
    { label: 'Nov\'25', stock: 4400, value: 1.35 },
    { label: 'Dec\'25', stock: 3950, value: 1.19 },
    { label: 'Jan',     stock: 4200, value: 1.22 },
    { label: 'Feb',     stock: 4600, value: 1.41 },
    { label: 'Mar',     stock: 3900, value: 1.14 },
    { label: 'Apr',     stock: 5100, value: 1.58 },
    { label: 'May',     stock: 5800, value: 1.87 },
    { label: 'Jun',     stock: 6300, value: 2.10 },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1520] border border-slate-700/60 rounded-xl px-4 py-3 shadow-2xl text-xs">
      <p className="text-slate-400 font-semibold mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
          <span className="text-slate-300">Nilai Stok</span>
          <span className="ml-auto font-bold text-white font-mono">
            Rp {payload[0]?.value?.toFixed(2)}B
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-slate-300">Jml SKU</span>
          <span className="ml-auto font-bold text-white font-mono">
            {payload[1]?.value?.toLocaleString('id-ID')} pcs
          </span>
        </div>
      </div>
    </div>
  );
};

export const StockChart = () => {
  const [period, setPeriod] = useState('6M');
  const data = allData[period];

  const latestVal = data[data.length - 1]?.value ?? 0;
  const prevVal   = data[data.length - 2]?.value ?? 0;
  const pctChange = prevVal > 0 ? (((latestVal - prevVal) / prevVal) * 100).toFixed(1) : '0.0';
  const isUp = latestVal >= prevVal;

  return (
    <div className="glass-card p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Stock Valuation Trend</h3>
          </div>
          <p className="text-xs text-slate-400 ml-8">
            Total nilai inventory (Miliar IDR) &amp; volume SKU
          </p>
        </div>
        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-[#090f1d] border border-white/[0.08] rounded-xl p-1">
          {['3M', '6M', '1Y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`period-pill ${period === p ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex items-center gap-4 mb-5 pl-1">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nilai Terkini</p>
          <p className="text-xl font-black text-white font-mono">
            Rp {latestVal.toFixed(2)}B
          </p>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
          isUp
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
        }`}>
          {isUp ? '▲' : '▼'} {pctChange}%
        </div>
      </div>

      {/* Chart */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#06b6d4" stopOpacity={0.30} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#10b981" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="transparent"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#gradCyan)"
              dot={false}
              activeDot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="stock"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="url(#gradEmerald)"
              dot={false}
              activeDot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              yAxisId={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pl-1">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-cyan-400 rounded-full inline-block" />
          <span className="text-[11px] text-slate-400 font-medium">Nilai (IDR)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 border-t-2 border-dashed border-emerald-500 inline-block" />
          <span className="text-[11px] text-slate-400 font-medium">Volume SKU</span>
        </div>
      </div>
    </div>
  );
};
