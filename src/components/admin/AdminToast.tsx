'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (title: string, options?: { type?: ToastType; description?: string; duration?: number }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useAdminToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, options?: { type?: ToastType; description?: string; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = {
        id,
        title,
        type: options?.type || 'info',
        description: options?.description,
      };

      setToasts((prev) => [...prev, newToast]);

      const duration = options?.duration ?? 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => toast(title, { type: 'success', description }),
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => toast(title, { type: 'error', description, duration: 6000 }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}

      {/* Floating notification container */}
      <div
        aria-live="assertive"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-2 ${
                isSuccess
                  ? 'bg-[#061A14]/90 border-[#10B981]/30 text-slate-100 shadow-[#10B981]/10'
                  : isError
                  ? 'bg-[#1C0A0E]/90 border-[#F43F5E]/30 text-slate-100 shadow-[#F43F5E]/10'
                  : isWarning
                  ? 'bg-[#1C1405]/90 border-[#F59E0B]/30 text-slate-100 shadow-[#F59E0B]/10'
                  : 'bg-[#0A0E17]/90 border-[#00F2FE]/30 text-slate-100 shadow-[#00F2FE]/10'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                {isError && <XCircle className="w-5 h-5 text-[#F43F5E]" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-[#00F2FE]" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white tracking-tight">{t.title}</h4>
                {t.description && (
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{t.description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
