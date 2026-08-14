import React, { useState, useEffect } from 'react';
import {
  FileCheck, Plus, Edit2, Trash2, Search, CheckCircle2,
  Clock, XCircle, Check, Eye, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';

const MaterialRequest = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMR, setSelectedMR] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    mr_no: '',
    requester: 'Divisi Assembly Line 2',
    project: 'Batch Produksi Terminal Box',
    priority: 'High',
    items_count: 3,
    status: 'Pending',
    notes: 'Pengambilan material untuk lini perakitan'
  });

  const loadData = () => {
    setRequests(storageService.get('materialRequests'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedMR(null);
    setFormData({
      mr_no: `MR-${Date.now().toString().slice(-6)}`,
      requester: 'Divisi Assembly Line 1',
      project: 'Produksi Modul Sensor IoT',
      priority: 'High',
      items_count: 4,
      status: 'Pending',
      notes: 'Permintaan material komponen elektronika'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mr) => {
    setSelectedMR(mr);
    setFormData({ ...mr });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (mr) => {
    setSelectedMR(mr);
    setIsDetailOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      items_count: Number(formData.items_count)
    };

    if (selectedMR) {
      storageService.update('materialRequests', selectedMR.id, payload);
      showToast(`Permintaan material ${payload.mr_no} berhasil diperbarui.`);
    } else {
      storageService.create('materialRequests', payload);
      showToast(`Material Request ${payload.mr_no} berhasil diajukan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleApprove = (mr) => {
    storageService.update('materialRequests', mr.id, { status: 'Approved' });
    showToast(`Material Request ${mr.mr_no} disetujui & siap masuk alur Picking.`);
    loadData();
  };

  const handleReject = (mr) => {
    storageService.update('materialRequests', mr.id, { status: 'Rejected' });
    showToast(`Material Request ${mr.mr_no} ditolak.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedMR) {
      storageService.delete('materialRequests', selectedMR.id);
      showToast(`Material Request ${selectedMR.mr_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = requests.filter(mr => {
    const matchSearch = mr.mr_no?.toLowerCase().includes(search.toLowerCase()) ||
      mr.requester?.toLowerCase().includes(search.toLowerCase()) ||
      mr.project?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || mr.status === statusFilter;
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
            <FileCheck className="w-7 h-7 text-cyan-400" />
            Permintaan Pengeluaran Material (Material Requests / MR)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Otorisasi pelepasan bahan baku gudang untuk lini perakitan produksi dan fulfillment order</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Buat Material Request
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. MR, Pemohon, atau Nama Project..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Status MR</option>
          <option value="Pending">Pending Approval</option>
          <option value="Approved">Approved (Siap Pick)</option>
          <option value="Rejected">Rejected (Ditolak)</option>
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. MR / Tanggal</th>
                <th className="px-4 py-3.5">Divisi Pemohon</th>
                <th className="px-4 py-3.5">Nama Project / Keperluan</th>
                <th className="px-4 py-3.5 text-center">Jumlah SKU</th>
                <th className="px-4 py-3.5 text-center">Prioritas</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi & Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data Material Request yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((mr) => (
                  <tr key={mr.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{mr.mr_no}</span>
                      <span className="text-[11px] text-slate-500">{mr.date}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-100">{mr.requester}</td>
                    <td className="px-4 py-3.5 text-slate-300">{mr.project}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-white">
                      {mr.items_count} SKU
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        mr.priority === 'High'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {mr.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={mr.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {mr.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(mr)}
                              className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition"
                              title="Setujui (Approve)"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReject(mr)}
                              className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 transition"
                              title="Tolak (Reject)"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenDetail(mr)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(mr)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedMR(mr); setIsDeleteOpen(true); }}
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
        title={selectedMR ? `Edit Material Request: ${selectedMR.mr_no}` : 'Buat Permintaan Material Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. MR *</label>
              <input
                type="text"
                required
                value={formData.mr_no}
                onChange={(e) => setFormData({ ...formData, mr_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prioritas</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-semibold"
              >
                <option value="High">High (Prioritas Tinggi)</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Divisi Pemohon *</label>
              <input
                type="text"
                required
                value={formData.requester}
                onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jumlah SKU Material</label>
              <input
                type="number"
                min="1"
                required
                value={formData.items_count}
                onChange={(e) => setFormData({ ...formData, items_count: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Keperluan / Nama Project Produksi *</label>
            <input
              type="text"
              required
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Material Request</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedMR && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Detail Permintaan Material: ${selectedMR.mr_no}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#090f1d] border border-white/[0.05]">
              <div>
                <span className="text-slate-500 block">No. MR:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedMR.mr_no}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal:</span>
                <span className="text-slate-200">{selectedMR.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Pemohon:</span>
                <span className="font-semibold text-slate-200">{selectedMR.requester}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Project:</span>
                <span className="font-semibold text-slate-200">{selectedMR.project}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Prioritas:</span>
                <span className="font-bold text-amber-400">{selectedMR.priority}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status:</span>
                <span className="font-bold text-emerald-400">{selectedMR.status}</span>
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
        title="Hapus Material Request"
        message={`Apakah Anda yakin ingin menghapus data permintaan material "${selectedMR?.mr_no}"?`}
        confirmText="Hapus MR"
      />
    </div>
  );
};

export default MaterialRequest;
