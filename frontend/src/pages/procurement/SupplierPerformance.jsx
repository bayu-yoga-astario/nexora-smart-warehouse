import React, { useState, useEffect } from 'react';
import {
  Award, Star, TrendingUp, AlertTriangle, ShieldCheck,
  Plus, Edit2, Trash2, Search, CheckCircle2, Building2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';

const SupplierPerformance = () => {
  const [evaluations, setEvaluations] = useState([
    { id: 1, name: 'PT Global Komponen Nusantara', code: 'SUP-001', rating: 4.8, onTimeRate: 98.5, defectRate: 0.4, totalPOs: 42, grade: 'A+', period: 'Q3 2026' },
    { id: 2, name: 'CV Logam Mandiri Perkasa', code: 'SUP-002', rating: 4.5, onTimeRate: 94.2, defectRate: 1.2, totalPOs: 28, grade: 'A', period: 'Q3 2026' },
    { id: 3, name: 'PT Indopack Kemasan Prima', code: 'SUP-003', rating: 4.2, onTimeRate: 89.0, defectRate: 2.1, totalPOs: 19, grade: 'B', period: 'Q3 2026' },
    { id: 4, name: 'Shanghai Tech Components Ltd', code: 'SUP-004', rating: 4.6, onTimeRate: 96.0, defectRate: 0.8, totalPOs: 15, grade: 'A', period: 'Q3 2026' }
  ]);

  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    supplierName: '',
    code: 'SUP-001',
    rating: 4.5,
    onTimeRate: 95.0,
    defectRate: 1.0,
    totalPOs: 20,
    period: 'Q3 2026',
    notes: 'Kinerja pengiriman sangat memuaskan'
  });

  const loadData = () => {
    const sups = storageService.get('suppliers');
    setSuppliers(sups);
    if (sups.length > 0 && !formData.supplierName) {
      setFormData(prev => ({
        ...prev,
        supplierName: sups[0].name,
        code: sups[0].code
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

  const calculateGrade = (rating, onTime, defect) => {
    if (rating >= 4.7 && onTime >= 97 && defect <= 0.5) return 'A+';
    if (rating >= 4.4 && onTime >= 92 && defect <= 1.5) return 'A';
    if (rating >= 3.8 && onTime >= 85) return 'B';
    return 'C';
  };

  const handleOpenAdd = () => {
    setSelectedEval(null);
    const defSup = suppliers[0] || { name: 'PT Vendor Baru', code: 'SUP-NEW' };
    setFormData({
      supplierName: defSup.name,
      code: defSup.code,
      rating: 4.5,
      onTimeRate: 95.0,
      defectRate: 1.0,
      totalPOs: 20,
      period: 'Q3 2026',
      notes: 'Evaluasi berkala pemenuhan SLA supplier'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev) => {
    setSelectedEval(ev);
    setFormData({
      supplierName: ev.name,
      code: ev.code,
      rating: ev.rating,
      onTimeRate: ev.onTimeRate,
      defectRate: ev.defectRate,
      totalPOs: ev.totalPOs,
      period: ev.period,
      notes: ev.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSupplierSelect = (name) => {
    const sup = suppliers.find(s => s.name === name);
    setFormData({
      ...formData,
      supplierName: name,
      code: sup?.code || 'SUP-001'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ratingNum = Number(formData.rating);
    const onTimeNum = Number(formData.onTimeRate);
    const defectNum = Number(formData.defectRate);
    const grade = calculateGrade(ratingNum, onTimeNum, defectNum);

    const payload = {
      name: formData.supplierName,
      code: formData.code,
      rating: ratingNum,
      onTimeRate: onTimeNum,
      defectRate: defectNum,
      totalPOs: Number(formData.totalPOs),
      period: formData.period,
      grade,
      notes: formData.notes
    };

    if (selectedEval) {
      setEvaluations(prev => prev.map(ev => ev.id === selectedEval.id ? { ...ev, ...payload } : ev));
      showToast(`Evaluasi vendor "${payload.name}" berhasil diperbarui.`);
    } else {
      const newEntry = { id: Date.now(), ...payload };
      setEvaluations(prev => [newEntry, ...prev]);
      showToast(`Evaluasi performa vendor "${payload.name}" berhasil disimpan.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedEval) {
      setEvaluations(prev => prev.filter(ev => ev.id !== selectedEval.id));
      showToast(`Data evaluasi "${selectedEval.name}" telah dihapus.`);
    }
    setIsDeleteOpen(false);
  };

  const filtered = evaluations.filter(ev =>
    ev.name.toLowerCase().includes(search.toLowerCase()) ||
    ev.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
            <Award className="w-7 h-7 text-cyan-400" />
            Evaluasi Kinerja Vendor & Supplier (Scorecard)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Metrik kepatuhan SLA pengiriman on-time, rasio cacat produk (*defect rate*), dan pemeringkatan vendor</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Input Evaluasi Supplier
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Rata-rata On-Time Delivery</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">95.8%</h3>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Tingkat Cacat (Defect Rate)</p>
              <h3 className="text-2xl font-black text-cyan-400 mt-1 font-mono">0.9%</h3>
            </div>
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Vendor Grade A+ / A</p>
              <h3 className="text-2xl font-black text-amber-400 mt-1 font-mono">{evaluations.filter(e => e.grade.startsWith('A')).length} Vendor</h3>
            </div>
            <Star className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total PO Terselesaikan</p>
              <h3 className="text-2xl font-black text-slate-200 mt-1 font-mono">{evaluations.reduce((acc, c) => acc + (c.totalPOs || 0), 0)} Orders</h3>
            </div>
            <Award className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode atau nama vendor supplier..."
          className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">Nama Vendor & Kode</th>
                <th className="px-4 py-3.5 text-center">Periode Audit</th>
                <th className="px-4 py-3.5">Skor Rating</th>
                <th className="px-4 py-3.5 text-right">On-Time Rate</th>
                <th className="px-4 py-3.5 text-right">Defect Rate</th>
                <th className="px-4 py-3.5 text-center">Total PO Selesai</th>
                <th className="px-4 py-3.5 text-center">Grade Penilaian</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data evaluasi yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-white block">{ev.name}</span>
                      <span className="font-mono text-cyan-400 text-[11px]">{ev.code}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-slate-400 font-medium">{ev.period}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {ev.rating} / 5.0
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">{ev.onTimeRate}%</td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-300">{ev.defectRate}%</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-white">{ev.totalPOs} PO</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        ev.grade === 'A+'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : ev.grade === 'A'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : ev.grade === 'B'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        Grade {ev.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit Skor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedEval(ev); setIsDeleteOpen(true); }}
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
        title={selectedEval ? `Edit Evaluasi Vendor: ${selectedEval.name}` : 'Input Scorecard Evaluasi Vendor'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Vendor Supplier *</label>
              <select
                value={formData.supplierName}
                onChange={(e) => handleSupplierSelect(e.target.value)}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Periode Evaluasi</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skor Rating (1 - 5) *</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">On-Time Rate (%) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={formData.onTimeRate}
                onChange={(e) => setFormData({ ...formData, onTimeRate: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Defect Rate (%) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                required
                value={formData.defectRate}
                onChange={(e) => setFormData({ ...formData, defectRate: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Total PO Terselesaikan</label>
            <input
              type="number"
              min="0"
              value={formData.totalPOs}
              onChange={(e) => setFormData({ ...formData, totalPOs: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Evaluasi / Rekomendasi SLA</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Scorecard</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Evaluasi Supplier"
        message={`Apakah Anda yakin ingin menghapus data scorecard "${selectedEval?.name}"?`}
        confirmText="Hapus"
      />
    </div>
  );
};

export default SupplierPerformance;
