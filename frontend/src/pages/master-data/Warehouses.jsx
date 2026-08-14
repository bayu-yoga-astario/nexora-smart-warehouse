import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Building2, MapPin, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWH, setSelectedWH] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Central Distribution Hub',
    address: '',
    capacity_sqm: 5000,
    total_bins: 200,
    manager: 'Ahmad Subagyo',
    status: 'Active'
  });

  const loadData = () => {
    setWarehouses(storageService.get('warehouses'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedWH(null);
    setFormData({
      code: `WH-NEW-0${warehouses.length + 1}`,
      name: '',
      type: 'Central Distribution Hub',
      address: '',
      capacity_sqm: 5000,
      total_bins: 200,
      manager: 'Ahmad Subagyo',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w) => {
    setSelectedWH(w);
    setFormData({ ...w });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (w) => {
    setSelectedWH(w);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      capacity_sqm: Number(formData.capacity_sqm),
      total_bins: Number(formData.total_bins)
    };

    if (selectedWH) {
      storageService.update('warehouses', selectedWH.id, payload);
      showToast(`Gudang "${payload.name}" berhasil diperbarui.`);
    } else {
      storageService.create('warehouses', payload);
      showToast(`Gudang "${payload.name}" berhasil ditambahkan.`);
    }
    loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedWH) {
      storageService.delete('warehouses', selectedWH.id);
      showToast(`Gudang "${selectedWH.name}" telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = warehouses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.code.toLowerCase().includes(search.toLowerCase()) ||
    w.manager.toLowerCase().includes(search.toLowerCase())
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
            <Building2 className="w-7 h-7 text-cyan-400" />
            Master Gudang & Fasilitas Distribusi
          </h1>
          <p className="text-xs text-slate-400 mt-1">Struktur jaringan gudang, kapasitas lantai m², jumlah bin rak, dan PIC pengelola</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Tambah Gudang
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode, nama gudang, atau nama manager..."
          className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">Kode Gudang</th>
                <th className="px-4 py-3.5">Nama Fasilitas Gudang</th>
                <th className="px-4 py-3.5">Tipe Distribusi</th>
                <th className="px-4 py-3.5 text-right">Luas (m²)</th>
                <th className="px-4 py-3.5 text-center">Total Bins</th>
                <th className="px-4 py-3.5">Warehouse Manager</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data gudang yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-cyan-400">{w.code}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-100 block">{w.name}</span>
                      <span className="text-[11px] text-slate-500 max-w-xs truncate block">{w.address}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {w.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-300">
                      {w.capacity_sqm?.toLocaleString('id-ID')} m²
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-white">
                      {w.total_bins}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{w.manager}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(w)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(w)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedWH ? `Edit Gudang: ${selectedWH.code}` : 'Tambah Gudang Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Gudang *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Fasilitas</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Central Distribution Hub">Central Distribution Hub</option>
                <option value="Regional Hub">Regional Hub</option>
                <option value="Transit / Fulfillment">Transit / Fulfillment</option>
                <option value="Cold Storage">Cold Storage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Gudang *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kapasitas Luas (m²)</label>
              <input
                type="number"
                min="100"
                value={formData.capacity_sqm}
                onChange={(e) => setFormData({ ...formData, capacity_sqm: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Bin Lokasi</label>
              <input
                type="number"
                min="1"
                value={formData.total_bins}
                onChange={(e) => setFormData({ ...formData, total_bins: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Warehouse Manager / PIC</label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Lokasi Gudang</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Gudang</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Gudang"
        message={`Apakah Anda yakin ingin menghapus data gudang "${selectedWH?.name}"?`}
        confirmText="Hapus Gudang"
      />
    </div>
  );
};

export default Warehouses;
