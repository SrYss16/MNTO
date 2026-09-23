"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronLeft, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  PlusCircle,
  Clock,
  User,
  Activity,
  ArrowRight,
  ShieldAlert,
  Send,
  MessageSquareWarning
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Solucion_Problemas, DiagnosisEntry, MaintenanceLog } from '@/lib/maintenance-db';
import { useToaster } from '@/components/Toaster';

export default function CentroRespuestaRapidaPage() {
  const router = useRouter();
  const { toast } = useToaster();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<DiagnosisEntry | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);
  const [formData, setFormData] = useState({
    technicianId: 'Yakub Sidibe',
    observations: ''
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const categories = ["Todos", "mechanical", "electrical", "control", "sensor"];

  // Predictive search suggestions
  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return Solucion_Problemas.filter(item => 
      item.symptom.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const filteredDiagnosis = useMemo(() => {
    return Solucion_Problemas.filter(entry => {
      const matchesSearch = entry.symptom.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || activeCategory === "Todos" || entry.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegisterRepair = () => {
    const newLog: MaintenanceLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      technicianId: formData.technicianId,
      type: "corrective",
      checklistCompleted: true,
      observations: `SADE: ${selectedCase?.symptom}. Detalle: ${formData.observations}`
    };

    const existingLogs = JSON.parse(localStorage.getItem('maintenance_logs') || '[]');
    localStorage.setItem('maintenance_logs', JSON.stringify([...existingLogs, newLog]));

    toast("Reparación registrada correctamente en la base de datos", "success");
    setShowLogForm(false);
    setSelectedCase(null);
  };

  const handleEscalate = () => {
    setIsEscalating(true);
    setTimeout(() => {
      toast("ALERTA: Incidencia escalada al Supervisor de Planta. Log 404-B enviado.", "error");
      setIsEscalating(false);
      setSelectedCase(null);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 pt-10 px-4">
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
          <ShieldAlert className="w-6 h-6 text-industrial-accent" />
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Centro de Respuesta Rápida</h1>
        </div>
      </nav>

      {/* Control Bar with Predictive Search */}
      <div className="glass-elegant rounded-[2.5rem] p-8 mb-10 border-white/5 space-y-8 relative z-[100]">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Describa el síntoma o anomalía (ej. 'paquetes', 'ruido')..."
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-industrial-accent/50 transition-all font-medium"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
          />
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-4 p-2 bg-[#1c2225] border border-white/10 rounded-2xl shadow-2xl z-[110]"
              >
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedCase(s);
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-4 hover:bg-industrial-accent/10 rounded-xl flex items-center justify-between group"
                  >
                    <span className="text-zinc-300 font-bold text-xs group-hover:text-white transition-colors">{s.symptom}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-industrial-accent" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                (activeCategory === cat || (cat === "Todos" && !activeCategory))
                  ? "bg-industrial-accent text-white shadow-lg shadow-industrial-accent/20"
                  : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300"
              )}
            >
              {cat === "Todos" ? "Todos los Sistemas" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDiagnosis.map((item) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            onClick={() => setSelectedCase(item)}
            className="glass-elegant p-8 rounded-[2.5rem] border-white/5 group cursor-pointer hover:bg-white/5 transition-all text-left"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                item.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-industrial-accent/10 text-industrial-accent'
              )}>
                Prioridad {item.priority}
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.category}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-industrial-accent transition-colors leading-tight">{item.symptom}</h3>
            <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
              Causa probable: {item.probableCause}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-elegant w-full max-w-2xl rounded-[3rem] p-10 md:p-14 border-white/10 text-left relative overflow-hidden h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-industrial-accent/5 rounded-full blur-[100px] pointer-events-none" />
              
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-industrial-accent" />
                    <span className="text-industrial-accent text-[10px] font-black uppercase tracking-[0.4em]">Action Card Técnico</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white leading-tight">{selectedCase.symptom}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                     <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-3">Causa Detectada</h4>
                     <p className="text-zinc-200 text-sm font-bold leading-relaxed">{selectedCase.probableCause}</p>
                   </div>
                   <div className="bg-red-500/5 rounded-3xl p-8 border border-red-500/10">
                     <h4 className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-3">Prioridad Operativa</h4>
                     <p className="text-red-500 text-sm font-black leading-relaxed">{selectedCase.priority === 'high' ? 'CRÍTICO - PARADA LÍNEA' : 'INCIDENCIA MEDIA'}</p>
                   </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-industrial-status" />
                    Resolución paso a paso
                  </h4>
                  <div className="space-y-4">
                    {selectedCase.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-industrial-accent/20 transition-all">
                        <div className="w-6 h-6 rounded-lg bg-industrial-accent/20 text-industrial-accent flex items-center justify-center text-[10px] font-black shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-zinc-400 font-bold leading-relaxed group-hover:text-zinc-100 transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-white/5">
                  <button 
                    onClick={() => setShowLogForm(true)}
                    className="flex-[2] py-6 rounded-2xl bg-industrial-status text-black font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Registrar Reparación
                  </button>
                  <button 
                    onClick={handleEscalate}
                    disabled={isEscalating}
                    className="flex-1 py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                  >
                    {isEscalating ? <Clock className="w-4 h-4 animate-spin" /> : <MessageSquareWarning className="w-4 h-4" />}
                    Escalar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Form Modal - Same as before but with updated labels */}
      <AnimatePresence>
        {showLogForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-elegant w-full max-w-xl rounded-[3rem] p-12 border-industrial-accent/20 text-left"
            >
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-industrial-accent" />
                Cierre de Intervención
              </h3>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Identificación Técnico
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-industrial-accent transition-all pl-8"
                    value={formData.technicianId}
                    onChange={(e) => setFormData({...formData, technicianId: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Observaciones Técnicas (Manual Ref P71)</label>
                  <textarea 
                    rows={4}
                    placeholder="Detalle ajuste de lamas o sustitución de pernos..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-industrial-accent transition-all resize-none"
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowLogForm(false)}
                    className="flex-1 py-5 rounded-xl border border-white/5 text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                  >
                    Borrar
                  </button>
                  <button 
                    onClick={handleRegisterRepair}
                    className="flex-1 py-5 rounded-xl bg-industrial-status text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Finalizar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
