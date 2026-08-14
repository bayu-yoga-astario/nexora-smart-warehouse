import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Plus, Edit2, Trash2, Search, Check,
  CheckCircle2, Shield, Lock, Users
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';

const allPermissionModules = [
  { id: 'master_data', name: 'Master Data & SKU Catalog (Produk, Vendor, Gudang)' },
  { id: 'inventory_full', name: 'Inventory & Mutasi Stok (Stock Opname & Adjustment)' },
  { id: 'procurement_full', name: 'Procurement & Purchase Orders (PR, PO, Goods Receipt)' },
  { id: 'outbound_full', name: 'Outbound & Dispatch (Picking, Packing, Surat Jalan)' },
  { id: 'analytics_view', name: 'AI & Analytics Dashboard (Demand Forecast & Health)' },
  { id: 'reports_export', name: 'Laporan & Export Data (Excel & PDF)' },
  { id: 'admin_config', name: 'Administrasi Sistem & Manajemen User (RBAC & Audit)' }
];

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    users_count: 0,
    permissions: []
  });

  const loadData = () => {
    setRoles(storageService.get('roles'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      users_count: 0,
      permissions: ['master_data', 'inventory_full']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setSelectedRole(r);
    setFormData({
      name: r.name,
      description: r.description,
      users_count: r.users_count || 0,
      permissions: r.permissions || []
    });
    setIsModalOpen(true);
  };

  const handlePermissionToggle = (permId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole) {
      storageService.update('roles', selectedRole.id, formData);
      showToast(`Role "${formData.name}" berhasil diperbarui.`);
    } else {
      storageService.create('roles', formData);
      showToast(`Role baru "${formData.name}" berhasil dibuat.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedRole) {
      if (selectedRole.name === 'Super Admin') {
        showToast('Role Super Admin bawaan sistem tidak dapat dihapus!', true);
        setIsDeleteOpen(false);
        return;
      }
      storageService.delete('roles', selectedRole.id);
      showToast(`Role "${selectedRole.name}" telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
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
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
            Role & Matriks Hak Akses (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Konfigurasi hak istimewa modul operasional, pembatasan akses staff gudang, dan kebijakan keamanan</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Buat Role Kustom Baru
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama role atau deskripsi wewenang..."
          className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-[#0d1627] rounded-2xl border border-white/[0.08] text-slate-500">
            Tidak ada role yang sesuai.
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      {r.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400"
                      title="Edit Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {r.name !== 'Super Admin' && (
                      <button
                        onClick={() => { setSelectedRole(r); setIsDeleteOpen(true); }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                        title="Hapus Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/[0.06] pt-4 mt-4">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    Modul yang Diizinkan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.permissions?.includes('all') ? (
                      <span className="px-2.5 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-400" /> Full Master Access (Semua Modul)
                      </span>
                    ) : (
                      r.permissions?.map((p) => {
                        const matched = allPermissionModules.find(m => m.id === p);
                        return (
                          <span key={p} className="px-2.5 py-1 bg-[#090f1d] border border-white/[0.06] text-slate-300 rounded-lg text-[11px] flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" /> {matched ? matched.name.split('(')[0] : p}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {r.users_count || 0} Pengguna Terdaftar
                </span>
                <span className="text-[10px] font-mono text-cyan-400">RBAC Active</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? `Edit Role: ${selectedRole.name}` : 'Buat Role Hak Akses Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Role *</label>
            <input
              type="text"
              required
              placeholder="e.g. Quality Inspector, Inventory Supervisor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Wewenang / Tanggung Jawab *</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Centang Modul Izin yang Diberikan (Permissions Matrix)
            </label>
            <div className="space-y-2 p-3.5 rounded-xl bg-[#090f1d] border border-white/[0.06] max-h-56 overflow-y-auto">
              {allPermissionModules.map((pm) => {
                const checked = formData.permissions.includes(pm.id) || formData.permissions.includes('all');
                return (
                  <label key={pm.id} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white transition select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handlePermissionToggle(pm.id)}
                      className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer"
                    />
                    <span>{pm.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Role RBAC</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Role Akses"
        message={`Apakah Anda yakin ingin menghapus role "${selectedRole?.name}"?`}
        confirmText="Hapus Role"
      />
    </div>
  );
};

export default RolesPermissions;
