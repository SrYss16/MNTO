"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Info, 
  X, 
  Layers,
  Box,
  Cpu,
  ShieldCheck,
  Maximize2,
  Calendar,
  Tool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Diccionario_Tecnico, Component } from '@/lib/maintenance-db';
import Image from 'next/image';

export default function BibliotecaPage() {
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = Diccionario_Tecnico.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-32 pt-10 px-4">
      {/* Header */}
      <nav className="flex items-center justify-between mb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-industrial-accent" />
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Diccionario Técnico de Componentes</h1>
        </div>
      </nav>

      {/* Info Panel with Manual Illustration */}
      <div className="glass-elegant rounded-[3rem] p-10 mb-12 border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-industrial-accent/5 blur-[100px] pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative z-10 space-y-6">
            <span className="text-industrial-accent text-[10px] font-black uppercase tracking-[0.4em]">Módulo de Formación Visual</span>
            <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">Principio de Transporte Compax</h2>
            <p className="text-zinc-500 leading-relaxed font-medium text-sm">
              Sistema de clasificación de alta velocidad basado en <strong>Carriers</strong> (5 por compartimento). 
              Esta biblioteca contiene el despiece crítico para el mantenimiento de primer nivel.
            </p>
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image 
              src="/images/manual/image_0d0a85.png" 
              alt="Diagrama de Explosión" 
              fill 
              className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
        <input 
          type="text"
          placeholder="Ej: 'SCU', 'Carrier', 'Inducción'..."
          className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white focus:outline-none focus:border-industrial-accent/30 transition-all font-bold text-sm tracking-tight"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredComponents.map((comp) => (
          <motion.div
            key={comp.id}
            whileHover={{ y: -10 }}
            onClick={() => setSelectedComponent(comp)}
            className="glass-elegant rounded-[3rem] overflow-hidden border-white/5 group cursor-pointer flex flex-col h-full shadow-2xl bg-[#1c2225]/80"
          >
            <div className="relative aspect-video bg-zinc-900 overflow-hidden">
               <Image 
                 src={comp.image} 
                 alt={comp.name}
                 fill
                 className="object-cover opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1c2225] to-transparent opacity-60" />
               <div className="absolute bottom-6 left-8">
                  <span className="text-[9px] font-black text-industrial-accent uppercase tracking-widest">{comp.section}</span>
               </div>
            </div>
            <div className="p-10 space-y-4 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-industrial-accent transition-colors leading-tight">{comp.name}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 font-medium">{comp.function}</p>
              
              <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/5">
                 <div className="flex items-center gap-2 text-[8px] font-black text-zinc-600 uppercase">
                    <Calendar className="w-3 h-3" /> {comp.maintenanceInterval}
                 </div>
                 <Maximize2 className="w-4 h-4 text-zinc-700 group-hover:text-industrial-accent transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Side Modal (Sheet) Detail */}
      <AnimatePresence>
        {selectedComponent && (
          <div className="fixed inset-0 z-[400] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComponent(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-[#1c2225] shadow-3xl border-l border-white/10 overflow-y-auto no-scrollbar"
            >
              <div className="p-10 md:p-16 space-y-16">
                <button 
                  onClick={() => setSelectedComponent(null)}
                  className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:bg-white/10"
                >
                  <X className="w-7 h-7" />
                </button>

                <div className="space-y-8">
                  <div className="aspect-video rounded-[3rem] bg-zinc-900 border border-white/10 relative overflow-hidden shadow-2xl">
                    <Image 
                      src={selectedComponent.image} 
                      alt={selectedComponent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <span className="px-4 py-1.5 bg-industrial-accent/10 rounded-full text-industrial-accent text-[9px] font-bold uppercase tracking-[0.2em]">{selectedComponent.section}</span>
                    <h2 className="text-5xl font-bold text-white tracking-tighter leading-none">{selectedComponent.name}</h2>
                  </div>
                </div>

                <div className="space-y-12">
                   {/* Maintenance Strategy Section */}
                   <div className="p-10 rounded-[2.5rem] bg-industrial-accent/10 border border-industrial-accent/20 highlight-industrial shadow-[0_0_50px_rgba(211,125,40,0.05)]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-industrial-accent flex items-center justify-center text-white">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-industrial-accent uppercase tracking-widest">Protocolo Preventivo</h4>
                           <p className="text-xl font-bold text-white tracking-tight">{selectedComponent.maintenanceInterval}</p>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">
                        Nota: La falta de inspección en este intervalo anula la garantía de Vanderlande sobre el conjunto.
                      </p>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                         <Info className="w-4 h-4 text-industrial-accent" /> Descripción de Operación
                      </h4>
                      <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                        {selectedComponent.function}
                      </p>
                   </div>

                   <div className="p-10 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 space-y-4">
                      <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4" /> Seguridad (Critical Notes)
                      </h4>
                      <p className="text-red-400 text-base font-bold leading-relaxed">
                        {selectedComponent.safetyNotes}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-6 pb-12">
                      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                         <Tool className="w-5 h-5 text-zinc-600 mb-4" />
                         <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Recambios</p>
                         <p className="text-lg font-bold text-white">Stock Local OK</p>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5">
                         <Cpu className="w-5 h-5 text-zinc-600 mb-4" />
                         <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Diagnóstico</p>
                         <p className="text-lg font-bold text-industrial-status">READY</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
