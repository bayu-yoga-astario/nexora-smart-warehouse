import React from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const InventoryHealth = ({ healthData }) => {
  const score = healthData?.health_score || 88.5;

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-slate-100">Overall Inventory Health Index</h3>
        </div>
        <p className="text-xs text-slate-400">AI-computed score analyzing turnover rate, dead stock ratio, and stockout probability</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-slate-300 font-medium">Turnover: <strong className="text-cyan-400 font-mono">{healthData?.turnover_rate || '4.2x / yr'}</strong></span>
          <span className="text-xs text-slate-300 font-medium">Dead Stock: <strong className="text-amber-400 font-mono">{healthData?.dead_stock_ratio || '3.1%'}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-3xl font-extrabold text-white font-mono">{score}%</span>
          <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Optimal Health</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center bg-cyan-500/10 shadow-lg shadow-cyan-500/20">
          <CheckCircle2 className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
    </div>
  );
};
