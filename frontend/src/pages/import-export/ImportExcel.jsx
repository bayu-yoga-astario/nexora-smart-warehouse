import React, { useState } from 'react';
import {
  Upload, FileSpreadsheet, Download, CheckCircle2,
  AlertTriangle, FileUp, Check, ArrowRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const ImportExcel = () => {
  const [toastMsg, setToastMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const downloadSampleTemplate = (type) => {
    let headers = [];
    let sampleRows = [];
    let filename = 'Template';

    if (type === 'products') {
      filename = 'NEXORA_Template_Products';
      headers = ['sku', 'name', 'category', 'unit', 'cost_price', 'selling_price', 'stock', 'min_stock', 'warehouse', 'location'];
      sampleRows = [
        ['ELC-SAMPLE-01', 'Microcontroller MCU V2', 'Elektronik & Semikonduktor', 'Pcs', '45000', '75000', '150', '20', 'Jakarta Central DC', 'A-01-01'],
        ['RAW-SAMPLE-02', 'Baja Profil Steel Bar 10mm', 'Bahan Baku & Logam', 'Kg', '25000', '35000', '500', '50', 'Jakarta Central DC', 'B-02-01']
      ];
    } else if (type === 'suppliers') {
      filename = 'NEXORA_Template_Suppliers';
      headers = ['code', 'name', 'contact_person', 'email', 'phone', 'category', 'status'];
      sampleRows = [
        ['SUP-IMP-01', 'PT Contoh Komponen Sukses', 'Budi Santoso', 'budi@contoh.com', '08123456789', 'Elektronik', 'Active']
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Template ${filename}.csv berhasil diunduh.`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          showToast('File CSV kosong atau tidak valid.', true);
          setIsProcessing(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const newProducts = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const item = {};
          headers.forEach((h, idx) => {
            item[h] = values[idx] || '';
          });

          if (item.name || item.sku) {
            newProducts.push({
              sku: item.sku || `SKU-IMP-${Date.now().toString().slice(-4)}`,
              name: item.name || 'Produk Impor Baru',
              category: item.category || 'Elektronik & Semikonduktor',
              unit: item.unit || 'Pcs',
              cost_price: Number(item.cost_price) || 50000,
              selling_price: Number(item.selling_price) || 80000,
              stock: Number(item.stock) || 10,
              min_stock: Number(item.min_stock) || 5,
              warehouse: item.warehouse || 'Jakarta Central DC',
              location: item.location || 'A-01',
              status: 'In Stock'
            });
          }
        }

        // Check existing products to prevent duplication
        const existingProducts = storageService.get('products') || [];
        let importedCount = 0;
        let updatedCount = 0;

        newProducts.forEach(p => {
          const existing = existingProducts.find(ep => ep.sku === p.sku);
          if (existing) {
            storageService.update('products', existing.id, p);
            updatedCount++;
          } else {
            storageService.create('products', p);
            importedCount++;
          }
        });
        
        storageService.logAudit('IMPORT_BATCH', 'IMPORT_EXPORT', `Berhasil mengimpor/update ${newProducts.length} produk dari file ${file.name}`);

        setImportStats({
          filename: file.name,
          count: newProducts.length,
          time: new Date().toLocaleTimeString()
        });

        showToast(`Berhasil! ${importedCount} data baru masuk, ${updatedCount} data diperbarui dari ${file.name}!`);
      } catch (err) {
        showToast('Gagal memproses file. Pastikan format CSV sesuai.', true);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
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
          <Upload className="w-7 h-7 text-cyan-400" />
          Impor Data Massal Excel & CSV (Bulk Ingestion)
        </h1>
        <p className="text-xs text-slate-400 mt-1">Unggah file CSV/Excel untuk memperbarui katalog produk, stok awal gudang, atau data vendor secara instan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Upload File CSV / Excel
          </h3>

          <label className="border-2 border-dashed border-white/20 hover:border-cyan-500/50 rounded-2xl p-8 text-center transition cursor-pointer bg-[#090f1d] block relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-semibold text-white">Klik atau Tarik File CSV ke sini</p>
            <p className="text-xs text-slate-400 mt-1">Mendukung format CSV & Text Delimited (Maks. 25MB)</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-cyan-500/30">
              <FileUp className="w-4 h-4" /> Pilih File dari Komputer
            </div>
          </label>

          {importStats && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Impor Berhasil Selesai!
              </span>
              <p>File: <strong className="text-white">{importStats.filename}</strong></p>
              <p>Total Data Masuk: <strong className="text-white">{importStats.count} SKU Produk</strong></p>
            </div>
          )}
        </div>

        {/* Template Card */}
        <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" /> Unduh Format Template Standar
          </h3>
          <p className="text-xs text-slate-400">
            Pastikan susunan kolom pada spreadsheet Anda sama persis dengan contoh template di bawah sebelum melakukan upload:
          </p>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => downloadSampleTemplate('products')}
              className="w-full p-3.5 rounded-xl bg-[#090f1d] hover:bg-slate-800 border border-white/[0.06] text-slate-200 flex justify-between items-center transition group"
            >
              <div>
                <span className="font-semibold text-white block">Template Master Produk (.csv)</span>
                <span className="text-[11px] text-slate-500">Kolom SKU, Nama, Kategori, Satuan, Harga, Stok</span>
              </div>
              <Download className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition" />
            </button>

            <button
              onClick={() => downloadSampleTemplate('suppliers')}
              className="w-full p-3.5 rounded-xl bg-[#090f1d] hover:bg-slate-800 border border-white/[0.06] text-slate-200 flex justify-between items-center transition group"
            >
              <div>
                <span className="font-semibold text-white block">Template Vendor & Rekanan Supplier (.csv)</span>
                <span className="text-[11px] text-slate-500">Kolom Kode, Nama PT, Kontak PIC, Email, Telp</span>
              </div>
              <Download className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExcel;
