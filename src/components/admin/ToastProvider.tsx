"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message?: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message: message || "An unknown error occurred", type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-3.5 rounded-lg shadow-2xl border backdrop-blur-xl flex items-center justify-between font-mono text-xs transition-all animate-in slide-in-from-bottom-2 duration-150 ${
              t.type === "success"
                ? "bg-[#0c1611]/95 border-emerald-500/40 text-emerald-300"
                : t.type === "error"
                ? "bg-[#180d0d]/95 border-red-500/40 text-red-300"
                : "bg-[#111116]/95 border-white/20 text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                t.type === "success" ? "bg-emerald-400 animate-pulse" : t.type === "error" ? "bg-red-500 animate-ping" : "bg-zinc-400"
              }`} />
              <span className="truncate">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 text-sm leading-none shrink-0"
              title="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
