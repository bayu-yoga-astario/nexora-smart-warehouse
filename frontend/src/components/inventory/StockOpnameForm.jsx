import React, { useState } from 'react';
import { Button } from '../common/Button';

export const StockOpnameForm = ({ onSubmit, onCancel }) => {
  const [sku, setSku] = useState('');
  const [systemStock, setSystemStock] = useState(15);
  const [physicalCount, setPhysicalCount] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const variance = Number(physicalCount) - systemStock;
    onSubmit({ sku, systemStock, physicalCount: Number(physicalCount), variance, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-300 font-semibold mb-1">Product SKU</label>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="e.g. SKU-ELE-001"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-400"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">System Stock</label>
          <input
            type="number"
            value={systemStock}
            disabled
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Physical Counted</label>
          <input
            type="number"
            value={physicalCount}
            onChange={(e) => setPhysicalCount(e.target.value)}
            placeholder="Enter physical count"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-1">Audit Notes / Reason</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes on discrepancy..."
          rows="3"
          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-400"
        ></textarea>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Submit Opname Audit</Button>
      </div>
    </form>
  );
};
