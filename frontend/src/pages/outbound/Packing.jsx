import React, { useState, useEffect } from 'react';
import {
  BoxSelect, Plus, Edit2, Trash2, Search, CheckCircle2,
  PackageCheck, Printer, Check, Weight, Box
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { exportToPDF } from '../../utils/pdfExport';
import { FileText } from 'lucide-react';

const Packing = () => {
  const [packStations, setPackStations] = useState([]);
  const [pickLists, setPickLists] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    pack_no: '',
    pick_no: 'PCK-2026-061',
    box_type: 'Heavy Duty Carton 50x40x30',
    weight_kg: 18.5,
    packed_by: 'Siti Rahma',
    status: 'Ready for Dispatch',
    notes: 'Segel QC terpasang rapi'
  });

  const printRef = useRef();

  const handlePrintSlip = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Packing_Slip_${selectedPack?.pack_no || 'NEXORA'}`,
    onAfterPrint: () => {
      showToast('Packing Slip berhasil dicetak.');
      setIsSlipOpen(false);
    }
  });

  const handleDownloadPDF = () => {
    exportToPDF(printRef.current, `Packing_Slip_${selectedPack?.pack_no || 'NEXORA'}.pdf`);
    showToast('Packing Slip berhasil diunduh sebagai PDF.');
    setIsSlipOpen(false);
  };

  const loadData = () => {
    setPackStations(storageService.get('packings'));
    const pcks = storageService.get('pickings');
    setPickLists(pcks);
    if (pcks.length > 0 && !formData.pick_no) {
      setFormData(prev => ({ ...prev, pick_no: pcks[0].pick_no }));
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
    setSelectedPack(null);
    setFormData({
      pack_no: `PCK-BOX-${Date.now().toString().slice(-4)}`,
      pick_no: pickLists[0]?.pick_no || 'PCK-2026-001',
      box_type: 'Heavy Duty Carton Box (50x40x30 cm)',
      weight_kg: 24.5,
      packed_by: 'Siti Rahma',
      status: 'Packing',
      notes: 'Kemasan kardus berlapis bubble wrap tebal'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedPack(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleOpenSlip = (p) => {
    setSelectedPack(p);
    setIsSlipOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      weight_kg: Number(formData.weight_kg)
    };

    if (selectedPack) {
      storageService.update('packings', selectedPack.id, payload);
      showToast(`Stasiun kemas ${payload.pack_no} berhasil diperbarui.`);
    } else {
      storageService.create('packings', payload);
      showToast(`Paket kemasan ${payload.pack_no} berhasil dibuat.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleMarkReady = (p) => {
    storageService.update('packings', p.id, { status: 'Ready for Dispatch' });
    showToast(`Paket ${p.pack_no} siap diantar ke ekspedisi.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedPack) {
      storageService.delete('packings', selectedPack.id);
      showToast(`Data paket kemas ${selectedPack.pack_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = packStations.filter(p =>
    p.pack_no?.toLowerCase().includes(search.toLowerCase()) ||
    p.pick_no?.toLowerCase().includes(search.toLowerCase()) ||
    p.box_type?.toLowerCase().includes(search.toLowerCase()) ||
    p.packed_by?.toLowerCase().includes(search.toLowerCase())
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
            <BoxSelect className="w-7 h-7 text-cyan-400" />
            Pengemasan & Packing Station
          </h1>
          <p className="text-xs text-slate-400 mt-1">Perakitan paket boks, pengukuran bobot timbangan (kg), dan pencetakan label resi pengiriman</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Buka Sesi Packing Baru
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari No. Box, Ref. Picking, atau Petugas Packer..."
          className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-[#0d1627] rounded-2xl border border-white/[0.08] text-slate-500">
            Tidak ada sesi packing aktif.
          </div>
        ) : (
          filtered.map((station) => (
            <div key={station.id} className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-cyan-400 font-bold">{station.pack_no}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    station.status === 'Ready for Dispatch'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {station.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(station)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedPack(station); setIsDeleteOpen(true); }}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Ref: {station.pick_no}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{station.box_type}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono font-bold text-slate-200">{station.weight_kg} kg</span>
                </p>
              </div>

              <div className="flex justify-between text-xs text-slate-300 bg-[#090f1d] p-3 rounded-xl border border-white/[0.05]">
                <span>Petugas Packer: <strong className="text-white">{station.packed_by}</strong></span>
                <span className="text-slate-500">{station.notes || 'Kemasan aman'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleOpenSlip(station)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Packing Slip</span>
                </button>
                {station.status !== 'Ready for Dispatch' ? (
                  <button
                    onClick={() => handleMarkReady(station)}
                    className="py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-95 transition flex items-center justify-center gap-1.5"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Siap Kirim</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    <span>Dispatched Ready</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPack ? `Edit Paket Kemasan: ${selectedPack.pack_no}` : 'Buka Sesi Packing Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Packing Label *</label>
              <input
                type="text"
                required
                value={formData.pack_no}
                onChange={(e) => setFormData({ ...formData, pack_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ref. Tugas Picking *</label>
              <select
                value={formData.pick_no}
                onChange={(e) => setFormData({ ...formData, pick_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              >
                {pickLists.map(p => (
                  <option key={p.id} value={p.pick_no}>{p.pick_no} ({p.ref_order})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Boks / Palet *</label>
              <input
                type="text"
                required
                value={formData.box_type}
                onChange={(e) => setFormData({ ...formData, box_type: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bobot Aktual Timbangan (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Petugas Packer *</label>
              <input
                type="text"
                required
                value={formData.packed_by}
                onChange={(e) => setFormData({ ...formData, packed_by: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Kemasan</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Packing">Packing In Progress</option>
                <option value="Ready for Dispatch">Ready for Dispatch (Siap Kirim)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Instruksi Khusus / Label Segel</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Sesi Packing</Button>
          </div>
        </form>
      </Modal>

      {/* Print Packing Slip Modal */}
      {selectedPack && (
        <Modal
          isOpen={isSlipOpen}
          onClose={() => setIsSlipOpen(false)}
          title={`Packing Slip Manifest: ${selectedPack.pack_no}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 p-2">
            <div ref={printRef} className="border border-dashed border-white/20 p-4 rounded-xl bg-slate-950 text-xs space-y-3 font-mono print:bg-white print:text-black print:border-black/50">
              <div className="text-center pb-2 border-b border-white/10 print:border-black/20">
                <h4 className="font-bold text-white text-sm print:text-black">NEXORA WMS PACKING SLIP</h4>
                <p className="text-[10px] text-slate-500 print:text-black/60">Security Seal & QC Verified</p>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-black/60">Package ID:</span>
                <span className="font-bold text-cyan-400 print:text-black">{selectedPack.pack_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-black/60">Ref. Picking:</span>
                <span className="text-white print:text-black">{selectedPack.pick_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-black/60">Box Type:</span>
                <span className="text-white print:text-black">{selectedPack.box_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-black/60">Gross Weight:</span>
                <span className="text-emerald-400 font-bold print:text-black">{selectedPack.weight_kg} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-black/60">Packer PIC:</span>
                <span className="text-white print:text-black">{selectedPack.packed_by}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <Button variant="secondary" onClick={() => setIsSlipOpen(false)}>Batal</Button>
              <Button variant="secondary" onClick={handleDownloadPDF}>
                <FileText className="w-4 h-4" /> Unduh PDF
              </Button>
              <Button variant="primary" onClick={handlePrintSlip}>
                <Printer className="w-4 h-4" /> Cetak Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Sesi Packing"
        message={`Apakah Anda yakin ingin menghapus catatan paket "${selectedPack?.pack_no}"?`}
        confirmText="Hapus"
      />
    </div>
  );
};

export default Packing;
