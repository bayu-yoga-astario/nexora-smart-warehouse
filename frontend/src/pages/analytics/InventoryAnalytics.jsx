import React from 'react';
import { LineChart, TrendingUp, BarChart2, PieChart, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const InventoryAnalytics = () => {
  const stockTurnoverData = [
    { month: 'Jan', velocity: 4.2, turnover: 8.5 },
    { month: 'Feb', velocity: 4.8, turnover: 9.1 },
    { month: 'Mar', velocity: 5.1, turnover: 9.8 },
    { month: 'Apr', velocity: 5.9, turnover: 11.2 },
    { month: 'May', velocity: 6.4, turnover: 12.0 },
    { month: 'Jun', velocity: 7.0, turnover: 13.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LineChart className="w-7 h-7 text-cyan-400" />
            Inventory Analytics & Velocity Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">Stock turnover ratios, holding costs, and inventory velocity metrics</p>
        </div>
        <button className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh ML Engine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 font-medium uppercase">Annual Inventory Turnover Ratio</p>
          <h3 className="text-3xl font-extrabold text-cyan-400 mt-2">13.5x</h3>
          <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +15.4% vs last quarter
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 font-medium uppercase">Days Sales of Inventory (DSI)</p>
          <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">27.0 Days</h3>
          <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> 3.5 days faster cash conversion
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <p className="text-xs text-slate-400 font-medium uppercase">Carrying / Holding Cost</p>
          <h3 className="text-3xl font-extrabold text-amber-400 mt-2">Rp 142.5M</h3>
          <span className="text-xs text-slate-400 font-medium block mt-2">Estimated 18% per annum</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Stock Turnover & Velocity Trend (6 Months)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stockTurnoverData}>
              <defs>
                <linearGradient id="turnoverGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="turnover" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#turnoverGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
