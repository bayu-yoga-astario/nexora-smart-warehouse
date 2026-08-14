import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Konfirmasi Tindakan', message, confirmText = 'Hapus', type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20 flex-shrink-0 shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-white/[0.06]">
        <Button variant="secondary" size="sm" onClick={onClose}>Batal</Button>
        <Button variant={type} size="sm" onClick={onConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  );
};
