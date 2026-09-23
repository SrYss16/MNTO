"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'info' | 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToasterContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function useToaster() {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
}

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "pointer-events-auto flex items-center justify-between p-4 rounded-2xl glass-elegant border shadow-2xl overflow-hidden relative group",
                t.type === 'success' ? "border-industrial-status/30 bg-industrial-status/10" :
                t.type === 'error' ? "border-red-500/30 bg-red-500/10" :
                "border-industrial-accent/30 bg-industrial-accent/10"
              )}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-industrial-accent" 
                style={{ backgroundColor: t.type === 'success' ? '#00E676' : t.type === 'error' ? '#ef4444' : '#D37D28' }}
              />
              
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  t.type === 'success' ? "bg-industrial-status/20 text-industrial-status" :
                  t.type === 'error' ? "bg-red-500/20 text-red-500" :
                  "bg-industrial-accent/20 text-industrial-accent"
                )}>
                  {t.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                   t.type === 'error' ? <AlertCircle className="w-5 h-5" /> : 
                   <Info className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">{t.type}</p>
                  <p className="text-sm text-zinc-300 font-medium leading-tight mt-0.5">{t.message}</p>
                </div>
              </div>

              <button 
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToasterContext.Provider>
  );
}
