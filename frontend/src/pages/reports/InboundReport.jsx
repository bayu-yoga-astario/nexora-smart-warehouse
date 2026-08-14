import React from 'react';
import { FileBarChart, Download, Filter } from 'lucide-react';

const InboundReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="w-7 h-7 text-cyan-400" />
            Inbound & Receiving Ledger Report
          </h1>
          <p className="text-sm text-slate-400 mt-1">Audit log of all supplier receipts, GRNs, and warehouse puts</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
          <Download className="w-4 h-4" /> Export Inbound CSV
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono text-sm shadow-xl">
        Inbound receiving report engine ready. Filter by date range or supplier to generate complete receipts overview.
      </div>
    </div>
  );
};

export default InboundReport;
