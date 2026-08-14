import React from 'react';
import { Activity, ShieldCheck, AlertOctagon, PackageCheck, HeartPulse } from 'lucide-react';

const InventoryHealth = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-7 h-7 text-cyan-400" />
          Inventory Health & Audit Scorecard
        </h1>
        <p className="text-sm text-slate-400 mt-1">Comprehensive system diagnostic index for dead stock, shrinkage, and stock balance</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-extrabold text-3xl shadow-lg shadow-cyan-500/20">
            94
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Overall Health Score: Excellent</h2>
            <p className="text-sm text-slate-400 mt-1">94/100 points based on stock accuracy, turnover, and zero phantom inventory</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-[#090f1d] p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Stock Accuracy</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">99.2%</span>
          </div>
          <div className="bg-[#090f1d] p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Shrinkage Rate</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">0.05%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Healthy Categories
          </h3>
          <p className="text-xs text-slate-400">Categories with optimal stock levels, high turnover, and low holding risk</p>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between p-2 rounded bg-[#090f1d]/60 text-slate-300">
              <span>Electronics & PCBs</span>
              <span className="font-semibold text-emerald-400">Score 98/100</span>
            </li>
            <li className="flex justify-between p-2 rounded bg-[#090f1d]/60 text-slate-300">
              <span>Finished Goods</span>
              <span className="font-semibold text-emerald-400">Score 94/100</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" /> Categories Needing Attention
          </h3>
          <p className="text-xs text-slate-400">Categories experiencing slow-moving stock accumulation or overstocking</p>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between p-2 rounded bg-[#090f1d]/60 text-slate-300">
              <span>Raw Materials (Steel & Heavy Coil)</span>
              <span className="font-semibold text-amber-400">Score 76/100 (Overstocked)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InventoryHealth;
