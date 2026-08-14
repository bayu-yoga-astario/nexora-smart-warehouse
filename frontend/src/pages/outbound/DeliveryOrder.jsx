import React, { useState, useEffect } from 'react';
import {
  Send, Plus, Edit2, Trash2, Search, CheckCircle2,
  Truck, Printer, Eye, FileText, Check, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { exportToPDF } from '../../utils/pdfExport';

const DeliveryOrder = () => {
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDO, setSelectedDO] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    do_no: '',
    customer: '',
    destination: 'Cikarang, Bekasi',
    driver: 'M. Yusuf (B 9482 SXA)',
    total_packages: 5,
    status: 'Preparing',
    notes: 'Harap bawa surat tanda terima bermaterai'
  });

  const printRef = useRef();

  const handlePrintDocument = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Surat_Jalan_${selectedDO?.do_no || 'NEXORA'}`,
    onAfterPrint: () => {
      showToast('Surat Jalan berhasil dicetak.');
      setIsPrintOpen(false);
    }
  });

  const handleDownloadPDF = () => {
    exportToPDF(printRef.current, `Surat_Jalan_${selectedDO?.do_no || 'NEXORA'}.pdf`);
    showToast('Surat Jalan berhasil diunduh sebagai PDF.');
    setIsPrintOpen(false);
  };

  const loadData = () => {
    setDeliveryOrders(storageService.get('deliveryOrders'));
    const custs = storageService.get('customers');
    setCustomers(custs);
    if (custs.length > 0 && !formData.customer) {
      setFormData(prev => ({
        ...prev,
        customer: custs[0].name,
        destination: custs[0].address || custs[0].city
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

  const handleOpenAdd = () => {
    setSelectedDO(null);
    const defCust = customers[0] || { name: 'PT Pelanggan B2B', address: 'Jakarta' };
    setFormData({
      do_no: `DO-${Date.now().toString().slice(-6)}`,
      customer: defCust.name,
      destination: defCust.address || 'Jakarta Central',
      driver: 'M. Yusuf (Fleet B 9482 SXA)',
      total_packages: 6,
      status: 'Preparing',
      notes: 'Pengiriman barang pesanan batch utama'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setSelectedDO(d);
    setFormData({ ...d });
    setIsModalOpen(true);
  };

  const handleOpenPrint = (d) => {
    setSelectedDO(d);
    setIsPrintOpen(true);
  };

  const handleCustomerSelect = (name) => {
    const c = customers.find(item => item.name === name);
    setFormData({
      ...formData,
      customer: name,
      destination: c ? `${c.address}, ${c.city}` : formData.destination
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      total_packages: Number(formData.total_packages)
    };

    if (selectedDO) {
      storageService.update('deliveryOrders', selectedDO.id, payload);
      showToast(`Surat Jalan ${payload.do_no} berhasil diperbarui.`);
    } else {
      storageService.create('deliveryOrders', payload);
      showToast(`Surat Jalan ${payload.do_no} berhasil diterbitkan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleStatusChange = (d, newStatus) => {
    storageService.update('deliveryOrders', d.id, { status: newStatus });
    showToast(`Status Surat Jalan ${d.do_no} diubah menjadi "${newStatus}".`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedDO) {
      storageService.delete('deliveryOrders', selectedDO.id);
      showToast(`Surat Jalan ${selectedDO.do_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = deliveryOrders.filter(d => {
    const matchSearch = d.do_no?.toLowerCase().includes(search.toLowerCase()) ||
      d.customer?.toLowerCase().includes(search.toLowerCase()) ||
      d.destination?.toLowerCase().includes(search.toLowerCase()) ||
      d.driver?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
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
            <Send className="w-7 h-7 text-cyan-400" />
            Surat Jalan & Delivery Order (DO)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Dokumen resmi manifest pelepasan armada, otorisasi pengiriman ke pelanggan, dan cetak Surat Jalan</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Terbitkan Surat Jalan Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. DO, Nama Pelanggan, Alamat, atau Driver..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          <option value="ALL">Semua Status DO</option>
          <option value="Preparing">Preparing (Persiapan Muat)</option>
          <option value="Dispatched">Dispatched (Berangkat)</option>
          <option value="Delivered">Delivered (Telah Diterima)</option>
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. DO / Tanggal</th>
                <th className="px-4 py-3.5">Nama Pelanggan</th>
                <th className="px-4 py-3.5">Alamat Tujuan Pengiriman</th>
                <th className="px-4 py-3.5">Armada / Driver</th>
                <th className="px-4 py-3.5 text-center">Jumlah Koli</th>
                <th className="px-4 py-3.5">Status Pengiriman</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada dokumen Surat Jalan yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{d.do_no}</span>
                      <span className="text-[11px] text-slate-500">{d.date}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-100">{d.customer}</td>
                    <td className="px-4 py-3.5 text-slate-300 max-w-xs truncate">{d.destination}</td>
                    <td className="px-4 py-3.5 text-slate-300 flex items-center gap-1 mt-1">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{d.driver}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-white">
                      {d.total_packages} Koli
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {d.status === 'Preparing' && (
                          <button
                            onClick={() => handleStatusChange(d, 'Dispatched')}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[10px] font-semibold border border-cyan-500/20"
                            title="Tandai Armada Berangkat"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Berangkat</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenPrint(d)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="Cetak Surat Jalan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedDO(d); setIsDeleteOpen(true); }}
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
        title={selectedDO ? `Edit Surat Jalan: ${selectedDO.do_no}` : 'Terbitkan Surat Jalan (DO) Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Surat Jalan (DO) *</label>
              <input
                type="text"
                required
                value={formData.do_no}
                onChange={(e) => setFormData({ ...formData, do_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Pelanggan Penerima *</label>
              <select
                value={formData.customer}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.city})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Tujuan Lengkap *</label>
            <textarea
              rows={2}
              required
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Armada / Driver Ekspedisi *</label>
              <input
                type="text"
                required
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jumlah Total Paket / Koli</label>
              <input
                type="number"
                min="1"
                required
                value={formData.total_packages}
                onChange={(e) => setFormData({ ...formData, total_packages: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Pengiriman</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Preparing">Preparing (Persiapan Muat)</option>
                <option value="Dispatched">Dispatched (Armada Keluar Gudang)</option>
                <option value="Delivered">Delivered (Telah Diterima Pelanggan)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Dokumen</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Surat Jalan</Button>
          </div>
        </form>
      </Modal>

      {/* Print DO Preview Modal */}
      {selectedDO && (
        <Modal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          title={`Format Cetak Surat Jalan: ${selectedDO.do_no}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <div ref={printRef} className="p-5 rounded-2xl bg-slate-950 border border-white/[0.08] text-slate-200 space-y-4 print:bg-white print:text-black print:border-none">
              <div className="flex justify-between items-start pb-3 border-b border-white/[0.08] print:border-black/20">
                <div>
                  <h3 className="text-base font-black text-white tracking-widest print:text-black">NEXORA WMS & ERP</h3>
                  <p className="text-[10px] text-slate-400 print:text-black/60">SURAT JALAN / DELIVERY ORDER MANIFEST</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-cyan-400 text-sm print:text-black">{selectedDO.do_no}</span>
                  <p className="text-[10px] text-slate-400 print:text-black/60">{selectedDO.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block print:text-black/60">Penerima Barang:</span>
                  <strong className="text-white block mt-0.5 print:text-black">{selectedDO.customer}</strong>
                  <p className="text-slate-400 mt-0.5 leading-relaxed print:text-black/80">{selectedDO.destination}</p>
                </div>
                <div>
                  <span className="text-slate-500 block print:text-black/60">Informasi Ekspedisi / Sopir:</span>
                  <strong className="text-cyan-400 block mt-0.5 print:text-black">{selectedDO.driver}</strong>
                  <p className="text-slate-400 mt-0.5 print:text-black/80">Total Muatan: <span className="font-bold text-white print:text-black">{selectedDO.total_packages} Koli</span></p>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-white/10 print:border-black/20 grid grid-cols-3 text-center text-[10px] text-slate-500 print:text-black/60">
                <div>
                  <span>Pengirim (Gudang)</span>
                  <div className="h-10"></div>
                  <span className="text-slate-300 print:text-black font-semibold">( Administrator )</span>
                </div>
                <div>
                  <span>Sopir / Kurir</span>
                  <div className="h-10"></div>
                  <span className="text-slate-300 print:text-black font-semibold">( {selectedDO.driver.split('(')[0]} )</span>
                </div>
                <div>
                  <span>Penerima Klien</span>
                  <div className="h-10"></div>
                  <span className="text-slate-300 print:text-black font-semibold">( ........................ )</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <Button variant="secondary" onClick={() => setIsPrintOpen(false)}>Batal</Button>
              <Button variant="secondary" onClick={handleDownloadPDF}>
                <FileText className="w-4 h-4" /> Unduh PDF
              </Button>
              <Button variant="primary" onClick={handlePrintDocument}>
                <Printer className="w-4 h-4" /> Cetak Print DO
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
        title="Hapus Surat Jalan"
        message={`Apakah Anda yakin ingin menghapus Surat Jalan "${selectedDO?.do_no}"?`}
        confirmText="Hapus DO"
      />
    </div>
  );
};

export default DeliveryOrder;
