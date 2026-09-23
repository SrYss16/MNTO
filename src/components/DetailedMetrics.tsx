"use client";

import React from 'react';
import { 
  Battery, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  Network, 
  Settings2, 
  Wrench, 
  Users,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const metrics = [
  { id: 1, val: "24 horas", label: "La máquina está activa todo el día", icon: Battery, color: "text-zinc-500" },
  { id: 2, val: "16000pak", label: "La producción máxima por hora", icon: TrendingUp, color: "text-zinc-500" },
  { id: 3, val: "1500pak", label: "La producción mínima por persona", icon: TrendingDown, color: "text-zinc-500" },
  { id: 4, val: "0,08%", label: "De errores", icon: Sliders, color: "text-zinc-500" },
  { id: 5, val: "100%", label: "Funcionamiento producción", icon: Network, color: "text-zinc-500" },
  { id: 6, val: "0,35%", label: "Mantenimiento diario", icon: Settings2, color: "text-zinc-500" },
  { id: 7, val: "0,005%", label: "Averías que requieren uso de herramientas", icon: Wrench, color: "text-zinc-500" },
  { id: 8, val: "0,03%", label: "Intervención de técnicos VL", icon: Users, color: "text-zinc-500" },
];

export function DetailedMetrics() {
  return (
    <div className="glass-elegant rounded-[3rem] p-10 md:p-14 border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-industrial-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <div className="relative z-10 space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Info className="w-5 h-5 text-industrial-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight leading-none">Rendimiento Técnico</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Porcentajes de producción y errores</p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
            Corte: 24h
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-12 gap-x-8">
          {metrics.map((m, i) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col items-center text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-industrial-accent/10 group-hover:text-industrial-accent group-hover:border-industrial-accent/20 transition-all duration-300">
                <m.icon className="w-8 h-8 stroke-[1.5]" />
              </div>
              
              <div className="space-y-2 px-2">
                <span className="text-xl font-bold text-industrial-accent tracking-tighter block">{m.val}</span>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.15em] leading-[1.6] transition-colors group-hover:text-zinc-300">
                  {m.label}
                </p>
              </div>
              
              {/* Divider element for visual structure */}
              {i % 4 !== 3 && (
                <div className="hidden lg:block absolute h-full w-px bg-white/5 right-0 top-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Visual background structural lines like the reference */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none opacity-20 px-14 lg:px-20 py-20">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
      </div>
    </div>
  );
}
