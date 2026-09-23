"use client";

import React, { useState } from 'react';
import { componentsData } from '@/lib/data-diccionario';
import { 
  Search, 
  ChevronRight, 
  Book, 
  Cpu, 
  Zap, 
  Activity, 
  Info,
  X,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DiccionarioPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof componentsData[0] | null>(null);

  const filtered = componentsData.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
            <Book className="w-3.5 h-3.5 text-industrial-accent" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base de Conocimiento</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Diccionario Técnico</h1>
          <p className="text-zinc-500 font-medium max-w-lg">Glosario especializado de componentes electromecánicos y sistemas de control para técnicos CACESA.</p>
        </motion.div>
        
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 transition-colors group-focus-within:text-industrial-accent" />
          <input 
            type="text" 
            placeholder="Buscar componente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-industrial-accent/20 focus:border-industrial-accent/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(item)}
            className="glass-elegant p-6 rounded-[2rem] flex items-center gap-6 group hover:border-industrial-accent/40 hover:-translate-x-1 transition-all text-left"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-industrial-accent group-hover:bg-industrial-accent/10 transition-all">
              <Cpu className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-industrial-accent transition-colors">
                {item.name}
              </h3>
              <p className="text-zinc-500 text-xs font-medium line-clamp-1 mt-1">{item.description}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-zinc-600 group-hover:text-industrial-accent transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Side-Sheet Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '101%' }}
              animate={{ x: 0 }}
              exit={{ x: '101%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-4 top-4 bottom-4 w-full md:w-[500px] z-[70] glass-elegant rounded-[3rem] p-10 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="w-16 h-16 rounded-2xl bg-industrial-accent/10 flex items-center justify-center text-industrial-accent">
                  <Cpu className="w-8 h-8" />
                </div>
                <button 
                  onClick={() => setSelected(null)}
                  className="p-3 rounded-2xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar pr-2">
                <div>
                  <h2 className="text-4xl font-bold text-white tracking-tight mb-4">{selected.name}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-industrial-accent/10 text-industrial-accent rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                    Componente Crítico
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Descripción
                  </h4>
                  <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                    {selected.description}
                  </p>
                </div>

                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 space-y-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Settings className="w-4 h-4 text-industrial-accent" />
                    Parámetros Manual
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Categoría', val: selected.category },
                      { label: 'Ubicación', val: selected.location },
                      { label: 'Mantenimiento', val: selected.maintenanceInterval }
                    ].map(p => (
                      <div key={p.label} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500 text-xs font-semibold">{p.label}</span>
                        <span className="text-white text-xs font-bold text-right pl-4">{p.val}</span>
                      </div>
                    ))}
                  </div>

                  {selected.technicalSpecs && selected.technicalSpecs.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Especificaciones Técnicas</h5>
                      <ul className="space-y-2">
                        {selected.technicalSpecs.map((spec, idx) => (
                          <li key={idx} className="text-xs font-medium text-zinc-300 flex items-start gap-2">
                            <span className="text-industrial-accent block mt-1">•</span>
                            <span className="flex-1">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {selected.safetyNotes && (
                  <div className="p-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20">
                    <h5 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Advertencia de Seguridad
                    </h5>
                    <p className="text-zinc-300 text-sm font-medium">{selected.safetyNotes}</p>
                  </div>
                )}

                <div className="p-8 rounded-[2rem] bg-industrial-accent/5 border border-industrial-accent/10 flex items-center gap-4">
                  <Activity className="w-8 h-8 text-industrial-accent shrink-0" />
                  <div>
                    <h5 className="text-industrial-accent font-bold text-sm tracking-tight">Protocolo de Sustitución</h5>
                    <p className="text-zinc-300 text-xs font-medium leading-relaxed mt-1">{selected.replacementProtocol}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-10">
                <button className="w-full py-5 rounded-[2rem] bg-industrial-accent text-white font-bold shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest">
                  Ver planos detallados
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
