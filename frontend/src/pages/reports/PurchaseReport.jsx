import React from 'react';
import { FileBarChart, Download } from 'lucide-react';

const PurchaseReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="w-7 h-7 text-cyan-400" />
            Procurement Spend & Purchase Analysis Report
          </h1>
          <p className="text-sm text-slate-400 mt-1">Vendor spending analysis, PO history, and procurement metrics</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
          <Download className="w-4 h-4" /> Export Purchase Report
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono text-sm shadow-xl">
        Procurement spending report engine ready. Select vendor or quarter to generate total spend analytics.
      </div>
    </div>
  );
};

export default PurchaseReport;
