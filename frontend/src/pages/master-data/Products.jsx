import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, Filter, CheckCircle2, AlertTriangle, Package } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { storageService } from '../../services/storageService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    category: 'Electronics',
    unit: 'PCS',
    stock: 0,
    min_stock: 10,
    max_stock: 100,
    unit_cost: 0,
    sell_price: 0,
    warehouse: 'Jakarta Central DC',
    status: 'Normal',
    description: ''
  });

  const loadData = () => {
    setProducts(storageService.get('products'));
    setCategories(storageService.get('categories'));
    setUnits(storageService.get('units'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormData({
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      barcode: `899${Date.now().toString().slice(-7)}`,
      name: '',
      category: categories[0]?.name || 'Electronics',
      unit: units[0]?.code || 'PCS',
      stock: 0,
      min_stock: 10,
      max_stock: 100,
      unit_cost: 0,
      sell_price: 0,
      warehouse: 'Jakarta Central DC',
      status: 'Normal',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setSelectedProduct(prod);
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (prod) => {
    setSelectedProduct(prod);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (prod) => {
    setSelectedProduct(prod);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stockNum = Number(formData.stock);
    const minStockNum = Number(formData.min_stock);
    const calculatedStatus = stockNum <= minStockNum ? 'Low Stock' : 'Normal';

    const payload = {
      ...formData,
      stock: stockNum,
      min_stock: minStockNum,
      max_stock: Number(formData.max_stock),
      unit_cost: Number(formData.unit_cost),
      sell_price: Number(formData.sell_price),
      status: calculatedStatus
    };

    if (selectedProduct) {
      storageService.update('products', selectedProduct.id, payload);
      showToast(`Produk "${payload.name}" berhasil diperbarui.`);
    } else {
      storageService.create('products', payload);
      showToast(`Produk "${payload.name}" berhasil ditambahkan.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      storageService.delete('products', selectedProduct.id);
      showToast(`Produk "${selectedProduct.name}" telah dihapus.`);
      loadData();
    }
    setIsDeleteOpen(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <Package className="w-7 h-7 text-cyan-400" />
            Master Produk & Katalog SKU
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kelola data inventaris produk, batas minimum stok, harga pokok & jual</p>
        </div>
        <Button icon={Plus} variant="primary" onClick={handleOpenAdd}>
          Tambah Produk Baru
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan SKU, Barcode, atau Nama Produk..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">SKU / Barcode</th>
                <th className="px-4 py-3.5">Nama Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Satuan</th>
                <th className="px-4 py-3.5 text-right">Stok Fisik</th>
                <th className="px-4 py-3.5 text-right">Min Stok</th>
                <th className="px-4 py-3.5 text-right">Harga Pokok</th>
                <th className="px-4 py-3.5 text-right">Harga Jual</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data produk yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono text-cyan-400 font-bold block">{p.sku}</span>
                      <span className="font-mono text-[10px] text-slate-500">{p.barcode}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-100 max-w-xs truncate">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{p.unit}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white">{p.stock}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">{p.min_stock}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">{formatCurrency(p.unit_cost || 0)}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">{formatCurrency(p.sell_price || 0)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(p)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          title="Lihat Rincian"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(p)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                          title="Hapus Produk"
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

      {/* CRUD Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? `Edit Produk: ${selectedProduct.sku}` : 'Tambah Master Produk Baru'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Produk *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barcode / EAN</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Produk Lengkap *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Satuan Dasar *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {units.map(u => (
                  <option key={u.id} value={u.code}>{u.name} ({u.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stok Awal Fisik</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum Stok (ROP)</label>
              <input
                type="number"
                min="0"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Maksimum Kapasitas</label>
              <input
                type="number"
                min="0"
                value={formData.max_stock}
                onChange={(e) => setFormData({ ...formData, max_stock: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Beli / Pokok (Rp)</label>
              <input
                type="number"
                min="0"
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Jual Satuan (Rp)</label>
              <input
                type="number"
                min="0"
                value={formData.sell_price}
                onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
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
                <option value="Jakarta Central DC">Jakarta Central DC</option>
                <option value="Surabaya Distribution Hub">Surabaya Distribution Hub</option>
                <option value="Bandung Transit WH">Bandung Transit WH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Spesifikasi & Deskripsi Produk</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[#090f1d] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary">
              {selectedProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Detail Produk: ${selectedProduct.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#090f1d] border border-white/[0.05]">
              <div>
                <span className="text-slate-500 block">SKU Code:</span>
                <span className="font-mono font-bold text-cyan-400">{selectedProduct.sku}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Barcode / EAN:</span>
                <span className="font-mono text-slate-200">{selectedProduct.barcode || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Kategori:</span>
                <span className="font-semibold text-slate-200">{selectedProduct.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Satuan Dasar:</span>
                <span className="font-semibold text-slate-200">{selectedProduct.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Stok Saat Ini:</span>
                <span className="font-mono font-bold text-white text-sm">{selectedProduct.stock} {selectedProduct.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Minimum Stok (ROP):</span>
                <span className="font-mono text-slate-300">{selectedProduct.min_stock} {selectedProduct.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Harga Pokok (Cost):</span>
                <span className="font-mono text-slate-300">{formatCurrency(selectedProduct.unit_cost || 0)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Harga Jual (Sell):</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(selectedProduct.sell_price || 0)}</span>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="p-3 rounded-xl bg-[#090f1d]/60 border border-white/[0.05]">
                <span className="text-slate-500 block mb-1">Deskripsi / Spesifikasi:</span>
                <p className="text-slate-300 leading-relaxed">{selectedProduct.description}</p>
              </div>
            )}

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
        title="Hapus Produk Master"
        message={`Apakah Anda yakin ingin menghapus produk "${selectedProduct?.name}" (${selectedProduct?.sku})? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Produk"
      />
    </div>
  );
};

export default Products;
