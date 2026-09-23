"use client";

import { DetailedMetrics } from "@/components/DetailedMetrics";
import { ThroughputChart } from "@/components/ThroughputChart";
import { MachineLiveStatus } from "@/components/MachineLiveStatus";
import { SorterVisualGrid } from "@/components/SorterVisualGrid";
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Activity, 
  Clock, 
  User, 
  CloudSun,
  ListRestart,
  History,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const currentTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 pb-32">
      {/* Shift Header Context */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-2 h-full bg-industrial-accent" />
        
        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
              <User className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Técnico en Turno</p>
              <h4 className="text-xl font-bold text-white tracking-tight">Yakub Sidibe</h4>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-l border-white/5 pl-8 hidden lg:flex">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hora Local</p>
              <h4 className="text-xl font-bold text-white tracking-tight">{currentTime} <span className="text-zinc-600 text-sm font-medium">Madrid</span></h4>
            </div>
          </div>

          <div className="flex items-center gap-4 border-l border-white/5 pl-8 hidden lg:flex">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
              <CloudSun className="w-7 h-7 text-industrial-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Planta (Temp)</p>
              <h4 className="text-xl font-bold text-white tracking-tight">22°C <span className="text-zinc-600 text-sm font-medium">H 45%</span></h4>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link href="/reportar" className="px-8 py-4 rounded-2xl bg-industrial-accent text-white font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(211,125,40,0.3)] hover:scale-105 transition-all text-sm uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4" />
            Emergencia
          </Link>
        </div>
      </header>

      {/* Visual Systems Gallery */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-industrial-accent rounded-full" />
          <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Sistemas de Planta</h3>
        </div>
        <SorterVisualGrid />
      </section>

      {/* Main Control Center Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Primary Monitoring Column (Left) */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* Machine Health Row */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-industrial-accent" />
                <h3 className="text-lg font-bold text-white tracking-tight">Estado de Sorters</h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Real-Time Monitor</span>
            </div>
            <MachineLiveStatus />
          </section>

          {/* Detailed Production & Error Metrics */}
          <section className="space-y-6">
            <DetailedMetrics />
          </section>

          {/* Production Analytics */}
          <section className="h-[450px]">
            <ThroughputChart />
          </section>

          {/* Action Row */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-elegant p-8 rounded-[2.5rem] relative overflow-hidden group">
              <h4 className="text-lg font-bold mb-4 text-white tracking-tight relative z-10">Asistente SADE</h4>
              <p className="text-zinc-500 text-xs mb-8 leading-relaxed relative z-10">Diagnóstico guiado por síntomas y soluciones técnicas oficiales.</p>
              <Link href="/diagnostico" className="inline-flex items-center gap-2 text-industrial-accent font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all relative z-10">
                Iniciar Diagnóstico <ArrowRight className="w-3 h-3" />
              </Link>
              <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert className="w-40 h-40" />
              </div>
            </div>

            <div className="glass-elegant p-8 rounded-[2.5rem] relative overflow-hidden group">
              <h4 className="text-lg font-bold mb-4 text-white tracking-tight relative z-10">Biblioteca Técnica</h4>
              <p className="text-zinc-500 text-xs mb-8 leading-relaxed relative z-10">Explora el despiece y especificaciones de cada componente.</p>
              <Link href="/biblioteca" className="inline-flex items-center gap-2 text-industrial-accent font-bold uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all relative z-10">
                Ver Componentes <ArrowRight className="w-3 h-3" />
              </Link>
              <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ListRestart className="w-40 h-40" />
              </div>
            </div>

            <div className="glass-elegant p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center group">
              <div className="w-12 h-12 rounded-2xl bg-industrial-accent/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-all">
                <Play className="w-6 h-6 text-industrial-accent fill-industrial-accent" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-white tracking-tight">Mantenimiento</h4>
              <p className="text-zinc-500 text-[10px] mb-8 max-w-xs leading-relaxed">Ejecuta y firma los checklists preventivos obligatorios.</p>
              <Link href="/mantenimiento" className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-bold text-white uppercase tracking-widest border border-white/10 transition-all active:scale-95">
                Cargar Checklist
              </Link>
            </div>
          </section>
        </div>

        {/* Secondary Context Column (Right) */}
        <div className="xl:col-span-4 space-y-10">
          
          {/* Shift Alarms Log */}
          <aside className="glass-elegant rounded-[2.5rem] p-10 border border-white/5 flex flex-col h-full bg-[#1c2225]">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <History className="w-5 h-5 text-industrial-accent" />
                 <h3 className="text-lg font-bold text-white tracking-tight">Log de Eventos</h3>
               </div>
               <div className="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse border border-red-500/20">
                 Live Feed
               </div>
             </div>

             <div className="space-y-6 flex-1 pr-2 overflow-y-auto no-scrollbar">
               {[
                 { time: "01:22", system: "CB Sorter", event: "Alarma Fotocélula Bloqueada", type: "critical" },
                 { time: "00:45", system: "MS Sorter", event: "Reinicio de variador motor 4", type: "warning" },
                 { time: "23:10", system: "CS Sorter", event: "Rutina preventiva completada", type: "success" },
                 { time: "22:15", system: "Terminal", event: "Cambio de turno: Y. Sidibe", type: "info" },
                 { time: "20:30", system: "CB Sorter", event: "Pico de corriente detectado", type: "warning" },
                 { time: "18:22", system: "System", event: "Backup de logs realizado", type: "success" }
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 group cursor-default">
                   <div className="flex flex-col items-center">
                     <span className="text-[10px] font-bold text-zinc-600 mb-2">{log.time}</span>
                     <div className={cn(
                       "w-1 flex-1 rounded-full",
                       log.type === 'critical' ? 'bg-red-500' : 
                       log.type === 'warning' ? 'bg-industrial-accent' : 
                       log.type === 'success' ? 'bg-industrial-status' : 'bg-zinc-700'
                     )} />
                   </div>
                   <div className="bg-white/5 border border-white/5 rounded-[1.5rem] p-5 flex-1 group-hover:bg-white/10 transition-all">
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{log.system}</p>
                     <p className="text-sm font-semibold text-zinc-100">{log.event}</p>
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-8 pt-8 border-t border-white/5">
                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] transition-all hover:bg-white/10 hover:text-white">
                  <ListRestart className="w-4 h-4" />
                  Ver Historial Completo
                </button>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
