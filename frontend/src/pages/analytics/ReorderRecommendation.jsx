import React from 'react';
import { BrainCircuit, ShoppingCart, AlertTriangle, ArrowRight } from 'lucide-react';

const ReorderRecommendation = () => {
  const recommendations = [
    { sku: 'SKU-FG-088', name: 'Heavy Duty Crate Motor', currentStock: 15, reorderPoint: 50, recommendedEOQ: 250, supplier: 'PT Electro Tech Supply', leadTime: '7 Days', estCost: 'Rp 62.500.000' },
    { sku: 'SKU-RAW-002', name: 'Copper Wire Spool 50m', currentStock: 8, reorderPoint: 25, recommendedEOQ: 100, supplier: 'CV Mega Steel Indonesia', leadTime: '5 Days', estCost: 'Rp 14.000.000' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-7 h-7 text-cyan-400" />
          Automated Reorder Point & EOQ Recommendations
        </h1>
        <p className="text-sm text-slate-400 mt-1">Economic Order Quantity (EOQ) calculations & lead-time safety stock buffers</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.sku} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{rec.sku}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{rec.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                <AlertTriangle className="w-3.5 h-3.5" /> Below Safety Buffer
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#090f1d] p-4 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Current Stock</span>
                <span className="text-rose-400 font-bold font-mono text-sm mt-0.5 block">{rec.currentStock} Units</span>
              </div>
              <div>
                <span className="text-slate-500 block">Reorder Point (ROP)</span>
                <span className="text-amber-400 font-bold font-mono text-sm mt-0.5 block">{rec.reorderPoint} Units</span>
              </div>
              <div>
                <span className="text-slate-500 block">Recommended EOQ</span>
                <span className="text-cyan-400 font-bold font-mono text-sm mt-0.5 block">+{rec.recommendedEOQ} Units</span>
              </div>
              <div>
                <span className="text-slate-500 block">Est. PO Total</span>
                <span className="text-emerald-400 font-bold font-mono text-sm mt-0.5 block">{rec.estCost}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Supplier: <span className="text-white font-medium">{rec.supplier}</span> ({rec.leadTime} Lead Time)</span>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:opacity-90 transition flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5" /> Auto-Generate Draft PO <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReorderRecommendation;
