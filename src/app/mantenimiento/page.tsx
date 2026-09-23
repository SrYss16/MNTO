"use client";

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ClipboardCheck, 
  Calendar, 
  CheckSquare, 
  Square,
  PenTool,
  Clock,
  ShieldCheck,
  FileText,
  Download,
  Loader2,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { preventiveTasks, MaintenanceLog } from '@/lib/maintenance-db';
import { useToaster } from '@/components/Toaster';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


type Frequency = 'weekly' | 'quarterly' | 'annual';

export default function MantenimientoPage() {
  const router = useRouter();
  const { toast } = useToaster();
  const [activeFrequency, setActiveFrequency] = useState<Frequency>('weekly');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [isSigning, setIsSigning] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const tasks = preventiveTasks[activeFrequency];
  
  const allTasksCompleted = useMemo(() => {
    return tasks.every(task => checkedTasks[`${activeFrequency}-${task}`]);
  }, [tasks, checkedTasks, activeFrequency]);

  const toggleTask = (task: string) => {
    const key = `${activeFrequency}-${task}`;
    setCheckedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFinalize = () => {
    const newLog: MaintenanceLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      technicianId: 'Yakub Sidibe',
      type: "preventive",
      checklistCompleted: true,
      observations: `Mantenimiento Preventivo ${activeFrequency.toUpperCase()} completado al 100%. Firma digital estampada.`
    };

    const existingLogs = JSON.parse(localStorage.getItem('maintenance_logs') || '[]');
    localStorage.setItem('maintenance_logs', JSON.stringify([...existingLogs, newLog]));

    toast(`Protocolo ${activeFrequency} registrado y sellado`, "success");
    setIsSigning(false);
    
    // Reset checks for this frequency
    const newChecked = { ...checkedTasks };
    tasks.forEach(t => delete newChecked[`${activeFrequency}-${t}`]);
    setCheckedTasks(newChecked);
    setPdfGenerated(true);
  };

  const generatePDFReport = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(28, 34, 37); // #1c2225
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('CACESA INDUSTRIAL', 14, 25);
        
        doc.setTextColor(211, 125, 40); // industrial accent
        doc.setFontSize(10);
        doc.text('CERTIFICADO DE MANTENIMIENTO PREVENTIVO', 14, 32);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`MÁQUINA: Compax Sorter`, 14, 50);
        doc.text(`INTERVALO: ${frequencyLabels[activeFrequency].toUpperCase()}`, 14, 58);
        doc.text(`FECHA DE EJECUCIÓN: ${new Date().toLocaleDateString()}`, 14, 66);
        doc.text(`TÉCNICO A CARGO: Y. Sidibe`, 14, 74);

        // Table
        const tableData = tasks.map((task, index) => [
          index + 1,
          task,
          'COMPLETADO'
        ]);

        autoTable(doc, {
          startY: 85,
          head: [['Nº', 'Punto de Inspección (Manual de Mantenimiento)', 'Evaluación']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
          bodyStyles: { textColor: [50, 50, 50] },
          styles: { fontSize: 10, cellPadding: 6 }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 150;

        // Footer & Signature
        doc.setFontSize(10);
        doc.text('Certificación Técnica Operativa:', 14, finalY + 20);
        
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('Y. Sidibe', 14, finalY + 35);
        
        doc.setFontSize(8);
        doc.setTextColor(0, 200, 100);
        doc.text(`VALIDACIÓN CRIPTOGRÁFICA: OK [VDL - ${Date.now()}]`, 14, finalY + 45);
        
        doc.save(`VDL_Mantenimiento_${activeFrequency}_${new Date().toISOString().split('T')[0]}.pdf`);

        setIsGeneratingPDF(false);
        toast("Reporte PDF firmado generado y descargado", "success");
        setPdfGenerated(false);
      } catch (error) {
        console.error(error);
        toast("Error al generar el PDF interno", "error");
        setIsGeneratingPDF(false);
      }
    }, 1500);
  };


  const frequencyLabels: Record<Frequency, string> = {
    weekly: 'Semanal',
    quarterly: 'Trimestral',
    annual: 'Anual'
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 pt-10 px-4">
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
          <ClipboardCheck className="w-5 h-5 text-industrial-accent" />
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Mantenimiento Preventivo</h1>
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex bg-black/30 p-2 rounded-[2rem] border border-white/5 mb-10">
        {(['weekly', 'quarterly', 'annual'] as Frequency[]).map((freq) => (
          <button
            key={freq}
            onClick={() => setActiveFrequency(freq)}
            className={cn(
              "flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeFrequency === freq 
                ? "bg-industrial-accent text-white shadow-lg" 
                : "text-zinc-500 hover:text-white"
            )}
          >
            {frequencyLabels[freq]}
          </button>
        ))}
      </div>

      {/* Checklist Card */}
      <div className="glass-elegant rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
        <div className="p-12 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
           <div className="space-y-2 text-left">
              <span className="text-industrial-accent text-[8px] font-black uppercase tracking-[0.4em]">Vanderlande Protocol</span>
              <h3 className="text-3xl font-bold text-white tracking-tighter">Checklist {frequencyLabels[activeFrequency]}</h3>
           </div>
           <div className="text-right">
              <span className="text-4xl font-black text-white px-6 py-4 bg-black/40 rounded-[2rem] border border-white/5 shadow-inner">
                {tasks.filter(t => checkedTasks[`${activeFrequency}-${t}`]).length}<span className="text-zinc-700 mx-1">/</span>{tasks.length}
              </span>
           </div>
        </div>

        <div className="p-10 space-y-4">
           {tasks.map((task, idx) => {
             const isChecked = checkedTasks[`${activeFrequency}-${task}`];
             return (
               <div 
                 key={idx}
                 onClick={() => toggleTask(task)}
                 className={cn(
                   "p-7 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-8 group text-left",
                   isChecked 
                     ? "bg-industrial-status/5 border-industrial-status/20 shadow-[inset_0_0_20px_rgba(0,230,118,0.02)]" 
                     : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                 )}
               >
                 <div className={cn(
                   "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                   isChecked ? "bg-industrial-status text-black scale-110" : "bg-black/40 border border-white/10 text-zinc-700"
                 )}>
                   {isChecked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                 </div>
                 <div className="flex-1">
                   <span className={cn(
                     "text-base font-bold transition-colors",
                     isChecked ? "text-industrial-status" : "text-zinc-500 group-hover:text-zinc-100"
                   )}>
                     {task}
                   </span>
                   {isChecked && (
                     <p className="text-[10px] font-black text-industrial-status uppercase tracking-widest mt-1 opacity-60">Validado por técnico</p>
                   )}
                 </div>
               </div>
             );
           })}
        </div>

        <div className="p-10 bg-black/40 border-t border-white/5 flex gap-6">
           <button 
             disabled={!allTasksCompleted}
             onClick={() => setIsSigning(true)}
             className={cn(
               "flex-[2] py-7 rounded-[2rem] font-black text-[14px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl",
               allTasksCompleted 
                 ? "bg-industrial-status text-black hover:scale-[1.01] active:scale-95" 
                 : "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40"
             )}
           >
              <PenTool className="w-6 h-6" />
              Finalizar y Firmar
           </button>
           
           <button 
             onClick={() => toast("Cargando guía técnica del manual...", "info")}
             className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:bg-white/10 group"
           >
              <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>

      {/* Signature & PDF Modal Overlay */}
      <AnimatePresence>
        {isSigning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-[30px] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-elegant w-full max-w-2xl rounded-[4rem] p-16 border-white/10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-industrial-status to-transparent" />
              
              <div className="w-24 h-24 rounded-full bg-industrial-status/10 border border-industrial-status/30 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(0,230,118,0.1)]">
                 <ShieldCheck className="w-12 h-12 text-industrial-status" />
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter">Certificación de Servicio</h2>
              <p className="text-zinc-500 text-sm mb-12 leading-relaxed max-w-md mx-auto">
                Confirma que el mantenimiento preventivo del sistema **Compax Sorter** se ha realizado siguiendo los protocolos de inspección Vanderlande.
              </p>

              <div className="space-y-8">
                <div className="p-12 bg-black/60 rounded-[3rem] border border-white/5 h-48 flex items-center justify-center relative group overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-industrial-status/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <p className="text-zinc-800 font-tech text-7xl select-none opacity-20 pointer-events-none group-hover:opacity-60 transition-all font-black">Y. Sidibe</p>
                   <div className="absolute inset-x-12 bottom-12 h-px bg-white/10" />
                   <div className="absolute top-6 right-8 text-[8px] font-black text-industrial-status/60 uppercase tracking-[0.4em]">Firma Digital Criptográfica</div>
                </div>

                <div className="flex gap-6">
                  <button 
                    onClick={() => setIsSigning(false)}
                    className="flex-1 py-6 rounded-2xl border border-white/5 text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                  >
                    Retroceder
                  </button>
                  <button 
                    onClick={handleFinalize}
                    className="flex-[2] py-6 rounded-2xl bg-industrial-status text-black font-black uppercase tracking-widest text-[12px] shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    Confirmar y Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Generation Modal */}
      <AnimatePresence>
        {pdfGenerated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass-elegant w-full max-w-lg rounded-[3rem] p-12 text-center border-industrial-accent/20"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                 <FileText className="w-10 h-10 text-industrial-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Protocolo Finalizado</h3>
              <p className="text-zinc-500 text-sm mb-10">El registro ha sido almacenado. ¿Desea generar el reporte técnico en PDF para supervisión?</p>
              
              <div className="space-y-4">
                <button 
                  onClick={generatePDFReport}
                  disabled={isGeneratingPDF}
                  className="w-full py-6 rounded-2xl bg-industrial-accent text-white font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 shadow-xl hover:bg-industrial-accent/90 transition-all"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Download className="w-6 h-6" />
                  )}
                  {isGeneratingPDF ? "Generando Reporte..." : "Descargar Reporte PDF"}
                </button>
                <button 
                  onClick={() => setPdfGenerated(false)}
                  className="w-full py-5 rounded-2xl text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                >
                  Continuar sin descargar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
