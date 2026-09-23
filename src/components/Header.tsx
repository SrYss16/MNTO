"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Search, Circle, X, HardHat, AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { machines } from '@/lib/data-maquinas';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // Close overlays on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  const filteredMachines = searchQuery 
    ? machines.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const notifications = [
    { id: 1, title: 'Alerta de Mantenimiento', desc: 'Compax Sorter requiere revisión de pasadores en 48h.', type: 'alert', time: 'Hace 10 min' },
    { id: 2, title: 'Sistema Sincronizado', desc: 'FSC ha completado el escaneo de protocolos con éxito.', type: 'info', time: 'Hace 1 hora' },
    { id: 3, title: 'Nuevo Manual', desc: 'Se ha subido la versión 2.4 del manual técnico de Mailbox.', type: 'update', time: 'Hace 3 horas' },
  ];

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-[60] px-4 md:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-elegant h-14 rounded-2xl px-6 pointer-events-auto transition-all hover:border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-industrial-accent to-[#b06a21] flex items-center justify-center font-bold text-white text-xs shadow-lg">
              C
            </div>
            <h1 className="text-sm font-bold tracking-[0.2em] text-white hidden sm:block">
              CACESA <span className="text-zinc-500 font-medium">INDUSTRIAL</span>
            </h1>
            <h1 className="text-sm font-bold tracking-[0.2em] text-white sm:hidden uppercase">
              Maint <span className="text-industrial-accent">PWA</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-industrial-status/5 border border-industrial-status/10">
              <Circle className="w-1.5 h-1.5 fill-industrial-status text-industrial-status animate-pulse" />
              <span className="text-[10px] font-bold text-industrial-status uppercase tracking-widest">Planta Activa</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-industrial-accent rounded-full border border-[#2C3539]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1c2225]/90 backdrop-blur-2xl flex flex-col items-center pt-32 px-4"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-10 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full max-w-2xl space-y-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="BUSCAR MÁQUINA O SISTEMA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-industrial-accent/50 transition-all uppercase tracking-widest"
                />
              </div>

              <div className="space-y-4">
                {filteredMachines.length > 0 ? (
                  filteredMachines.map(m => (
                    <Link 
                      key={m.id} 
                      href={`/maquinas/${m.id}`}
                      className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-industrial-accent/30 hover:bg-industrial-accent/5 transition-all group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden relative">
                           {/* Small image preview could go here */}
                           <HardHat className="w-6 h-6 text-zinc-600 group-hover:text-industrial-accent transition-colors" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-white uppercase tracking-tighter">{m.name}</p>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{m.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-industrial-accent group-hover:translate-x-2 transition-all" />
                    </Link>
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-20">
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.3em]">Sin resultados para "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {['Sorters', 'Conveyors', 'PLCs', 'Manuales'].map(cat => (
                      <button key={cat} className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-all">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{cat}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Tray */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <div className="fixed inset-0 z-[55]" onClick={() => setIsNotificationsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed top-20 right-4 md:right-8 z-[60] w-full max-w-sm glass-elegant rounded-3xl border border-white/10 shadow-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Centro de Alertas</h3>
                <span className="px-2 py-1 rounded-md bg-industrial-accent/20 text-industrial-accent text-[8px] font-black uppercase tracking-widest">3 Nuevas</span>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto detail-scrollbar">
                {notifications.map(n => (
                  <div key={n.id} className="p-6 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        n.type === 'alert' ? "bg-red-500/10 text-red-500" : "bg-industrial-accent/10 text-industrial-accent"
                      )}>
                        {n.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white uppercase tracking-tight">{n.title}</p>
                          <span className="text-[8px] text-zinc-600 font-bold uppercase">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{n.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full p-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
                Ver todo el historial
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
