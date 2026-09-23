"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { machines } from '@/lib/data-maquinas';
import { ChevronRight, ArrowRight, Activity, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MaquinasPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Sistemas de Clasificación</h1>
          <p className="text-zinc-500 font-medium max-w-lg">Monitorización técnica y documentación estructural de los Sorters activos en planta.</p>
        </motion.div>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5">
          <Activity className="w-4 h-4 text-industrial-accent" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">3 Sistemas Operativos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {machines.map((machine, i) => (
          <motion.div
            key={machine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={`/maquinas/${machine.id}`}
              className="group block"
            >
              <div className="glass-elegant overflow-hidden rounded-[2.5rem] transition-all duration-500 group-hover:border-industrial-accent/50 group-hover:-translate-y-2">
                <div className="aspect-[16/11] relative overflow-hidden">
                  <Image 
                    src={machine.image} 
                    alt={machine.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C3539] via-[#2C3539]/20 to-transparent" />
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all group-hover:bg-industrial-accent group-hover:shadow-lg">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-industrial-accent text-white text-[10px] font-bold uppercase tracking-widest shadow-xl">
                      <Cpu className="w-3 h-3" />
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-industrial-accent transition-colors">
                    {machine.name}
                  </h3>
                  <p className="text-zinc-500 line-clamp-2 text-sm leading-relaxed mb-8 font-medium">
                    {machine.description}
                  </p>
                  
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 group/btn">
                      <span className="text-[10px] font-bold text-industrial-accent uppercase tracking-[0.2em]">Manual Técnico</span>
                      <ArrowRight className="w-4 h-4 text-industrial-accent transition-transform group-hover/btn:translate-x-1" />
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((dot) => (
                        <div key={dot} className={cn(
                          "w-1 h-1 rounded-full transition-all duration-500",
                          dot === 1 ? "bg-industrial-accent w-4" : "bg-zinc-800"
                        )} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
