"use client";

import React from 'react';
import { Hammer, ArrowLeft, Construction, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SolucionesPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-2xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-[2.5rem] bg-industrial-accent/10 flex items-center justify-center text-industrial-accent">
          <Construction className="w-16 h-16" />
        </div>
        <motion.div 
          animate={{ rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-[#2C3539] border border-white/5 flex items-center justify-center shadow-xl"
        >
          <Hammer className="w-6 h-6 text-industrial-accent" />
        </motion.div>
      </motion.div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Arquitectura en <span className="text-industrial-accent">Desarrollo</span>
        </h1>
        <p className="text-zinc-500 text-lg font-medium leading-relaxed">
          Estamos digitalizando los protocolos de evacuación y manuales de resolución rápida. 
          Pronto disponibles en este terminal.
        </p>
      </div>

      <div className="glass-elegant p-10 rounded-[3rem] border-white/5 w-full space-y-6 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-industrial-accent/5 rounded-full blur-3xl" />
        
        <h3 className="font-bold text-white flex items-center gap-3 tracking-tight">
          <ShieldAlert className="w-5 h-5 text-industrial-accent" />
          Protocolos de Contingencia
        </h3>
        <div className="space-y-4">
          {[
            "Consulta manuales físicos en el Sorter Master.",
            "Notifica al responsable de planta asignado.",
            "Sigue rutas de evacuación señalizadas."
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-industrial-accent mt-1.5" />
              <p className="text-sm text-zinc-500 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <Link 
        href="/reportar"
        className="inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-industrial-accent transition-colors uppercase tracking-[0.2em] text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Reporte
      </Link>
    </div>
  );
}
