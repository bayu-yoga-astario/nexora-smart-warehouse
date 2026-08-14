import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full ${maxWidth} bg-[#0c1424] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden border border-white/[0.1] transform transition-all animate-scale-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#090f1d]/90">
          <h3 className="text-base font-bold text-slate-100 tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
