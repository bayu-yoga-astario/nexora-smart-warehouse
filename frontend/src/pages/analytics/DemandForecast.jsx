import React from 'react';
import { TrendingUp, BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';

const DemandForecast = () => {
  const forecastItems = [
    { sku: 'SKU-ELE-001', name: 'Microcontroller Board v2.1', currentStock: 120, avgMonthlySales: 450, predictedDemand: '1,420 Pcs', confidence: '96.2%', recommendation: 'Increase Safety Stock +20%' },
    { sku: 'SKU-RAW-009', name: 'Aluminium Sheet Grade A', currentStock: 450, avgMonthlySales: 180, predictedDemand: '520 Pcs', confidence: '91.8%', recommendation: 'Normal Procurement' },
    { sku: 'SKU-FG-088', name: 'Heavy Duty Crate Motor', currentStock: 15, avgMonthlySales: 85, predictedDemand: '290 Pcs', confidence: '94.5%', recommendation: 'Urgent Purchase Order' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-cyan-400" />
            AI Demand Forecasting (Python Engine)
          </h1>
          <p className="text-sm text-slate-400 mt-1">Predictive seasonal demand forecasting powered by Machine Learning</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Scikit-Learn Model Active
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#090f1d] text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">SKU / Product Name</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Avg Monthly Run Rate</th>
                <th className="px-6 py-4">Predicted Next 30-Day Demand</th>
                <th className="px-6 py-4">AI Model Confidence</th>
                <th className="px-6 py-4">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {forecastItems.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono text-cyan-400 font-bold block text-xs">{item.sku}</span>
                    <span className="font-medium text-white block mt-0.5">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-white">{item.currentStock}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{item.avgMonthlySales} / mo</td>
                  <td className="px-6 py-4 font-mono font-bold text-cyan-400">{item.predictedDemand}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">{item.confidence}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      item.recommendation.includes('Urgent') ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {item.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast;
