import React, { useState, useEffect } from 'react';
import {
  FileText, Shield, Clock, Search, Filter, Trash2,
  Download, CheckCircle2, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { storageService } from '../../services/storageService';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [isPurgeOpen, setIsPurgeOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadData = () => {
    setLogs(storageService.get('auditLogs'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handlePurgeConfirm = () => {
    storageService.set('auditLogs', []);
    showToast('Seluruh riwayat log audit telah dibersihkan.');
    loadData();
    setIsPurgeOpen(false);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      showToast('Tidak ada data log untuk diekspor.', true);
      return;
    }
    const headers = ['ID', 'Timestamp', 'User', 'Module', 'Action Detail', 'IP Address', 'Status'];
    const rows = logs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.module}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`,
      l.ip || '127.0.0.1',
      l.status || 'SUCCESS'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXORA_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File log audit (CSV) berhasil diunduh.');
  };

  const modules = ['ALL', ...Array.from(new Set(logs.map(l => l.module).filter(Boolean)))];

  const filtered = logs.filter(l => {
    const matchSearch = l.user?.toLowerCase().includes(search.toLowerCase()) ||
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.module?.toLowerCase().includes(search.toLowerCase());
    const matchMod = moduleFilter === 'ALL' || l.module === moduleFilter;
    return matchSearch && matchMod;
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
            <FileText className="w-7 h-7 text-cyan-400" />
            Log Audit Sistem & Rekam Jejak Keamanan
          </h1>
          <p className="text-xs text-slate-400 mt-1">Perekaman otomatis setiap aksi create, update, delete, approval, dan perubahan konfigurasi sistem</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/[0.08] transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setIsPurgeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Bersihkan Log</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user, aktivitas aksi, atau modul log..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 bg-[#0d1627] border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-400 transition-all"
        >
          {modules.map(m => (
            <option key={m} value={m}>{m === 'ALL' ? 'Semua Modul' : m}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0d1627] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090f1d] text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5">Log ID</th>
                <th className="px-4 py-3.5">Waktu Eksekusi</th>
                <th className="px-4 py-3.5">User Pelaksana</th>
                <th className="px-4 py-3.5">Modul Sistem</th>
                <th className="px-4 py-3.5">Rincian Aktivitas Tindakan</th>
                <th className="px-4 py-3.5">IP Address</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono text-[11px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-sans">
                    Tidak ada catatan log audit yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 text-cyan-400 font-bold">#{l.id}</td>
                    <td className="px-4 py-3.5 text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{l.timestamp}</span>
                    </td>
                    <td className="px-4 py-3.5 font-sans font-semibold text-white">{l.user}</td>
                    <td className="px-4 py-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {l.module}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-sans text-slate-200">{l.action}</td>
                    <td className="px-4 py-3.5 text-slate-500">{l.ip || '127.0.0.1'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {l.status || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purge Confirm Dialog */}
      <ConfirmDialog
        isOpen={isPurgeOpen}
        onClose={() => setIsPurgeOpen(false)}
        onConfirm={handlePurgeConfirm}
        title="Bersihkan Semua Log Audit"
        message="Apakah Anda yakin ingin menghapus seluruh rekaman log audit keamanan? Data log yang terhapus tidak dapat dikembalikan."
        confirmText="Hapus Semua Log"
      />
    </div>
  );
};

export default AuditLogs;
