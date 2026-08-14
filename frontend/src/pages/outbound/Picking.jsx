import React, { useState, useEffect } from 'react';
import {
  PackageOpen, Plus, Edit2, Trash2, Search, CheckCircle2,
  Clock, MapPin, ArrowRight, Check, User, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';

const Picking = () => {
  const [pickLists, setPickLists] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPick, setSelectedPick] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    pick_no: '',
    ref_order: 'MR-2026-051',
    picker: 'Rian Hidayat',
    zone: 'Zone A & B - Electronics',
    total_items: 50,
    picked_items: 25,
    status: 'In Progress'
  });

  const loadData = () => {
    setPickLists(storageService.get('pickings'));
    const mrs = storageService.get('materialRequests');
    setMaterialRequests(mrs);
    if (mrs.length > 0 && !formData.ref_order) {
      setFormData(prev => ({ ...prev, ref_order: mrs[0].mr_no }));
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
    setSelectedPick(null);
    setFormData({
      pick_no: `PCK-${Date.now().toString().slice(-6)}`,
      ref_order: materialRequests[0]?.mr_no || 'MR-2026-051',
      picker: 'Rian Hidayat',
      zone: 'Zone A - Fast Moving',
      total_items: 30,
      picked_items: 0,
      status: 'In Progress'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pck) => {
    setSelectedPick(pck);
    setFormData({ ...pck });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = Number(formData.total_items);
    const picked = Number(formData.picked_items);
    const status = picked >= total ? 'Completed' : picked > 0 ? 'In Progress' : 'Pending';

    const payload = {
      ...formData,
      total_items: total,
      picked_items: picked,
      status
    };

    if (selectedPick) {
      storageService.update('pickings', selectedPick.id, payload);
      showToast(`Tugas picking ${payload.pick_no} berhasil diperbarui.`);
    } else {
      storageService.create('pickings', payload);
      showToast(`Pick List ${payload.pick_no} berhasil dibuat & ditugaskan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleQuickComplete = (pck) => {
    storageService.update('pickings', pck.id, {
      picked_items: pck.total_items,
      status: 'Completed'
    });
    showToast(`Tugas picking ${pck.pick_no} telah diselesaikan 100%.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedPick) {
      storageService.delete('pickings', selectedPick.id);
      showToast(`Pick List ${selectedPick.pick_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = pickLists.filter(p =>
    p.pick_no?.toLowerCase().includes(search.toLowerCase()) ||
    p.ref_order?.toLowerCase().includes(search.toLowerCase()) ||
    p.picker?.toLowerCase().includes(search.toLowerCase()) ||
    p.zone?.toLowerCase().includes(search.toLowerCase())
  );

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
            <PackageOpen className="w-7 h-7 text-cyan-400" />
            Pengambilan Barang (Order Picking List)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Penugasan rute picking petugas gudang, verifikasi bin rak, dan progres pemenuhan barang</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Buat Tugas Picking Baru
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari No. Picking, Ref. Order, Nama Picker, atau Zona..."
          className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-[#0d1627] rounded-2xl border border-white/[0.08] text-slate-500">
            Tidak ada tugas picking aktif saat ini.
          </div>
        ) : (
          filtered.map((pick) => {
            const progress = Math.min(100, Math.round(((pick.picked_items || 0) / (pick.total_items || 1)) * 100));
            return (
              <div key={pick.id} className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{pick.pick_no}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{pick.ref_order}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      pick.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    }`}>
                      {pick.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {pick.status}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(pick)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setSelectedPick(pick); setIsDeleteOpen(true); }}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-y border-white/[0.06] py-3">
                  <div>
                    <span className="text-slate-500 block">Zona Pengambilan:</span>
                    <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {pick.zone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Petugas Picker:</span>
                    <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {pick.picker}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Progres Pengambilan:</span>
                    <span className="text-cyan-400 font-mono font-bold">{pick.picked_items} / {pick.total_items} Items ({progress}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/[0.05]">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {pick.status !== 'Completed' && (
                  <button
                    onClick={() => handleQuickComplete(pick)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Tandai Selesai Picking 100%
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPick ? `Edit Picking List: ${selectedPick.pick_no}` : 'Buat Tugas Picking Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Pick List *</label>
              <input
                type="text"
                required
                value={formData.pick_no}
                onChange={(e) => setFormData({ ...formData, pick_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Referensi Order / MR *</label>
              <input
                type="text"
                required
                value={formData.ref_order}
                onChange={(e) => setFormData({ ...formData, ref_order: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Petugas Picker *</label>
              <input
                type="text"
                required
                value={formData.picker}
                onChange={(e) => setFormData({ ...formData, picker: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Zona Pengambilan</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Item yang Harus Diambil *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.total_items}
                onChange={(e) => setFormData({ ...formData, total_items: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Item Berhasil Diambil</label>
              <input
                type="number"
                min="0"
                value={formData.picked_items}
                onChange={(e) => setFormData({ ...formData, picked_items: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Pick List</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Tugas Picking"
        message={`Apakah Anda yakin ingin menghapus pick list "${selectedPick?.pick_no}"?`}
        confirmText="Hapus"
      />
    </div>
  );
};

export default Picking;
