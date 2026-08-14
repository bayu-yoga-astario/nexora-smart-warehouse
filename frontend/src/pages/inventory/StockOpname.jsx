import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Plus, Edit2, Trash2, Search, CheckCircle2,
  AlertTriangle, RefreshCw, Check, ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { storageService } from '../../services/storageService';

const StockOpname = () => {
  const [opnameList, setOpnameList] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOpname, setSelectedOpname] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    opname_no: '',
    productId: '',
    sku: '',
    product_name: '',
    warehouse: 'Jakarta Central DC',
    zone: 'Zone A - Electronics',
    system_qty: 15,
    actual_qty: 15,
    discrepancy: 0,
    status: 'In Progress',
    auditor: 'Ahmad Subagyo',
    notes: ''
  });

  const loadData = () => {
    setOpnameList(storageService.get('stockOpname'));
    const prods = storageService.get('products');
    setProducts(prods);
    const whs = storageService.get('warehouses');
    setWarehouses(whs);

    if (prods.length > 0 && !formData.productId) {
      setFormData(prev => ({
        ...prev,
        productId: prods[0].id,
        sku: prods[0].sku,
        product_name: prods[0].name,
        system_qty: prods[0].stock,
        actual_qty: prods[0].stock,
        discrepancy: 0
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
    setSelectedOpname(null);
    const defaultProd = products[0] || { id: 1, sku: 'SKU-001', name: 'Barang', stock: 10 };
    setFormData({
      opname_no: `OPN-${Date.now().toString().slice(-6)}`,
      productId: defaultProd.id,
      sku: defaultProd.sku,
      product_name: defaultProd.name,
      warehouse: warehouses[0]?.name || 'Jakarta Central DC',
      zone: 'Zone A - Fast Moving',
      system_qty: defaultProd.stock,
      actual_qty: defaultProd.stock,
      discrepancy: 0,
      status: 'In Progress',
      auditor: 'Ahmad Subagyo',
      notes: 'Pemeriksaan audit fisik stok berkala'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opn) => {
    setSelectedOpname(opn);
    setFormData({ ...opn });
    setIsModalOpen(true);
  };

  const handleProductSelect = (prodId) => {
    const prod = products.find(p => p.id === Number(prodId));
    if (prod) {
      const diff = formData.actual_qty - prod.stock;
      setFormData({
        ...formData,
        productId: prod.id,
        sku: prod.sku,
        product_name: prod.name,
        system_qty: prod.stock,
        discrepancy: diff,
        warehouse: prod.warehouse || formData.warehouse
      });
    }
  };

  const handleActualQtyChange = (val) => {
    const actual = Number(val);
    const diff = actual - formData.system_qty;
    setFormData({
      ...formData,
      actual_qty: actual,
      discrepancy: diff
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      date: new Date().toISOString().slice(0, 10),
      system_qty: Number(formData.system_qty),
      actual_qty: Number(formData.actual_qty),
      discrepancy: Number(formData.discrepancy)
    };

    if (selectedOpname) {
      storageService.update('stockOpname', selectedOpname.id, payload);
      showToast(`Audit opname ${payload.opname_no} berhasil diperbarui.`);
    } else {
      storageService.create('stockOpname', payload);
      showToast(`Audit opname ${payload.opname_no} berhasil dijadwalkan/disimpan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleReconcile = (opn) => {
    const targetProd = products.find(p => p.sku === opn.sku);
    if (targetProd) {
      storageService.update('products', targetProd.id, {
        stock: opn.actual_qty,
        status: opn.actual_qty <= targetProd.min_stock ? 'Low Stock' : 'Normal'
      });

      storageService.create('stockMovements', {
        ref_no: `REC-${opn.opname_no}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        sku: opn.sku,
        product_name: opn.product_name || targetProd.name,
        type: 'ADJUSTMENT',
        qty: opn.discrepancy,
        warehouse: opn.warehouse,
        notes: `Rekonsiliasi Stock Opname ${opn.opname_no} (Selisih: ${opn.discrepancy})`,
        operator: opn.auditor
      });
    }

    storageService.update('stockOpname', opn.id, { status: 'Completed' });
    showToast(`Rekonsiliasi opname ${opn.opname_no} selesai. Stok sistem telah disesuaikan.`);
    loadData();
  };

  const handleDeleteConfirm = () => {
    if (selectedOpname) {
      storageService.delete('stockOpname', selectedOpname.id);
      showToast(`Audit opname ${selectedOpname.opname_no} telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = opnameList.filter(o =>
    o.opname_no?.toLowerCase().includes(search.toLowerCase()) ||
    o.warehouse?.toLowerCase().includes(search.toLowerCase()) ||
    o.auditor?.toLowerCase().includes(search.toLowerCase())
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
            <ClipboardCheck className="w-7 h-7 text-cyan-400" />
            Stock Opname & Audit Fisik
          </h1>
          <p className="text-xs text-slate-400 mt-1">Pemeriksaan fisik stok aktual, verifikasi selisih kuantitas sistem, dan rekonsiliasi otomatis</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Mulai Audit Opname Baru
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari No. Opname, Gudang, atau Nama Auditor..."
          className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
        />
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">No. Opname / Tgl</th>
                <th className="px-4 py-3.5">Gudang & Zona</th>
                <th className="px-4 py-3.5 text-right">Stok Sistem</th>
                <th className="px-4 py-3.5 text-right">Fisik Aktual</th>
                <th className="px-4 py-3.5 text-right">Selisih (Variance)</th>
                <th className="px-4 py-3.5">Auditor</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data stock opname yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-400 block">{o.opname_no}</span>
                      <span className="text-[11px] text-slate-500">{o.date}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-200 block">{o.warehouse}</span>
                      <span className="text-[11px] text-slate-400">{o.zone}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-300">{o.system_qty}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-white">{o.actual_qty}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        o.discrepancy < 0
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : o.discrepancy > 0
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400'
                      }`}>
                        {o.discrepancy > 0 ? `+${o.discrepancy}` : o.discrepancy}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{o.auditor}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {o.status !== 'Completed' && (
                          <button
                            onClick={() => handleReconcile(o)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition text-[10px] font-bold"
                            title="Rekonsiliasi / Sesuaikan Stok"
                          >
                            <Check className="w-3 h-3" />
                            Reconcile
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(o)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedOpname(o); setIsDeleteOpen(true); }}
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
        title={selectedOpname ? `Edit Sesi Opname: ${selectedOpname.opname_no}` : 'Catat Audit Stock Opname Baru'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. Opname *</label>
              <input
                type="text"
                required
                value={formData.opname_no}
                onChange={(e) => setFormData({ ...formData, opname_no: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Sesi</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gudang *</label>
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Zona / Area Gudang</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Produk Sampel Audit</label>
            <select
              value={formData.productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>[{p.sku}] {p.name} (Stok: {p.stock})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#090f1d] border border-white/[0.06]">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Stok Sistem</label>
              <input
                type="number"
                readOnly
                value={formData.system_qty}
                className="w-full px-3 py-2 bg-slate-900 border border-white/[0.05] rounded-xl text-xs text-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cyan-400 mb-1">Hitung Fisik Aktual *</label>
              <input
                type="number"
                min="0"
                required
                value={formData.actual_qty}
                onChange={(e) => handleActualQtyChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-cyan-500/50 rounded-xl text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Selisih (Variance)</label>
              <div className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border text-center ${
                formData.discrepancy < 0 ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : formData.discrepancy > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-400 border-white/[0.05]'
              }`}>
                {formData.discrepancy > 0 ? `+${formData.discrepancy}` : formData.discrepancy}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Auditor / PIC</label>
            <input
              type="text"
              value={formData.auditor}
              onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">Simpan Hasil Opname</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Sesi Opname"
        message={`Apakah Anda yakin ingin menghapus catatan opname "${selectedOpname?.opname_no}"?`}
        confirmText="Hapus Sesi"
      />
    </div>
  );
};

export default StockOpname;
