"use client";

import React, { useState, useRef } from 'react';
import {
  AlertTriangle,
  Camera,
  Send,
  Settings,
  ShieldAlert,
  ArrowRight,
  ClipboardCheck,
  Zap,
  Check,
  Loader2,
  FileImage
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToaster } from '@/components/Toaster';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function ReportarPage() {
  const router = useRouter();
  const { toast } = useToaster();

  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [status, setStatus] = useState({
    ss1: false,
    ss2: false,
    recurrente: false
  });
  const [boxes, setBoxes] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [evidenceName, setEvidenceName] = useState<string | null>(null);

  const machines = ['Compax Sorter', 'Mailbox Sorter', 'Crossbelt Sorter'];

  const toggleStatus = (key: keyof typeof status) => {
    setStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceName(e.target.files[0].name);
      toast(`Evidencia gráfica adjuntada: ${e.target.files[0].name}`, "success");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMachine) {
      toast("Por favor, seleccione la máquina afectada.", "error");
      return;
    }

    if (!description.trim()) {
      toast("Debe incluir una breve descripción del problema.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate network latency / Vanderlande API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast("Ticket VDL-892 generado correctamente", "success");

      const ticketId = `VDL-${Math.floor(Math.random() * 900) + 100}`;
      const timestamp = new Date().toISOString();

      const newTicket = {
        id: ticketId,
        machine: selectedMachine,
        date: timestamp,
        description,
        boxes,
        cost,
        status,
        evidence: evidenceName
      };

      const existingTickets = JSON.parse(localStorage.getItem('vanderlande_tickets') || '[]');
      localStorage.setItem('vanderlande_tickets', JSON.stringify([newTicket, ...existingTickets]));

      // Generate Official ServiceDesk Ticket PDF
      try {
        const doc = new jsPDF();

        doc.setFillColor(28, 34, 37);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('SERVICEDESK VANDERLANDE', 14, 25);

        doc.setTextColor(211, 125, 40);
        doc.setFontSize(10);
        doc.text(`TICKET DE AVERÍA CRÍTICA: ${ticketId}`, 14, 32);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`SISTEMA AFECTADO: ${selectedMachine}`, 14, 50);
        doc.text(`FECHA APERTURA: ${new Date().toLocaleString()}`, 14, 58);
        doc.text(`TÉCNICO REPORTADOR: Y. Sidibe`, 14, 66);
        doc.text(`CAJAS PENDIENTES: ${boxes || '0'}`, 14, 74);
        doc.text(`IMPACTO OPERATIVO: ${cost ? `${cost} €` : 'No calculado'}`, 14, 82);

        doc.text(`ESTADO DE PARADA:`, 14, 92);
        doc.setFontSize(10);
        doc.text(`• Parada Total SS1: ${status.ss1 ? 'SÍ' : 'NO'}`, 14, 100);
        doc.text(`• Parada Total SS2: ${status.ss2 ? 'SÍ' : 'NO'}`, 14, 106);
        doc.text(`• Suceso Recurrente: ${status.recurrente ? 'SÍ' : 'NO'}`, 14, 112);

        doc.setFontSize(12);
        doc.text(`DESCRIPCIÓN DEL FALLO:`, 14, 124);

        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(description, 180);
        doc.text(splitText, 14, 132);

        const finalY = 132 + (splitText.length * 6) + 10;

        doc.setFillColor(240, 240, 240);
        doc.rect(14, finalY, 182, 30, 'F');
        doc.setTextColor(100, 100, 100);
        doc.text(`Evidencia Fotográfica Adjunta: ${evidenceName ? 'SÍ (' + evidenceName + ')' : 'NO'}`, 20, finalY + 10);
        doc.text('Este ticket se ha sincronizado con el centro de control europeo.', 20, finalY + 18);

        doc.save(`TicketAveria_${ticketId}.pdf`);
      } catch (err) {
        console.error('Error creating PDF ticket:', err);
      }

      setTimeout(() => {
        setIsSuccess(false);
        // Reset form
        setSelectedMachine(null);
        setStatus({ ss1: false, ss2: false, recurrente: false });
        setBoxes('');
        setCost('');
        setDescription('');
        setEvidenceName(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 mb-12 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5 text-industrial-accent" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Respuesta Rápida</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Reporte de Avería</h1>
          <p className="text-zinc-500 font-medium max-w-lg">Sistema de notificación directa a ServiceDesk (Vanderlande) para incidencias críticas en planta.</p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="glass-elegant rounded-[3rem] p-8 md:p-12 overflow-hidden relative border border-white/5 shadow-2xl">
          <div className="absolute top-0 left-0 w-4 h-full bg-industrial-accent" />

          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* Machine Selection */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-white uppercase tracking-widest block px-1 flex justify-between">
                <span>Máquina Afectada</span>
                {!selectedMachine && <span className="text-industrial-accent text-[10px]">* Requerido</span>}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {machines.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMachine(m)}
                    className={cn(
                      "p-5 rounded-[1.5rem] border transition-all font-bold text-sm text-left group overflow-hidden relative",
                      selectedMachine === m
                        ? "bg-industrial-accent/10 border-industrial-accent text-industrial-accent shadow-[inset_0_0_20px_rgba(211,125,40,0.1)]"
                        : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:border-industrial-accent/50"
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span>{m}</span>
                      <Settings className={cn(
                        "w-4 h-4 transition-all duration-500",
                        selectedMachine === m ? "opacity-100 rotate-90" : "opacity-0 group-hover:opacity-100"
                      )} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Critical Toggles */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-white uppercase tracking-widest block px-1">Estado del Sistema</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'ss1' as const, label: 'Parada Total SS1' },
                  { id: 'ss2' as const, label: 'Parada Total SS2' },
                  { id: 'recurrente' as const, label: 'Suceso Recurrente' }
                ].map((toggle) => {
                  const isActive = status[toggle.id];
                  return (
                    <div
                      key={toggle.id}
                      onClick={() => toggleStatus(toggle.id)}
                      className={cn(
                        "flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer select-none",
                        isActive ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5 hover:bg-white/5"
                      )}
                    >
                      <span className={cn(
                        "font-semibold transition-colors",
                        isActive ? "text-white" : "text-zinc-400"
                      )}>{toggle.label}</span>
                      <button
                        type="button"
                        className={cn(
                          "w-14 h-8 rounded-full relative transition-all p-1",
                          isActive ? "bg-industrial-accent shadow-lg shadow-industrial-accent/20" : "bg-zinc-800"
                        )}
                      >
                        <motion.div
                          initial={false}
                          animate={{ x: isActive ? 24 : 0 }}
                          className="w-6 h-6 rounded-full bg-white transition-transform"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-4">
                <label className="text-sm font-bold text-white uppercase tracking-widest block px-1">Cajas Pendientes</label>
                <input
                  type="text"
                  value={boxes}
                  onChange={(e) => setBoxes(e.target.value)}
                  placeholder="Ej: 450"
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-xl font-bold text-industrial-accent focus:outline-none focus:ring-2 focus:ring-industrial-accent/50 transition-all font-mono"
                />
              </div>
              <div className="md:col-span-1 space-y-4">
                <label className="text-sm font-bold text-white uppercase tracking-widest block px-1">Impacto Op. (€)</label>
                <input
                  type="text"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Ej: 1035€"
                  className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-xl font-bold text-industrial-accent focus:outline-none focus:ring-2 focus:ring-industrial-accent/50 transition-all font-mono"
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-sm font-bold text-white uppercase tracking-widest block px-1 flex justify-between">
                  <span>Descripción del Problema</span>
                  {!description && <span className="text-industrial-accent text-[10px]">* Requerido</span>}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Indica brevemente el fallo observado (ej: Ruido metálico al desviar bulto en chute 4)..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-industrial-accent/50 transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Photo & Submit */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex-1 h-20 rounded-[2rem] border flex items-center justify-center gap-4 transition-all font-bold uppercase tracking-widest text-sm relative overflow-hidden",
                  evidenceName
                    ? "bg-industrial-status/10 border-industrial-status/30 text-industrial-status"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                )}
              >
                {evidenceName ? (
                  <>
                    <FileImage className="w-6 h-6" />
                    <span className="truncate max-w-[200px]">{evidenceName}</span>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-industrial-status" />
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    Adjuntar Evidencia
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={cn(
                  "flex-[2] h-20 rounded-[2rem] flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-sm transition-all relative overflow-hidden",
                  isSuccess
                    ? "bg-industrial-status text-black"
                    : "bg-industrial-accent text-white shadow-[0_15px_40px_rgba(211,125,40,0.3)] hover:scale-[1.02] active:scale-95",
                  isSubmitting && "opacity-80 scale-95 cursor-not-allowed"
                )}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      ESCALANDO TICKET...
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-black">
                      <Check className="w-6 h-6" />
                      REPORTE ENVIADO (VDL-892)
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-4 w-full h-full justify-center">
                      <Send className="w-6 h-6" />
                      ENVIAR A VANDERLANDE
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/manuals/seguridad.pdf" target="_blank" className="group">
          <div className="glass-elegant p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between group-hover:border-industrial-accent/30 hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-industrial-accent group-hover:bg-industrial-accent/10 transition-all">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white tracking-tight">Ver Protocolos</h4>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Procedimientos de evacuación</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-industrial-accent transition-all" />
          </div>
        </Link>

        <div className="glass-elegant p-8 rounded-[2.5rem] border-white/5 flex items-center gap-6 bg-red-500/5 group cursor-default">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-black text-red-500 tracking-tight text-xl mb-1 flex items-center gap-2">
              Soporte Crítico L1
            </h4>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">"La seguridad de planta es nuestra prioridad"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
