import React, { useEffect, useRef } from 'react';
import { t } from '@/i18n';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  disableConfirm?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  disableConfirm = false,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const titleId = ariaLabelledBy || (title ? 'confirm-dialog-title' : undefined);
  const descId = ariaDescribedBy || (message ? 'confirm-dialog-desc' : undefined);

  useEffect(() => {
    if (open) {
      // focus confirm button when dialog opens for quick keyboard access
      confirmRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && !disableConfirm) {
        // avoid double-invoking when a focused button will also receive the Enter key
        const active = document.activeElement as HTMLElement | null;
        const tag = active?.tagName?.toLowerCase();
        if (tag === 'button' || tag === 'a' || tag === 'input' || tag === 'textarea') return;
        onConfirm();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm, disableConfirm]);

  if (!open) return null;

  const confirmClass = variant === 'danger' ? 'btn-danger btn-sm' : 'btn-primary btn-sm';

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="bg-white p-6 rounded shadow z-10 max-w-md w-full">
        {title && <h3 id={titleId} className="text-lg font-semibold mb-2">{title}</h3>}
        {message && <p id={descId} className="mb-4">{message}</p>}
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onCancel}>{cancelLabel ?? t('confirm.cancel')}</button>
          <button ref={confirmRef} className={confirmClass} onClick={onConfirm} disabled={disableConfirm}>{confirmLabel ?? t('confirm.confirm')}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
