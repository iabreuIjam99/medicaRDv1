import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Stethoscope,
  X,
  XCircle,
} from 'lucide-react';
import { AppointmentStatus, ToastMessage } from '../../types/medical';

interface SafeImageProps {
  src?: string;
  alt: string;
  fallbackInitials?: string;
  className?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackInitials,
  className = '',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-[#E8F1F5] text-[#0F3D5E] select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackInitials ? (
          <span className="font-display text-lg font-semibold tracking-tight">
            {fallbackInitials}
          </span>
        ) : (
          <Stethoscope className="h-8 w-8 text-[#0F3D5E]/60" aria-hidden="true" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export function StatusIndicator({ status }: { status: AppointmentStatus }) {
  const config: Record<
    AppointmentStatus,
    { label: string; colorClass: string; icon: React.ReactNode }
  > = {
    confirmada: {
      label: 'Confirmada',
      colorClass: 'text-[#15803D]',
      icon: <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    pendiente: {
      label: 'Pendiente',
      colorClass: 'text-[#B45309]',
      icon: <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    completada: {
      label: 'Completada',
      colorClass: 'text-[#0F3D5E]',
      icon: <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    cancelada: {
      label: 'Cancelada',
      colorClass: 'text-[#B91C1C]',
      icon: <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
  };

  const current = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${current.colorClass}`}>
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}

interface ModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidthClass = 'max-w-lg',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthClass} rounded-xl border border-slate-200 bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="modal-heading"
              className="font-display text-lg font-semibold tracking-tight text-slate-900"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2.5 sm:right-6 sm:bottom-6"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />,
          error: <AlertCircle className="h-5 w-5 shrink-0 text-[#B91C1C]" aria-hidden="true" />,
          info: <Info className="h-5 w-5 shrink-0 text-[#0F3D5E]" aria-hidden="true" />,
        };

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
          >
            <div className="mt-0.5">{iconMap[toast.type]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return (
    <div className="divide-y divide-slate-200" aria-busy="true" aria-label="Cargando registros">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-12 items-center gap-4 px-5 py-3.5">
          <div className="col-span-3 h-4 animate-pulse rounded bg-slate-200/80" />
          <div className="col-span-3 h-4 animate-pulse rounded bg-slate-200/70" />
          <div className="col-span-2 h-4 animate-pulse rounded bg-slate-200/70" />
          <div className="col-span-2 h-4 animate-pulse rounded bg-slate-200/70" />
          <div className="col-span-2 h-4 animate-pulse rounded bg-slate-200/60" />
        </div>
      ))}
    </div>
  );
}
