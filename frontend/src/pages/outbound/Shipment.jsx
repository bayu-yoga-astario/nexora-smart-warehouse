import React, { useState, useEffect } from 'react';
import {
  Truck, Plus, Edit2, Trash2, Search, CheckCircle2,
  MapPin, Navigation, Clock, Check, Eye
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';

const Shipment = () => {
  const [shipments, setShipments] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    shp_no: '',
    do_no: 'DO-2026-042',
    carrier: 'NEXORA Dedicated Fleet',
    tracking_no: 'NEX-TRK-9901',
    dispatch_date: '2026-08-14 09:00',
    eta: '2026-08-14 17:00',
    status: 'In Transit',
    current_checkpoint: 'Tol Jakarta-Cikampek KM 34'
  });

  const loadData = () => {
    setShipments(storageService.get('shipments'));
    const dos = storageService.get('deliveryOrders');
    setDeliveryOrders(dos);
    if (dos.length > 0 && !formData.do_no) {
      setFormData(prev => ({ ...prev, do_no: dos[0].do_no }));
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
    setSelectedShipment(null);
    setFormData({
      shp_no: `SHP-${Date.now().toString().slice(-6)}`,
      do_no: deliveryOrders[0]?.do_no || 'DO-2026-001',
      carrier: 'NEXORA Dedicated Logistics',
      tracking_no: `NEX-TRK-${Date.now().toString().slice(-5)}`,
      dispatch_date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      eta: '2026-08-15 16:00',
      status: 'In Transit',
      current_checkpoint: 'Hub Logistik Utama'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setSelectedShipment(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedShipment) {
      storageService.update('shipments', selectedShipment.id, formData);
      showToast(`Informasi pengiriman ${formData.shp_no} berhasil diperbarui.`);
    } else {
      storageService.create('shipments', formData);
      showToast(`Pengiriman armada ${formData.shp_no} berhasil dijadwalkan.`);
    }
    loadData();
    setIsModalOpen(false);
  };

  const handleMarkDelivered = (s) => {
    storageService.update('shipments', s.id, {
      status: 'Delivered',
      current_checkpoint: 'Tiba di Lokasi Klien (Delivered)'
    });
    showToast(`Pengiriman ${s.shp_no} telah selesai & terkonfirmasi diterima.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedShipment) {
      storageService.delete('shipments', selectedShipment.id);
      showToast(`Data pengiriman ${selectedShipment.shp_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = shipments.filter(s =>
    s.shp_no?.toLowerCase().includes(search.toLowerCase()) ||
    s.tracking_no?.toLowerCase().includes(search.toLowerCase()) ||
    s.carrier?.toLowerCase().includes(search.toLowerCase()) ||
    s.do_no?.toLowerCase().includes(search.toLowerCase())
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
            <Truck className="w-7 h-7 text-cyan-400" />
            Pengiriman & Pelacakan Logistik (Shipment Tracking)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Pemantauan armada ekspedisi live, estimasi waktu tiba (ETA), dan titik checkpoint perjalanan</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Jadwalkan Pengiriman Baru
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Lacak No. Resi (AWB), No. Shipment, atau Ref. DO..."
          className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#0d1627] rounded-2xl border border-white/[0.08] text-slate-500">
            Tidak ada data pengiriman logistik yang sesuai.
          </div>
        ) : (
          filtered.map((shp) => (
            <div key={shp.id} className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{shp.shp_no}</span>
                    <span className="text-[11px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      Resi / AWB: {shp.tracking_no}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">Ref: {shp.do_no} • {shp.carrier}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    shp.status === 'Delivered'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  }`}>
                    <Navigation className="w-3.5 h-3.5" />
                    {shp.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(shp)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedShipment(shp); setIsDeleteOpen(true); }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#090f1d] border border-white/[0.04]">
                  <span className="text-slate-500 block">Waktu Berangkat (Dispatch):</span>
                  <span className="text-slate-200 font-medium font-mono mt-0.5 block">{shp.dispatch_date}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#090f1d] border border-white/[0.04]">
                  <span className="text-slate-500 block">Estimasi Sampai (ETA):</span>
                  <span className="text-emerald-400 font-mono font-bold mt-0.5 block">{shp.eta}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#090f1d] border border-white/[0.04]">
                  <span className="text-slate-500 block">Posisi Terakhir (Checkpoint):</span>
                  <span className="text-cyan-300 font-medium flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    {shp.current_checkpoint || 'Dalam perjalanan'}
                  </span>
                </div>
              </div>

              {shp.status !== 'Delivered' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleMarkDelivered(shp)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Konfirmasi Barang Telah Sampai (Delivered)</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedShipment ? `Edit Pengiriman: ${selectedShipment.shp_no}` : 'Jadwalkan Pengiriman Logistik'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Shipment *</label>
              <input
                type="text"
                required
                value={formData.shp_no}
                onChange={(e) => setFormData({ ...formData, shp_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ref. Surat Jalan (DO) *</label>
              <select
                value={formData.do_no}
                onChange={(e) => setFormData({ ...formData, do_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              >
                {deliveryOrders.map(d => (
                  <option key={d.id} value={d.do_no}>{d.do_no} ({d.customer})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Ekspedisi / Carrier *</label>
              <input
                type="text"
                required
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Resi / Waybill (AWB) *</label>
              <input
                type="text"
                required
                value={formData.tracking_no}
                onChange={(e) => setFormData({ ...formData, tracking_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Waktu Keberangkatan</label>
              <input
                type="text"
                value={formData.dispatch_date}
                onChange={(e) => setFormData({ ...formData, dispatch_date: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimasi Tiba (ETA)</label>
              <input
                type="text"
                value={formData.eta}
                onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Titik Checkpoint Lokasi Saat Ini</label>
            <input
              type="text"
              value={formData.current_checkpoint}
              onChange={(e) => setFormData({ ...formData, current_checkpoint: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Jadwal Pengiriman</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Pengiriman"
        message={`Apakah Anda yakin ingin menghapus catatan pengiriman "${selectedShipment?.shp_no}"?`}
        confirmText="Hapus"
      />
    </div>
  );
};

export default Shipment;
