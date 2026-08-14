import React, { useState, useRef } from 'react';
import { FileBarChart, Download, Filter, Search, Printer, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { exportToPDF } from '../../utils/pdfExport';

const StockReport = () => {
  const [reportData] = useState([
    { sku: 'SKU-ELE-001', name: 'Microcontroller Board v2.1', category: 'Electronics', initialStock: 100, inbound: 50, outbound: 30, currentStock: 120, unitCost: 'Rp 250.000', totalValue: 'Rp 30.000.000' },
    { sku: 'SKU-RAW-009', name: 'Aluminium Sheet Grade A', category: 'Raw Materials', initialStock: 500, inbound: 0, outbound: 50, currentStock: 450, unitCost: 'Rp 120.000', totalValue: 'Rp 54.000.000' },
  ]);

  const reportRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: 'Stock_Report_NEXORA',
  });

  const handleDownloadPDF = () => {
    exportToPDF(reportRef.current, 'Stock_Report_NEXORA.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart className="w-7 h-7 text-cyan-400" />
            Comprehensive Inventory Stock Report
          </h1>
          <p className="text-sm text-slate-400 mt-1">Detailed stock valuation, movement audit balance, and ending inventory ledger</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownloadPDF} className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition">
            <FileText className="w-4 h-4" /> Save as PDF
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
            <Download className="w-4 h-4" /> Export Excel (.xlsx)
          </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl p-4">
        <div className="text-center mb-4 hidden print:block">
            <h2 className="text-2xl font-bold text-slate-800">NEXORA WMS & ERP</h2>
            <h3 className="text-lg font-semibold text-slate-600">Comprehensive Inventory Stock Report</h3>
            <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 print:text-slate-800">
            <thead className="bg-[#090f1d] text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 print:bg-slate-100 print:text-slate-600">
              <tr>
                <th className="px-6 py-4">SKU / Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Initial Stock</th>
                <th className="px-6 py-4 text-emerald-400 print:text-emerald-700">Total Inbound</th>
                <th className="px-6 py-4 text-cyan-400 print:text-blue-700">Total Outbound</th>
                <th className="px-6 py-4">Ending Stock</th>
                <th className="px-6 py-4">Unit Cost</th>
                <th className="px-6 py-4">Total Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs print:divide-slate-200">
              {reportData.map((row) => (
                <tr key={row.sku} className="hover:bg-slate-800/40 transition print:hover:bg-transparent">
                  <td className="px-6 py-4">
                    <span className="font-bold text-cyan-400 print:text-blue-700 block">{row.sku}</span>
                    <span className="font-sans text-white print:text-slate-900 text-sm block mt-0.5">{row.name}</span>
                  </td>
                  <td className="px-6 py-4 font-sans text-slate-300 print:text-slate-700">{row.category}</td>
                  <td className="px-6 py-4 text-slate-400 print:text-slate-600">{row.initialStock}</td>
                  <td className="px-6 py-4 text-emerald-400 print:text-emerald-700">+{row.inbound}</td>
                  <td className="px-6 py-4 text-cyan-400 print:text-blue-700">-{row.outbound}</td>
                  <td className="px-6 py-4 font-bold text-white print:text-slate-900 text-sm">{row.currentStock}</td>
                  <td className="px-6 py-4 text-slate-300 print:text-slate-700">{row.unitCost}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400 print:text-emerald-700 text-sm">{row.totalValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockReport;
