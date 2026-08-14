import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet, Plus, Edit2, Trash2, Search, CheckCircle2,
  Clock, XCircle, Check, Eye, AlertTriangle, Building2, ShoppingCart
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { storageService } from '../../services/storageService';

const PurchaseRequest = () => {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    pr_no: '',
    department: 'Warehouse Jakarta',
    requested_by: 'Bambang Tri',
    total_estimated: 5000000,
    priority: 'Normal',
    status: 'Pending',
    notes: 'Restock rutin barang menipis'
  });

  const loadData = () => {
    setRequests(storageService.get('purchaseRequests'));
    setProducts(storageService.get('products'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedPR(null);
    setFormData({
      pr_no: `PR-${Date.now().toString().slice(-6)}`,
      department: 'Warehouse Jakarta Central DC',
      requested_by: 'Bambang Tri',
      total_estimated: 12500000,
      priority: 'High',
      status: 'Pending',
      notes: 'Pengadaan komponen restock bulanan'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pr) => {
    setSelectedPR(pr);
    setFormData({ ...pr });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (pr) => {
    setSelectedPR(pr);
    setIsDetailOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      total_estimated: Number(formData.total_estimated)
    };

    if (selectedPR) {
      storageService.update('purchaseRequests', selectedPR.id, payload);
      showToast(`Permintaan ${payload.pr_no} berhasil diperbarui.`);
    } else {
      storageService.create('purchaseRequests', payload);
      showToast(`Purchase Request ${payload.pr_no} berhasil diajukan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleApprove = (pr) => {
    storageService.update('purchaseRequests', pr.id, { status: 'Approved' });
    showToast(`Purchase Request ${pr.pr_no} telah disetujui.`);
    loadData();
  };

  const handleReject = (pr) => {
    storageService.update('purchaseRequests', pr.id, { status: 'Rejected' });
    showToast(`Purchase Request ${pr.pr_no} ditolak.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedPR) {
      storageService.delete('purchaseRequests', selectedPR.id);
      showToast(`Purchase Request ${selectedPR.pr_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = requests.filter(r => {
    const matchSearch = r.pr_no?.toLowerCase().includes(search.toLowerCase()) ||
      r.requested_by?.toLowerCase().includes(search.toLowerCase()) ||
      r.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
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
            <FileSpreadsheet className="w-7 h-7 text-cyan-400" />
            Permintaan Pembelian (Purchase Request / PR)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Pengajuan kebutuhan pengadaan material, suku cadang, dan restock inventaris gudang</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Buat Purchase Request
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. PR, Pemohon, atau Departemen..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Status PR</option>
          <option value="Pending">Pending Approval</option>
          <option value="Approved">Approved (Disetujui)</option>
          <option value="Rejected">Rejected (Ditolak)</option>
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. PR / Tanggal</th>
                <th className="px-4 py-3.5">Nama Pemohon</th>
                <th className="px-4 py-3.5">Departemen</th>
                <th className="px-4 py-3.5 text-center">Prioritas</th>
                <th className="px-4 py-3.5 text-right">Est. Total Biaya</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi & Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada dokumen Purchase Request yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{pr.pr_no}</span>
                      <span className="text-[11px] text-slate-500">{pr.date}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-200">{pr.requested_by}</td>
                    <td className="px-4 py-3.5 text-slate-300">{pr.department}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        pr.priority === 'High'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {pr.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(pr.total_estimated || 0)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={pr.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {pr.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(pr)}
                              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition"
                              title="Setujui PR"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReject(pr)}
                              className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 transition"
                              title="Tolak PR"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenDetail(pr)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(pr)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedPR(pr); setIsDeleteOpen(true); }}
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
        title={selectedPR ? `Edit Purchase Request: ${selectedPR.pr_no}` : 'Buat Purchase Request Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. PR *</label>
              <input
                type="text"
                required
                value={formData.pr_no}
                onChange={(e) => setFormData({ ...formData, pr_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tingkat Prioritas</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-semibold"
              >
                <option value="Normal">Normal (Standar)</option>
                <option value="High">High (Mendesak / Urgent)</option>
                <option value="Low">Low (Bisa Ditunda)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Pemohon *</label>
              <input
                type="text"
                required
                value={formData.requested_by}
                onChange={(e) => setFormData({ ...formData, requested_by: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Departemen Pemohon</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estimasi Total Biaya (Rp) *</label>
            <input
              type="number"
              min="0"
              required
              value={formData.total_estimated}
              onChange={(e) => setFormData({ ...formData, total_estimated: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan / Justifikasi Kebutuhan</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Purchase Request</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedPR && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Rincian Dokumen: ${selectedPR.pr_no}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#090f1d] border border-white/[0.05]">
              <div>
                <span className="text-slate-500 block">No. PR:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedPR.pr_no}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Pengajuan:</span>
                <span className="font-semibold text-slate-200">{selectedPR.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Pemohon:</span>
                <span className="font-semibold text-slate-200">{selectedPR.requested_by}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Departemen:</span>
                <span className="font-semibold text-slate-200">{selectedPR.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Prioritas:</span>
                <span className="font-bold text-amber-400">{selectedPR.priority || 'Normal'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Est. Anggaran:</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(selectedPR.total_estimated || 0)}</span>
              </div>
            </div>

            {selectedPR.notes && (
              <div className="p-3 rounded-xl bg-[#090f1d]/60 border border-white/[0.05]">
                <span className="text-slate-500 block mb-1">Justifikasi Kebutuhan:</span>
                <p className="text-slate-300">{selectedPR.notes}</p>
              </div>
            )}

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
        title="Hapus Purchase Request"
        message={`Apakah Anda yakin ingin menghapus dokumen PR "${selectedPR?.pr_no}"?`}
        confirmText="Hapus PR"
      />
    </div>
  );
};

export default PurchaseRequest;
