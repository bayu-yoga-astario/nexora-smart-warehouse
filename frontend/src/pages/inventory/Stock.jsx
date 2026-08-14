import React, { useState, useEffect } from 'react';
import {
  PackageCheck, Search, Filter, SlidersHorizontal, ArrowRightLeft,
  CheckCircle2, AlertTriangle, Building2, MapPin, Eye, Plus, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { storageService } from '../../services/storageService';

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [whFilter, setWhFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Adjust form
  const [adjustData, setAdjustData] = useState({
    type: 'ADD', // 'ADD' or 'SUBTRACT'
    qty: 1,
    reason: 'Koreksi manual stok barang',
    notes: ''
  });

  // Transfer form
  const [transferData, setTransferData] = useState({
    targetWarehouse: '',
    targetLocation: '',
    qty: 1,
    notes: ''
  });

  const loadData = () => {
    setProducts(storageService.get('products'));
    const whs = storageService.get('warehouses');
    setWarehouses(whs);
    setLocations(storageService.get('locations'));
    if (whs.length > 0 && !transferData.targetWarehouse) {
      setTransferData(prev => ({ ...prev, targetWarehouse: whs[0].name }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setAdjustData({
      type: 'ADD',
      qty: 5,
      reason: 'Penerimaan tambahan / koreksi fisik',
      notes: ''
    });
    setIsAdjustOpen(true);
  };

  const handleOpenTransfer = (prod) => {
    setSelectedProduct(prod);
    setTransferData({
      targetWarehouse: warehouses.find(w => w.name !== prod.warehouse)?.name || warehouses[0]?.name || '',
      targetLocation: 'Zone A - Shelf S-01',
      qty: Math.min(5, prod.stock),
      notes: 'Transfer penyeimbangan stok antar gudang'
    });
    setIsTransferOpen(true);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = Number(adjustData.qty);
    if (qty <= 0) return;

    let newStock = selectedProduct.stock;
    if (adjustData.type === 'ADD') {
      newStock += qty;
    } else {
      if (newStock < qty) {
        showToast('Kuantitas pengurangan melebihi stok yang tersedia!', true);
        return;
      }
      newStock -= qty;
    }

    const calculatedStatus = newStock <= selectedProduct.min_stock ? 'Low Stock' : 'Normal';

    // Update product stock
    storageService.update('products', selectedProduct.id, {
      stock: newStock,
      status: calculatedStatus
    });

    // Record Stock Movement log
    storageService.create('stockMovements', {
      ref_no: `ADJ-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sku: selectedProduct.sku,
      product_name: selectedProduct.name,
      type: adjustData.type === 'ADD' ? 'INBOUND' : 'OUTBOUND',
      qty: adjustData.type === 'ADD' ? qty : -qty,
      warehouse: selectedProduct.warehouse || 'Jakarta Central DC',
      notes: `${adjustData.reason} - ${adjustData.notes || ''}`,
      operator: 'Administrator'
    });

    showToast(`Stok ${selectedProduct.name} berhasil disesuaikan menjadi ${newStock} ${selectedProduct.unit}.`);
    loadData();
    setIsAdjustOpen(false);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = Number(transferData.qty);
    if (qty <= 0 || qty > selectedProduct.stock) {
      showToast('Kuantitas transfer tidak valid!', true);
      return;
    }

    // Record Stock Movement log for transfer
    storageService.create('stockMovements', {
      ref_no: `TRF-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sku: selectedProduct.sku,
      product_name: selectedProduct.name,
      type: 'TRANSFER',
      qty: qty,
      warehouse: `${selectedProduct.warehouse} ➔ ${transferData.targetWarehouse}`,
      notes: transferData.notes || 'Inter-warehouse transfer',
      operator: 'Administrator'
    });

    showToast(`Transfer ${qty} ${selectedProduct.unit} ${selectedProduct.name} ke ${transferData.targetWarehouse} berhasil dijadwalkan.`);
    loadData();
    setIsTransferOpen(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchWh = whFilter === 'ALL' || p.warehouse === whFilter;
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchWh && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <PackageCheck className="w-7 h-7 text-cyan-400" />
            Tingkat Stok & Inventaris Real-Time
          </h1>
          <p className="text-xs text-slate-400 mt-1">Monitoring posisi stok fisik per gudang, batas aman Reorder Point, dan aksi penyesuaian instan</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari SKU atau nama produk di inventaris..."
            className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={whFilter}
            onChange={(e) => setWhFilter(e.target.value)}
            className="px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
          >
            <option value="ALL">Semua Lokasi Gudang</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
          >
            <option value="ALL">Semua Status</option>
            <option value="Normal">Normal</option>
            <option value="Low Stock">Low Stock (Menipis)</option>
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">SKU / Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Gudang Utama</th>
                <th className="px-4 py-3.5 text-right">Stok Fisik</th>
                <th className="px-4 py-3.5 text-right">Min Stok (ROP)</th>
                <th className="px-4 py-3.5 text-right">Nilai Total Aset</th>
                <th className="px-4 py-3.5">Kondisi Status</th>
                <th className="px-4 py-3.5 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data stok yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{p.sku}</span>
                      <span className="font-semibold text-slate-100 block">{p.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.warehouse || 'Jakarta Central DC'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-black text-sm text-white">
                      {p.stock} <span className="text-[10px] text-slate-400 font-normal">{p.unit}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                      {p.min_stock} {p.unit}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-400">
                      {formatCurrency((p.stock || 0) * (p.unit_cost || 0))}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenAdjust(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition text-[11px] font-semibold"
                          title="Sesuaikan Stok"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>Adjust</span>
                        </button>
                        <button
                          onClick={() => handleOpenTransfer(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition text-[11px] font-semibold"
                          title="Transfer Antar Gudang"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Transfer</span>
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

      {/* Adjust Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isAdjustOpen}
          onClose={() => setIsAdjustOpen(false)}
          title={`Penyesuaian Cepat Stok: ${selectedProduct.name} (${selectedProduct.sku})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#090f1d] border border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Stok Fisik Saat Ini:</span>
                <span className="text-base font-black text-white font-mono">{selectedProduct.stock} {selectedProduct.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Gudang Penyimpanan:</span>
                <span className="font-semibold text-slate-200">{selectedProduct.warehouse || 'Jakarta Central DC'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Arah Penyesuaian</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustData({ ...adjustData, type: 'ADD' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    adjustData.type === 'ADD'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                      : 'bg-[#090f1d]/80 text-slate-400 border-white/[0.06] hover:bg-slate-800'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <span>Tambah (+) Stok</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustData({ ...adjustData, type: 'SUBTRACT' })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    adjustData.type === 'SUBTRACT'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-950/40'
                      : 'bg-[#090f1d]/80 text-slate-400 border-white/[0.06] hover:bg-slate-800'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4 text-rose-400" />
                  <span>Kurangi (-) Stok</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kuantitas Penyesuaian *</label>
              <input
                type="number"
                min="1"
                required
                value={adjustData.qty}
                onChange={(e) => setAdjustData({ ...adjustData, qty: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alasan Penyesuaian</label>
              <select
                value={adjustData.reason}
                onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Koreksi fisik stock opname">Koreksi fisik stock opname</option>
                <option value="Barang rusak / expired">Barang rusak / expired</option>
                <option value="Pengembalian retur dari customer">Pengembalian retur dari customer</option>
                <option value="Penyesuaian sampel pengujian">Penyesuaian sampel pengujian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Tambahan</label>
              <input
                type="text"
                placeholder="No. Berita Acara / Referensi"
                value={adjustData.notes}
                onChange={(e) => setAdjustData({ ...adjustData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsAdjustOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary">Terapkan Perubahan</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Transfer Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          title={`Transfer Stok Antar Gudang: ${selectedProduct.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#090f1d] border border-white/[0.06] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Gudang Asal:</span>
                <span className="font-semibold text-white">{selectedProduct.warehouse || 'Jakarta Central DC'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tersedia untuk Transfer:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedProduct.stock} {selectedProduct.unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gudang Tujuan *</label>
              <select
                value={transferData.targetWarehouse}
                onChange={(e) => setTransferData({ ...transferData, targetWarehouse: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {warehouses.filter(w => w.name !== selectedProduct.warehouse).map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kuantitas Transfer ({selectedProduct.unit}) *</label>
              <input
                type="number"
                min="1"
                max={selectedProduct.stock}
                required
                value={transferData.qty}
                onChange={(e) => setTransferData({ ...transferData, qty: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Pengiriman Transfer</label>
              <textarea
                rows={2}
                value={transferData.notes}
                onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                placeholder="Instruksi penanganan / kurir armada..."
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsTransferOpen(false)}>Batal</Button>
              <Button type="submit" variant="primary">Proses Transfer</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Stock;
