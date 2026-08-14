import React from 'react';

export const StatusBadge = ({ status, text }) => {
  const statusStr = String(status || '').toUpperCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-white/[0.08]';
  let dotColor = 'bg-slate-400';

  if (['ACTIVE', 'COMPLETED', 'APPROVED', 'NORMAL', 'EXCELLENT', 'INBOUND', 'DELIVERED', 'READY FOR DISPATCH'].includes(statusStr)) {
    styles = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
    dotColor = 'bg-emerald-400';
  } else if (['PENDING', 'LOW STOCK', 'MEDIUM', 'WARNING', 'OUTBOUND', 'IN PROGRESS', 'PACKING', 'PREPARING', 'STAGED'].includes(statusStr)) {
    styles = 'bg-amber-500/10 text-amber-300 border-amber-500/25';
    dotColor = 'bg-amber-400';
  } else if (['HIGH', 'CRITICAL', 'OUT OF STOCK', 'REJECTED', 'CRITICAL_SLOW', 'CANCELLED', 'URGENT'].includes(statusStr)) {
    styles = 'bg-rose-500/10 text-rose-300 border-rose-500/25';
    dotColor = 'bg-rose-400';
  } else if (['IN TRANSIT', 'DISPATCHED', 'SHIPPED'].includes(statusStr)) {
    styles = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25';
    dotColor = 'bg-cyan-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {text || status}
    </span>
  );
};
