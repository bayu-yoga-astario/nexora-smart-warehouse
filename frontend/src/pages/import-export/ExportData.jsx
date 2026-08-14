import React, { useState } from 'react';
import {
  Download, Database, FileSpreadsheet, FileText, CheckCircle2,
  Package, History, ShoppingCart, Users, Truck
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const ExportData = () => {
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const exportTableToCSV = (key, filename) => {
    const data = storageService.get(key);
    if (!data || data.length === 0) {
      showToast(`Tabel ${key} tidak memiliki data untuk diekspor.`, true);
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map(item =>
      headers.map(h => `"${(item[h] !== undefined && item[h] !== null ? item[h] : '').toString().replace(/"/g, '""')}"`).join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    storageService.logAudit('EXPORT', 'IMPORT_EXPORT', `Ekspor dataset ${filename} ke CSV`);
    showToast(`Dataset ${filename} berhasil diunduh dalam format CSV.`);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-semibold shadow-2xl backdrop-blur-xl animate-scale-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Download className="w-7 h-7 text-cyan-400" />
          Pusat Ekspor Data Perusahaan (Export Center)
        </h1>
        <p className="text-xs text-slate-400 mt-1">Unduh snapshot database operasional lengkap dalam format CSV/Excel untuk pelaporan eksekutif</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Master Produk & Inventaris</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snapshot lengkap seluruh data katalog SKU, harga pokok, harga jual, stok fisik, dan nilai total valuasi.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('products', 'NEXORA_Master_Products')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh CSV Produk
          </button>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Log Mutasi & Pergerakan Stok</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rekam jejak seluruh transaksi barang masuk (inbound), keluar (outbound), mutasi transfer, dan koreksi opname.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('stockMovements', 'NEXORA_Stock_Movements')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh CSV Mutasi
          </button>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Buku Pengadaan & Purchase Order</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data PO vendor rekanan, status penerimaan barang, termin pembayaran, dan nilai tagihan procurement.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('purchaseOrders', 'NEXORA_Purchase_Orders')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh CSV PO
          </button>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Surat Jalan & Delivery Order</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manifest pelepasan armada, data kirim ke pelanggan, nomor resi kurir, dan status penerimaan di lokasi.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('deliveryOrders', 'NEXORA_Delivery_Orders')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh CSV DO
          </button>
        </div>

        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl hover:border-cyan-500/30 transition flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Master Vendor & Pelanggan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Daftar kontak supplier rekanan dan klien B2B, alamat pengiriman, nomor telepon, dan status kemitraan.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('suppliers', 'NEXORA_Suppliers_Directory')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Unduh CSV Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
