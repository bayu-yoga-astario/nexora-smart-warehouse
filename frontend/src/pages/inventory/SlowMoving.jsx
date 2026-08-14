import React, { useState, useEffect } from 'react';
import {
  AlertOctagon, Flame, Clock, Tag, Trash2, ArrowRight,
  CheckCircle2, Search, Filter, Sparkles, DollarSign, Package
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatCurrency';
import { storageService } from '../../services/storageService';

const SlowMoving = () => {
  const [slowList, setSlowList] = useState([
    { id: 1, sku: 'SKU-RAW-009', name: 'Aluminium Sheet Grade A (Thick 10mm)', daysIdle: 145, currentQty: 45, unit_cost: 120000, lockedCapital: 54000000, riskLevel: 'High Risk (120+ Days)', recommendedAction: 'Bundling Discount 25%' },
    { id: 2, sku: 'SKU-PKG-004', name: 'Heavy Duty Steel Strapping 19mm', daysIdle: 98, currentQty: 120, unit_cost: 120000, lockedCapital: 14400000, riskLevel: 'Medium Risk (90+ Days)', recommendedAction: 'Flash Clearance Promo' },
    { id: 3, sku: 'SKU-ELE-008', name: 'Legacy Micro USB Connector Pack', daysIdle: 210, currentQty: 300, unit_cost: 15000, lockedCapital: 4500000, riskLevel: 'Dead Stock (180+ Days)', recommendedAction: 'Scrap / Write-off Liquidation' }
  ]);

  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState('DISCOUNT'); // DISCOUNT, WRITE_OFF, BUNDLE
  const [discountPercent, setDiscountPercent] = useState(20);
  const [notes, setNotes] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAction = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    setDiscountPercent(type === 'DISCOUNT' ? 25 : type === 'BUNDLE' ? 15 : 0);
    setNotes(`Eksekusi aksi ${type} untuk penanganan slow moving ${item.sku}`);
    setIsActionOpen(true);
  };

  const handleExecuteAction = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (actionType === 'WRITE_OFF') {
      // Record movement as adjustment
      storageService.create('stockMovements', {
        ref_no: `WO-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sku: selectedItem.sku,
        product_name: selectedItem.name,
        type: 'OUTBOUND',
        qty: -selectedItem.currentQty,
        warehouse: 'Jakarta Central DC',
        notes: `Write-Off Dead Stock: ${notes}`,
        operator: 'Administrator'
      });

      setSlowList(prev => prev.filter(i => i.id !== selectedItem.id));
      showToast(`Barang dead stock ${selectedItem.sku} berhasil di-Write Off / Dikeluarkan dari gudang.`);
    } else {
      showToast(`Program ${actionType === 'DISCOUNT' ? 'Diskon Likuidasi' : 'Bundling Promosi'} untuk ${selectedItem.sku} berhasil diaktifkan.`);
    }

    setIsActionOpen(false);
  };

  const filtered = slowList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold shadow-2xl backdrop-blur-xl animate-scale-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-7 h-7 text-amber-400" />
            Analisis Stok Mengendap (Slow-Moving & Dead Stock)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Identifikasi barang mengendap tanpa perputaran, modal kerja tertahan (*locked capital*), dan eksekusi program likuidasi</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari SKU atau nama barang slow moving..."
          className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all shadow-inner"
        />
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">SKU & Nama Produk</th>
                <th className="px-4 py-3.5">Lama Mengendap</th>
                <th className="px-4 py-3.5 text-right">Stok Tertahan</th>
                <th className="px-4 py-3.5 text-right">Modal Kerja Tertahan</th>
                <th className="px-4 py-3.5">Tingkat Risiko</th>
                <th className="px-4 py-3.5">Rekomendasi Aksi</th>
                <th className="px-4 py-3.5 text-center">Eksekusi Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada produk dalam kategori slow-moving saat ini.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-cyan-400 font-bold block">{item.sku}</span>
                      <span className="font-semibold text-white block mt-0.5">{item.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        {item.daysIdle} Hari
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                      {item.currentQty} Pcs
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-400">
                      {formatCurrency(item.lockedCapital)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.daysIdle >= 180
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 font-medium">
                      {item.recommendedAction}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenAction(item, 'DISCOUNT')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition text-[10px] font-bold"
                          title="Diskon Obral"
                        >
                          <Tag className="w-3 h-3" />
                          <span>Diskon</span>
                        </button>
                        <button
                          onClick={() => handleOpenAction(item, 'WRITE_OFF')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition text-[10px] font-bold"
                          title="Penghapusan / Write Off"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Write Off</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      {selectedItem && (
        <Modal
          isOpen={isActionOpen}
          onClose={() => setIsActionOpen(false)}
          title={`Eksekusi Penanganan Stok: ${selectedItem.sku}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleExecuteAction} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#090f1d] border border-white/[0.06] text-xs space-y-1">
              <p className="font-bold text-white">{selectedItem.name}</p>
              <div className="flex justify-between text-slate-400">
                <span>Stok Fisik:</span>
                <span className="font-mono text-white">{selectedItem.currentQty} Pcs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Modal Kerja Tertahan:</span>
                <span className="font-mono text-rose-400 font-bold">{formatCurrency(selectedItem.lockedCapital)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pilihan Tindakan</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-semibold"
              >
                <option value="DISCOUNT">Program Diskon Cuci Gudang (Clearance Sale)</option>
                <option value="BUNDLE">Bundling Paket Promosi Produk Cepat Laku</option>
                <option value="WRITE_OFF">Write-Off (Penghapusan Aset / Scrap Rusak)</option>
              </select>
            </div>

            {actionType !== 'WRITE_OFF' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Besaran Potongan Harga (%)</label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Memo Otorisasi</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsActionOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary">Eksekusi Program</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SlowMoving;
