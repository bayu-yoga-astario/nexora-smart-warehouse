import React, { useState, useEffect } from 'react';
import {
  Receipt, Plus, Edit2, Trash2, Search, CheckCircle2,
  AlertTriangle, ShieldCheck, Check, Clock, Eye
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';

const GoodsReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [qcFilter, setQcFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGR, setSelectedGR] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    gr_no: '',
    po_no: '',
    supplier: '',
    warehouse: 'Jakarta Central DC',
    received_qty: 50,
    qc_status: 'Passed',
    received_by: 'Bambang Tri',
    notes: 'Penerimaan barang lolos inspeksi fisik & kelengkapan'
  });

  const loadData = () => {
    setReceipts(storageService.get('goodsReceipts'));
    const pos = storageService.get('purchaseOrders');
    setOrders(pos);
    const sups = storageService.get('suppliers');
    setSuppliers(sups);
    const whs = storageService.get('warehouses');
    setWarehouses(whs);
    setProducts(storageService.get('products'));

    if (pos.length > 0 && !formData.po_no) {
      setFormData(prev => ({
        ...prev,
        po_no: pos[0].po_no,
        supplier: pos[0].supplier
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
    setSelectedGR(null);
    const defaultPO = orders[0] || { po_no: 'PO-2026-001', supplier: suppliers[0]?.name || 'Supplier' };
    setFormData({
      gr_no: `GR-${Date.now().toString().slice(-6)}`,
      po_no: defaultPO.po_no,
      supplier: defaultPO.supplier,
      warehouse: warehouses[0]?.name || 'Jakarta Central DC',
      received_qty: 50,
      qc_status: 'Passed',
      received_by: 'Bambang Tri',
      notes: 'Pemeriksaan barang masuk gudang'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gr) => {
    setSelectedGR(gr);
    setFormData({ ...gr });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (gr) => {
    setSelectedGR(gr);
    setIsDetailOpen(true);
  };

  const handlePOSelect = (poNo) => {
    const po = orders.find(o => o.po_no === poNo);
    if (po) {
      setFormData({
        ...formData,
        po_no: po.po_no,
        supplier: po.supplier
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      received_qty: Number(formData.received_qty)
    };

    if (selectedGR) {
      storageService.update('goodsReceipts', selectedGR.id, payload);
      showToast(`Penerimaan barang ${payload.gr_no} berhasil diperbarui.`);
    } else {
      storageService.create('goodsReceipts', payload);

      // Also record Stock Movement for receiving
      storageService.create('stockMovements', {
        ref_no: payload.gr_no,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sku: 'INBOUND-PO',
        product_name: `Penerimaan Barang (${payload.po_no})`,
        type: 'INBOUND',
        qty: payload.received_qty,
        warehouse: payload.warehouse,
        notes: `Inbound GR: ${payload.supplier} - QC ${payload.qc_status}`,
        operator: payload.received_by
      });

      showToast(`Goods Receipt ${payload.gr_no} berhasil disimpan & stok masuk tercatat.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedGR) {
      storageService.delete('goodsReceipts', selectedGR.id);
      showToast(`Dokumen Goods Receipt ${selectedGR.gr_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = receipts.filter(gr => {
    const matchSearch = gr.gr_no?.toLowerCase().includes(search.toLowerCase()) ||
      gr.po_no?.toLowerCase().includes(search.toLowerCase()) ||
      gr.supplier?.toLowerCase().includes(search.toLowerCase());
    const matchQc = qcFilter === 'ALL' || gr.qc_status === qcFilter;
    return matchSearch && matchQc;
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
            <Receipt className="w-7 h-7 text-cyan-400" />
            Penerimaan Barang (Goods Receipt / GR)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Verifikasi kedatangan barang dari vendor, inspeksi QC Quality Control, dan pencatatan stok masuk</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Catat Penerimaan Barang
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. GR, No. PO, atau Nama Vendor..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={qcFilter}
          onChange={(e) => setQcFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Status QC</option>
          <option value="Passed">Passed (Lolos Uji)</option>
          <option value="Inspecting">Inspecting (Pemeriksaan)</option>
          <option value="Rejected">Rejected (Gagal QC)</option>
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. GR / Tanggal</th>
                <th className="px-4 py-3.5">Ref. PO</th>
                <th className="px-4 py-3.5">Vendor Supplier</th>
                <th className="px-4 py-3.5">Gudang Penerima</th>
                <th className="px-4 py-3.5 text-right">Kuantitas Diterima</th>
                <th className="px-4 py-3.5">Hasil Uji QC</th>
                <th className="px-4 py-3.5">Petugas Gudang</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada dokumen Goods Receipt yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((gr) => (
                  <tr key={gr.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{gr.gr_no}</span>
                      <span className="text-[11px] text-slate-500">{gr.date}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">{gr.po_no}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-100">{gr.supplier}</td>
                    <td className="px-4 py-3.5 text-slate-300">{gr.warehouse}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white text-sm">
                      {gr.received_qty} Pcs
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        gr.qc_status === 'Passed'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : gr.qc_status === 'Inspecting'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {gr.qc_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{gr.received_by}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(gr)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(gr)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedGR(gr); setIsDeleteOpen(true); }}
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

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGR ? `Edit Goods Receipt: ${selectedGR.gr_no}` : 'Catat Goods Receipt (GR) Masuk'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Goods Receipt *</label>
              <input
                type="text"
                required
                value={formData.gr_no}
                onChange={(e) => setFormData({ ...formData, gr_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Ref. PO *</label>
              <select
                value={formData.po_no}
                onChange={(e) => handlePOSelect(e.target.value)}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              >
                {orders.map(po => (
                  <option key={po.id} value={po.po_no}>{po.po_no} - {po.supplier}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Vendor / Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gudang Penerima</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kuantitas Diterima (Pcs) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.received_qty}
                onChange={(e) => setFormData({ ...formData, received_qty: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hasil Inspeksi QC</label>
              <select
                value={formData.qc_status}
                onChange={(e) => setFormData({ ...formData, qc_status: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-bold"
              >
                <option value="Passed">Passed (Lolos Spesifikasi)</option>
                <option value="Inspecting">Inspecting (Dalam Pengujian)</option>
                <option value="Rejected">Rejected (Ditolak / Retur)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Petugas Penerima (Checker)</label>
            <input
              type="text"
              value={formData.received_by}
              onChange={(e) => setFormData({ ...formData, received_by: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Penerimaan</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedGR && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Detail Goods Receipt: ${selectedGR.gr_no}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#090f1d] border border-white/[0.05]">
              <div>
                <span className="text-slate-500 block">No. Goods Receipt:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedGR.gr_no}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ref. PO:</span>
                <span className="font-mono text-slate-200">{selectedGR.po_no}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Vendor Supplier:</span>
                <span className="font-semibold text-slate-200">{selectedGR.supplier}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Kuantitas Masuk:</span>
                <span className="font-mono font-bold text-white text-sm">{selectedGR.received_qty} Pcs</span>
              </div>
              <div>
                <span className="text-slate-500 block">Hasil QC:</span>
                <span className="font-bold text-emerald-400">{selectedGR.qc_status}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Penerima Gudang:</span>
                <span className="text-slate-200">{selectedGR.received_by}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/[0.06]">
              <Button variant="secondary" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Goods Receipt"
        message={`Apakah Anda yakin ingin menghapus data penerimaan "${selectedGR?.gr_no}"?`}
        confirmText="Hapus GR"
      />
    </div>
  );
};

export default GoodsReceipt;
