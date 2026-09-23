"use client";

import React from 'react';
import { motion } from 'framer-motion';

const data = [45, 62, 58, 75, 90, 82, 95, 100, 88, 72, 65, 80];
const labels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00"];

export function ThroughputChart() {
  const max = Math.max(...data);

  return (
    <div className="glass-elegant rounded-[2.5rem] p-10 h-full flex flex-col border border-white/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h4 className="text-xl font-bold text-white tracking-tight">Rendimiento Histórico</h4>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Paquetes procesados (ult. 12h)</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-industrial-accent tracking-tighter">18.5k</span>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Pico Máx.</p>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-1 h-48 mb-6">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group gap-2 h-full justify-end">
            <div className="relative w-full h-full flex items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(val / max) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 1, ease: "easeOut" }}
                className="w-full max-w-[12px] rounded-t-full bg-gradient-to-t from-industrial-accent/20 to-industrial-accent relative group-hover:from-industrial-status/20 group-hover:to-industrial-status transition-all duration-300"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}%
                </div>
              </motion.div>
            </div>
            <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter rotate-45 md:rotate-0">{labels[i]}</span>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-industrial-accent" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Optimizado</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-30">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Inactivo</span>
          </div>
        </div>
        <button className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
          Exportar Log
        </button>
      </div>
    </div>
  );
}
