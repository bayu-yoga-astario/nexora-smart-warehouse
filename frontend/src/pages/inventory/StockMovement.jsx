import React, { useState, useEffect } from 'react';
import {
  History, Plus, Search, Filter, Trash2, CheckCircle2,
  ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Sliders, Calendar
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';

const StockMovement = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    ref_no: '',
    productId: '',
    sku: '',
    product_name: '',
    type: 'INBOUND',
    qty: 10,
    warehouse: 'Jakarta Central DC',
    notes: 'Penerimaan manual barang baru',
    operator: 'Administrator'
  });

  const loadData = () => {
    setMovements(storageService.get('stockMovements'));
    const prods = storageService.get('products');
    setProducts(prods);
    const whs = storageService.get('warehouses');
    setWarehouses(whs);

    if (prods.length > 0 && !formData.productId) {
      setFormData(prev => ({
        ...prev,
        productId: prods[0].id,
        sku: prods[0].sku,
        product_name: prods[0].name
      }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedMovement(null);
    const defaultProd = products[0] || { sku: 'SKU-001', name: 'Barang' };
    setFormData({
      ref_no: `MOV-${Date.now().toString().slice(-6)}`,
      productId: defaultProd.id,
      sku: defaultProd.sku,
      product_name: defaultProd.name,
      type: 'INBOUND',
      qty: 10,
      warehouse: warehouses[0]?.name || 'Jakarta Central DC',
      notes: 'Penerimaan manual barang / mutasi',
      operator: 'Administrator'
    });
    setIsModalOpen(true);
  };

  const handleProductSelect = (prodId) => {
    const prod = products.find(p => p.id === Number(prodId));
    if (prod) {
      setFormData({
        ...formData,
        productId: prod.id,
        sku: prod.sku,
        product_name: prod.name,
        warehouse: prod.warehouse || formData.warehouse
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qtyNum = Number(formData.qty);
    const effectiveQty = (formData.type === 'OUTBOUND' || (formData.type === 'ADJUSTMENT' && qtyNum < 0))
      ? -Math.abs(qtyNum)
      : Math.abs(qtyNum);

    const newMovement = {
      ref_no: formData.ref_no || `MOV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sku: formData.sku,
      product_name: formData.product_name,
      type: formData.type,
      qty: effectiveQty,
      warehouse: formData.warehouse,
      notes: formData.notes,
      operator: formData.operator || 'Administrator'
    };

    storageService.create('stockMovements', newMovement);

    // Sync product stock
    const targetProd = products.find(p => p.sku === formData.sku);
    if (targetProd) {
      const updatedStock = Math.max(0, targetProd.stock + effectiveQty);
      const updatedStatus = updatedStock <= targetProd.min_stock ? 'Low Stock' : 'Normal';
      storageService.update('products', targetProd.id, {
        stock: updatedStock,
        status: updatedStatus
      });
    }

    showToast(`Mutasi ${formData.ref_no} berhasil dicatat & stok produk disinkronkan.`);
    loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedMovement) {
      storageService.delete('stockMovements', selectedMovement.id);
      showToast(`Log mutasi "${selectedMovement.ref_no}" telah dibatalkan/dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = movements.filter(m => {
    const matchSearch = m.ref_no?.toLowerCase().includes(search.toLowerCase()) ||
      m.sku?.toLowerCase().includes(search.toLowerCase()) ||
      m.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.warehouse?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const getTypeBadge = (type, qty) => {
    switch (type) {
      case 'INBOUND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ArrowDownLeft className="w-3 h-3" />
            INBOUND (+{Math.abs(qty)})
          </span>
        );
      case 'OUTBOUND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowUpRight className="w-3 h-3" />
            OUTBOUND ({qty})
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ArrowRightLeft className="w-3 h-3" />
            TRANSFER ({qty})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sliders className="w-3 h-3" />
            ADJUST ({qty > 0 ? `+${qty}` : qty})
          </span>
        );
    }
  };

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
            <History className="w-7 h-7 text-cyan-400" />
            Riwayat & Log Mutasi Stok
          </h1>
          <p className="text-xs text-slate-400 mt-1">Audit pergerakan barang masuk (inbound), keluar (outbound), mutasi transfer, dan penyesuaian opname</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Catat Mutasi Manual
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. Referensi, SKU, Nama Barang, atau Lokasi Gudang..."
            className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all shadow-inner"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Jenis Mutasi</option>
          <option value="INBOUND">Inbound (Masuk)</option>
          <option value="OUTBOUND">Outbound (Keluar)</option>
          <option value="TRANSFER">Transfer Antar Gudang</option>
          <option value="ADJUSTMENT">Adjustment (Koreksi)</option>
        </select>
      </div>

      {/* Movement Table */}
      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. Referensi / Waktu</th>
                <th className="px-4 py-3.5">SKU & Nama Barang</th>
                <th className="px-4 py-3.5">Jenis Transaksi</th>
                <th className="px-4 py-3.5">Lokasi / Gudang</th>
                <th className="px-4 py-3.5">Keterangan / Memo</th>
                <th className="px-4 py-3.5">Operator</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada catatan mutasi stok yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{m.ref_no}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        {m.date}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-slate-400 text-[11px] block">{m.sku}</span>
                      <span className="font-semibold text-slate-100 block">{m.product_name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {getTypeBadge(m.type, m.qty)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {m.warehouse}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-400">
                      {m.notes || '-'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 font-medium">
                      {m.operator}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => { setSelectedMovement(m); setIsDeleteOpen(true); }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                        title="Hapus Entri Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Mutasi Stok Manual"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Referensi *</label>
              <input
                type="text"
                required
                value={formData.ref_no}
                onChange={(e) => setFormData({ ...formData, ref_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Mutasi *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="INBOUND">INBOUND (Barang Masuk)</option>
                <option value="OUTBOUND">OUTBOUND (Barang Keluar)</option>
                <option value="TRANSFER">TRANSFER (Pindah Gudang)</option>
                <option value="ADJUSTMENT">ADJUSTMENT (Koreksi Stok)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Produk Inventaris *</label>
            <select
              value={formData.productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.name} (Tersedia: {p.stock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kuantitas Mutasi *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gudang Penyimpanan</label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Keterangan / Alasan Mutasi</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Mutasi</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Entri Log Mutasi"
        message={`Apakah Anda yakin ingin menghapus catatan mutasi "${selectedMovement?.ref_no}"?`}
        confirmText="Hapus Log"
      />
    </div>
  );
};

export default StockMovement;
