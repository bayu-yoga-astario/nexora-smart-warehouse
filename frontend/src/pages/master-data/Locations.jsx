import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  const [whFilter, setWhFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    warehouse: 'Jakarta Central DC',
    zone: 'Zone A - Electronics',
    rack: 'R-01',
    shelf: 'S-01',
    bin: 'BIN-01',
    status: 'Available'
  });

  const loadData = () => {
    setLocations(storageService.get('locations'));
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
    setSelectedLocation(null);
    const count = locations.length + 1;
    setFormData({
      code: `LOC-A${Math.floor(count / 10) + 1}-0${(count % 9) + 1}`,
      warehouse: warehouses[0]?.name || 'Jakarta Central DC',
      zone: 'Zone A - Fast Moving',
      rack: `R-0${(count % 5) + 1}`,
      shelf: `S-0${(count % 4) + 1}`,
      bin: `BIN-0${(count % 6) + 1}`,
      status: 'Available'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc) => {
    setSelectedLocation(loc);
    setFormData({ ...loc });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (loc) => {
    setSelectedLocation(loc);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLocation) {
      storageService.update('locations', selectedLocation.id, formData);
      showToast(`Lokasi "${formData.code}" berhasil diperbarui.`);
    } else {
      storageService.create('locations', formData);
      showToast(`Lokasi "${formData.code}" berhasil ditambahkan.`);
    }
    loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedLocation) {
      storageService.delete('locations', selectedLocation.id);
      showToast(`Lokasi "${selectedLocation.code}" telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = locations.filter(l => {
    const matchSearch = l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.zone.toLowerCase().includes(search.toLowerCase()) ||
      l.warehouse.toLowerCase().includes(search.toLowerCase());
    const matchWh = whFilter === 'ALL' || l.warehouse === whFilter;
    return matchSearch && matchWh;
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
            <MapPin className="w-7 h-7 text-cyan-400" />
            Master Lokasi Penyimpanan (Bin / Rack)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Hierarki pemetaan tata letak gudang: Zona, Rak (Rack), Baris (Shelf), dan Bin</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Tambah Lokasi Bin
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode lokasi, zona, atau gudang..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={whFilter}
          onChange={(e) => setWhFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Gudang</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.name}>{w.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-5 py-3.5">Kode Lokasi Bin</th>
                <th className="px-5 py-3.5">Gudang</th>
                <th className="px-5 py-3.5">Zona</th>
                <th className="px-5 py-3.5 text-center">Rak</th>
                <th className="px-5 py-3.5 text-center">Shelf</th>
                <th className="px-5 py-3.5 text-center">Bin</th>
                <th className="px-5 py-3.5">Status Slot</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada lokasi bin yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-cyan-400">{loc.code}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-200">{loc.warehouse}</td>
                    <td className="px-5 py-3.5 text-slate-300">{loc.zone}</td>
                    <td className="px-5 py-3.5 text-center font-mono">{loc.rack}</td>
                    <td className="px-5 py-3.5 text-center font-mono">{loc.shelf}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-semibold text-white">{loc.bin}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        loc.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {loc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(loc)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(loc)}
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
        title={selectedLocation ? `Edit Lokasi: ${selectedLocation.code}` : 'Tambah Lokasi Bin Baru'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Lokasi *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Zona / Area *</label>
            <input
              type="text"
              required
              placeholder="e.g. Zone A - Electronics, Zone B - Raw Material"
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rak (Rack)</label>
              <input
                type="text"
                value={formData.rack}
                onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Baris (Shelf)</label>
              <input
                type="text"
                value={formData.shelf}
                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Bin</label>
              <input
                type="text"
                value={formData.bin}
                onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Status Ketersediaan</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            >
              <option value="Available">Available (Kosong / Siap Isi)</option>
              <option value="Occupied">Occupied (Terisi Barang)</option>
              <option value="Maintenance">Maintenance / Rusak</option>
            </select>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Lokasi</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Lokasi Bin"
        message={`Apakah Anda yakin ingin menghapus data lokasi "${selectedLocation?.code}"?`}
        confirmText="Hapus Lokasi"
      />
    </div>
  );
};

export default Locations;
