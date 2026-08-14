import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Plus, Edit2, Trash2, Search, CheckCircle2,
  Clock, Truck, Eye, FileText, Check, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { storageService } from '../../services/storageService';

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    po_no: '',
    pr_no: 'Direct PO',
    supplier: '',
    total_amount: 15000000,
    payment_terms: 'NET 30',
    delivery_due: '2026-08-25',
    status: 'Issued',
    notes: 'Order resmi pengadaan material'
  });

  const loadData = () => {
    setOrders(storageService.get('purchaseOrders'));
    const sups = storageService.get('suppliers');
    setSuppliers(sups);
    const prs = storageService.get('purchaseRequests');
    setPurchaseRequests(prs);

    if (sups.length > 0 && !formData.supplier) {
      setFormData(prev => ({ ...prev, supplier: sups[0].name }));
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
    setSelectedPO(null);
    setFormData({
      po_no: `PO-${Date.now().toString().slice(-6)}`,
      pr_no: purchaseRequests[0]?.pr_no || 'Direct PO',
      supplier: suppliers[0]?.name || 'PT Global Komponen Nusantara',
      total_amount: 14500000,
      payment_terms: 'NET 30',
      delivery_due: '2026-08-25',
      status: 'Issued',
      notes: 'Penerbitan PO pengadaan baru'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (po) => {
    setSelectedPO(po);
    setFormData({ ...po });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (po) => {
    setSelectedPO(po);
    setIsDetailOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      total_amount: Number(formData.total_amount)
    };

    if (selectedPO) {
      storageService.update('purchaseOrders', selectedPO.id, payload);
      showToast(`Purchase Order ${payload.po_no} berhasil diperbarui.`);
    } else {
      storageService.create('purchaseOrders', payload);
      showToast(`Purchase Order ${payload.po_no} berhasil diterbitkan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleStatusChange = (po, newStatus) => {
    storageService.update('purchaseOrders', po.id, { status: newStatus });
    showToast(`Status PO ${po.po_no} diubah menjadi "${newStatus}".`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedPO) {
      storageService.delete('purchaseOrders', selectedPO.id);
      showToast(`Purchase Order ${selectedPO.po_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = orders.filter(po => {
    const matchSearch = po.po_no?.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier?.toLowerCase().includes(search.toLowerCase()) ||
      po.pr_no?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || po.status === statusFilter;
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
            <ShoppingCart className="w-7 h-7 text-cyan-400" />
            Pesanan Pembelian (Purchase Orders / PO)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Penerbitan kontrak pengadaan vendor, pelacakan pengiriman barang, dan termin pembayaran</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Terbitkan PO Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. PO, Supplier, atau No. PR..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Status PO</option>
          <option value="Issued">Issued (Diterbitkan)</option>
          <option value="In Transit">In Transit (Dalam Pengiriman)</option>
          <option value="Completed">Completed (Selesai Diterima)</option>
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. PO / Tanggal</th>
                <th className="px-4 py-3.5">Vendor / Supplier</th>
                <th className="px-4 py-3.5">Ref. PR</th>
                <th className="px-4 py-3.5 text-right">Total Nilai PO</th>
                <th className="px-4 py-3.5">Tenggat Kirim</th>
                <th className="px-4 py-3.5">Termin Bayar</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada dokumen Purchase Order yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{po.po_no}</span>
                      <span className="text-[11px] text-slate-500">{po.date}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-100">{po.supplier}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{po.pr_no || 'Direct'}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(po.total_amount || 0)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{po.delivery_due}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {po.payment_terms || 'NET 30'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={po.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {po.status === 'Issued' && (
                          <button
                            onClick={() => handleStatusChange(po, 'In Transit')}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[10px] font-semibold border border-cyan-500/20"
                            title="Tandai Dikirim"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Transit</span>
                          </button>
                        )}
                        {po.status === 'In Transit' && (
                          <button
                            onClick={() => handleStatusChange(po, 'Completed')}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-semibold border border-emerald-500/20"
                            title="Selesaikan PO"
                          >
                            <Check className="w-3 h-3" />
                            <span>Selesai</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(po)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(po)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedPO(po); setIsDeleteOpen(true); }}
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
        title={selectedPO ? `Edit Purchase Order: ${selectedPO.po_no}` : 'Terbitkan Purchase Order (PO) Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. PO *</label>
              <input
                type="text"
                required
                value={formData.po_no}
                onChange={(e) => setFormData({ ...formData, po_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Referensi PR</label>
              <select
                value={formData.pr_no}
                onChange={(e) => setFormData({ ...formData, pr_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              >
                <option value="Direct PO">Direct PO (Tanpa PR)</option>
                {purchaseRequests.map(pr => (
                  <option key={pr.id} value={pr.pr_no}>{pr.pr_no} - {pr.department}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vendor / Rekanan Supplier *</label>
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Nilai Tagihan PO (Rp) *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Termin Pembayaran</label>
              <select
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="NET 14">NET 14 Hari</option>
                <option value="NET 30">NET 30 Hari</option>
                <option value="NET 60">NET 60 Hari</option>
                <option value="Cash On Delivery (COD)">Cash On Delivery (COD)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tenggat Pengiriman (Due Date)</label>
              <input
                type="date"
                value={formData.delivery_due}
                onChange={(e) => setFormData({ ...formData, delivery_due: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status PO</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Issued">Issued (Diterbitkan)</option>
                <option value="In Transit">In Transit (Proses Kirim)</option>
                <option value="Completed">Completed (Selesai)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Purchase Order</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedPO && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Detail Dokumen PO: ${selectedPO.po_no}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#090f1d] border border-white/[0.05]">
              <div>
                <span className="text-slate-500 block">No. Purchase Order:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedPO.po_no}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ref. Purchase Request:</span>
                <span className="font-mono text-slate-200">{selectedPO.pr_no || 'Direct'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Vendor Rekanan:</span>
                <span className="font-semibold text-slate-200">{selectedPO.supplier}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status Dokumen:</span>
                <span className="font-bold text-amber-400">{selectedPO.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tenggat Waktu:</span>
                <span className="text-slate-200">{selectedPO.delivery_due}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Tagihan:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{formatCurrency(selectedPO.total_amount || 0)}</span>
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
        title="Hapus Purchase Order"
        message={`Apakah Anda yakin ingin menghapus PO "${selectedPO?.po_no}"?`}
        confirmText="Hapus PO"
      />
    </div>
  );
};

export default PurchaseOrder;
