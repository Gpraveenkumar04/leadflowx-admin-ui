import React from 'react';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="bg-white p-6 rounded shadow z-10 max-w-md w-full">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        {message && <p className="mb-4">{message}</p>}
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
