import React, { useState, useEffect } from 'react';
import {
  Sliders, Plus, Edit2, Trash2, Search, CheckCircle2,
  AlertTriangle, Check, X, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';

const StockAdjustment = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdj, setSelectedAdj] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    adj_no: '',
    productId: '',
    sku: '',
    product_name: '',
    warehouse: 'Jakarta Central DC',
    type: 'REDUCE', // 'INCREASE' or 'REDUCE'
    qty: 2,
    reason: 'Damaged / Rusak fisik saat handling',
    status: 'Pending',
    requested_by: 'Inventory Staff',
    approved_by: '-'
  });

  const loadData = () => {
    setAdjustments(storageService.get('stockAdjustments'));
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
    setSelectedAdj(null);
    const defaultProd = products[0] || { id: 1, sku: 'SKU-001', name: 'Barang' };
    setFormData({
      adj_no: `ADJ-${Date.now().toString().slice(-6)}`,
      productId: defaultProd.id,
      sku: defaultProd.sku,
      product_name: defaultProd.name,
      warehouse: warehouses[0]?.name || 'Jakarta Central DC',
      type: 'REDUCE',
      qty: 2,
      reason: 'Damaged / Rusak fisik saat handling',
      status: 'Pending',
      requested_by: 'Inventory Staff',
      approved_by: '-'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (adj) => {
    setSelectedAdj(adj);
    setFormData({ ...adj });
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
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      qty: Number(formData.qty)
    };

    if (selectedAdj) {
      storageService.update('stockAdjustments', selectedAdj.id, payload);
      showToast(`Penyesuaian ${payload.adj_no} berhasil diperbarui.`);
    } else {
      storageService.create('stockAdjustments', payload);
      showToast(`Pengajuan penyesuaian ${payload.adj_no} berhasil dibuat.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleApprove = (adj) => {
    const targetProd = products.find(p => p.sku === adj.sku);
    const delta = adj.type === 'INCREASE' ? adj.qty : -adj.qty;

    if (targetProd) {
      const updatedStock = Math.max(0, targetProd.stock + delta);
      storageService.update('products', targetProd.id, {
        stock: updatedStock,
        status: updatedStock <= targetProd.min_stock ? 'Low Stock' : 'Normal'
      });

      storageService.create('stockMovements', {
        ref_no: `MOV-${adj.adj_no}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sku: adj.sku,
        product_name: adj.product_name,
        type: 'ADJUSTMENT',
        qty: delta,
        warehouse: adj.warehouse,
        notes: `Persetujuan Adjustment: ${adj.reason}`,
        operator: 'Administrator'
      });
    }

    storageService.update('stockAdjustments', adj.id, {
      status: 'Approved',
      approved_by: 'Administrator NEXORA'
    });

    showToast(`Pengajuan ${adj.adj_no} berhasil disetujui & stok otomatis disesuaikan.`);
    loadData();
  };

  const handleReject = (adj) => {
    storageService.update('stockAdjustments', adj.id, {
      status: 'Rejected',
      approved_by: 'Administrator (Ditolak)'
    });
    showToast(`Pengajuan ${adj.adj_no} ditolak.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedAdj) {
      storageService.delete('stockAdjustments', selectedAdj.id);
      showToast(`Catatan penyesuaian ${selectedAdj.adj_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = adjustments.filter(a => {
    const matchSearch = a.adj_no?.toLowerCase().includes(search.toLowerCase()) ||
      a.sku?.toLowerCase().includes(search.toLowerCase()) ||
      a.product_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold shadow-2xl backdrop-blur-xl animate-scale-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-7 h-7 text-cyan-400" />
            Penyesuaian Stok (Stock Adjustment)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Otorisasi koreksi kuantitas barang rusak, kadaluarsa, hilang, atau kelebihan audit</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Buat Pengajuan Penyesuaian
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. Penyesuaian, SKU, atau Nama Barang..."
            className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all shadow-inner"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Status Otorisasi</option>
          <option value="Pending">Pending (Menunggu Otorisasi)</option>
          <option value="Approved">Approved (Disetujui)</option>
          <option value="Rejected">Rejected (Ditolak)</option>
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. Adjustment / Tgl</th>
                <th className="px-4 py-3.5">SKU & Nama Barang</th>
                <th className="px-4 py-3.5">Gudang</th>
                <th className="px-4 py-3.5 text-center">Tipe & Qty</th>
                <th className="px-4 py-3.5">Alasan / Memo</th>
                <th className="px-4 py-3.5">Pemohon / Approver</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data penyesuaian stok yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{a.adj_no}</span>
                      <span className="text-[11px] text-slate-500">{a.date}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-slate-400 text-[11px] block">{a.sku}</span>
                      <span className="font-semibold text-slate-100 block">{a.product_name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{a.warehouse}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                        a.type === 'INCREASE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {a.type === 'INCREASE' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {a.type === 'INCREASE' ? `+${a.qty}` : `-${a.qty}`} Pcs
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">{a.reason}</td>
                    <td className="px-4 py-3.5 text-slate-300">
                      <span className="block font-medium">{a.requested_by}</span>
                      <span className="text-[10px] text-slate-500">Appr: {a.approved_by || '-'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {a.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(a)}
                              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition"
                              title="Setujui (Approve)"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReject(a)}
                              className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 transition"
                              title="Tolak (Reject)"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedAdj(a); setIsDeleteOpen(true); }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAdj ? `Edit Penyesuaian: ${selectedAdj.adj_no}` : 'Buat Pengajuan Penyesuaian Stok'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Adjustment *</label>
              <input
                type="text"
                required
                value={formData.adj_no}
                onChange={(e) => setFormData({ ...formData, adj_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Penyesuaian</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-bold"
              >
                <option value="REDUCE">REDUCE / Kurangi Stok (-)</option>
                <option value="INCREASE">INCREASE / Tambah Stok (+)</option>
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
                <option key={p.id} value={p.id}>[{p.sku}] {p.name} (Tersedia: {p.stock} {p.unit})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kuantitas Penyesuaian *</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gudang Lokasi</label>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Alasan Penyesuaian *</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            >
              <option value="Damaged / Rusak fisik saat handling">Damaged / Rusak fisik saat handling</option>
              <option value="Expired / Melewati batas masa simpan">Expired / Melewati batas masa simpan</option>
              <option value="Found / Kelebihan hitung fisik opname">Found / Kelebihan hitung fisik opname</option>
              <option value="Lost / Selisih tidak ditemukan">Lost / Selisih tidak ditemukan</option>
              <option value="Sample / Penggunaan sampel R&D & QA">Sample / Penggunaan sampel R&D & QA</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Penyesuaian</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Penyesuaian"
        message={`Apakah Anda yakin ingin menghapus catatan penyesuaian "${selectedAdj?.adj_no}"?`}
        confirmText="Hapus"
      />
    </div>
  );
};

export default StockAdjustment;
