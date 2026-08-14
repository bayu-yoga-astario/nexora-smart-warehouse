import React from 'react';

export const DataTable = ({ columns, data, loading = false, emptyMessage = 'Belum ada data tersedia' }) => {
  if (loading) {
    return (
      <div className="w-full bg-[#0d1627] rounded-2xl p-12 text-center text-slate-400 border border-white/[0.08]">
        <div className="animate-spin w-7 h-7 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-3"></div>
        <span className="text-xs font-medium text-slate-400">Memuat data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-[#0d1627] rounded-2xl p-12 text-center text-slate-400 border border-white/[0.08] text-xs">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-[#0d1627] border border-white/[0.08] shadow-xl">
      <table className="w-full text-left border-collapse nexora-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className || ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-white/[0.03] transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={col.cellClassName || ''}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
