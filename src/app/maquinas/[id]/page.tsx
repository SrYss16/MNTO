"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { machines } from '@/lib/data-maquinas';
import { 
  ChevronLeft, 
  Settings, 
  FileText, 
  Info, 
  Database,
  ArrowRight,
  Download,
  ShieldCheck,
  Image as ImageIcon,
  Zap,
  Activity,
  Maximize2,
  Box,
  Layers,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToaster } from '@/components/Toaster';

// Custom hook to simulate live data fluctuations
function useLiveMetrics(baseValue: string, factor: number = 2) {
  const [value, setValue] = useState(baseValue);
  
  useEffect(() => {
    const isPercentage = baseValue.includes('%');
    const isTemp = baseValue.includes('°C');
    const numValue = parseFloat(baseValue);
    
    if (isNaN(numValue)) return;

    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * factor;
      const newValue = (numValue + fluctuation).toFixed(1);
      setValue(`${newValue}${isPercentage ? '%' : isTemp ? '°C' : ''}`);
    }, 3000);

    return () => clearInterval(interval);
  }, [baseValue, factor]);

  return value;
}

export default function MaquinaDetalle() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToaster();
  
  const [activeTab, setActiveTab] = useState('especificaciones');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activePdf, setActivePdf] = useState<{name: string, url: string} | null>(null);
  
  // Diagnostic state
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [showDiagnosticReport, setShowDiagnosticReport] = useState(false);

  const machine = useMemo(() => machines.find((m) => m.id === id), [id]);

  // Live metrics
  const liveEfficiency = useLiveMetrics('98.5', 0.5);
  const liveTemp = useLiveMetrics('42', 1.5);
  const liveCpu = useLiveMetrics('24', 4);

  if (!machine) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
        <Database className="w-10 h-10 text-zinc-700" />
      </div>
      <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-sm">Sistema no encontrado</p>
      <button onClick={() => router.push('/')} className="text-industrial-accent font-bold uppercase tracking-widest text-[10px] hover:underline">
        Volver al Panel Central
      </button>
    </div>
  );

  const handleDownload = (manualName: string, url: string) => {
    if (!url || url === '#') {
      toast(`URL no disponible para: ${manualName}`, 'error');
      return;
    }

    toast(`Iniciando descarga de: ${manualName}`, 'info');
    
    // Trigger real download
    const link = document.createElement('a');
    link.href = url;
    link.download = manualName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      toast(`Descarga completada: ${manualName}`, 'success');
    }, 2000);
  };

  const startDiagnostic = () => {
    setIsDiagnosing(true);
    setDiagnosticStep(1);
    
    const steps = [
      "Escaneando nodos industriales...",
      "Verificando integridad de pasadores...",
      "Sincronizando bus de campo...",
      "Analizando redundancia de datos...",
      "Generando reporte de salud..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setDiagnosticStep(currentStep + 1);
        toast(steps[currentStep], 'info');
      } else {
        clearInterval(interval);
        setIsDiagnosing(false);
        setShowDiagnosticReport(true);
        toast("Diagnóstico completado con éxito", 'success');
      }
    }, 1500);
  };

  const tabs = [
    { id: 'especificaciones', label: 'Espec. Técnicas', icon: Zap },
    { id: 'arquitectura', label: 'Arquitectura', icon: Layers },
    { id: 'imagenes', label: 'Imágenes', icon: ImageIcon },
    { id: 'manuales', label: 'Manuales', icon: FileText },
    { id: 'formacion', label: 'Formación', icon: GraduationCap },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-32 pt-10">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between mb-12 px-2">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.2em] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Volver
        </motion.button>

        <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-6 py-3 rounded-[2rem] backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-industrial-status animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Sistema Activo</span>
        </div>
      </nav>

      <div className="glass-elegant rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-industrial-accent/5 to-transparent pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative p-12 md:p-20 border-b border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-[120px] bg-industrial-accent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-industrial-accent text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-industrial-accent/20">
                  ID: {machine.id.toUpperCase()}
                </div>
                <div className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Vanderlande Industrial</div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">{machine.name}</h1>
                <p className="text-zinc-400 font-medium max-w-2xl text-xl leading-relaxed">{machine.fullDescription || machine.description}</p>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-industrial-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Certificación</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">ISO 9001 / CE</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-industrial-accent animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mantenimiento</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Preventivo Al Día</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-[400px] shrink-0">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-black/40 p-12 group cursor-zoom-in"
                 onClick={() => setSelectedImage(machine.image)}
               >
                 <Image 
                   src={machine.image} 
                   alt={machine.name}
                   fill
                   className="object-contain transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-white" />
                 </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="p-8 md:p-12">
          <div className="flex bg-black/30 p-2 rounded-[2.5rem] border border-white/5 mb-12 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-[180px] flex items-center justify-center gap-3 py-5 px-8 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                  activeTab === tab.id 
                    ? "bg-industrial-accent text-white shadow-[0_10px_30px_rgba(211,125,40,0.3)] scale-100" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "animate-pulse" : "")} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'especificaciones' && (
                <motion.div
                  key="spec"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                       <div className="flex items-center gap-3 mb-6">
                         <div className="w-1.5 h-6 bg-industrial-accent rounded-full" />
                         <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest">Visión General</h3>
                       </div>
                       <p className="text-zinc-400 text-lg leading-relaxed font-medium italic border-l-4 border-industrial-accent/20 pl-8 py-2">
                         "{machine.definition || machine.description}"
                       </p>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                         {machine.specs?.map((spec, idx) => (
                           <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/5 group hover:border-industrial-accent/30 transition-all">
                             <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 group-hover:text-industrial-accent transition-colors">{spec.label}</p>
                             <p className="text-lg font-bold text-white">{spec.value}</p>
                           </div>
                         ))}
                       </div>
                    </div>

                    <div className="lg:col-span-5">
                       <div className="p-10 rounded-[3rem] bg-gradient-to-br from-industrial-accent/10 to-transparent border border-industrial-accent/20">
                          <div className="flex items-center gap-4 mb-10">
                            <Activity className="w-8 h-8 text-industrial-accent" />
                            <h4 className="text-lg font-bold text-white tracking-tight uppercase tracking-widest">Real-Time Data</h4>
                          </div>
                          <div className="space-y-8">
                            {[
                              { label: 'Eficiencia Operativa', val: liveEfficiency, color: 'bg-industrial-status' },
                              { label: 'Carga Térmica', val: liveTemp, color: 'bg-industrial-accent' },
                              { label: 'Uso de CPU (Core)', val: liveCpu, color: 'bg-blue-500' }
                            ].map((met) => (
                              <div key={met.label} className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                  <span className="text-zinc-500">{met.label}</span>
                                  <span className="text-white">{met.val}</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: met.val }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={cn("h-full rounded-full shadow-[0_0_10px_rgba(211,125,40,0.3)]", met.color)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'arquitectura' && (
                <motion.div
                  key="arch"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(machine?.structure || []).map((item, i) => (
                      <div key={item} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 group hover:bg-industrial-accent/5 hover:border-industrial-accent/30 transition-all flex flex-col justify-between h-[180px]">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 font-black text-xs group-hover:text-industrial-accent group-hover:border-industrial-accent/20 transition-all">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <Box className="w-5 h-5 text-zinc-800 group-hover:text-industrial-accent/20 transition-all" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white tracking-tight mb-1">{item}</h4>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-industrial-accent/60 transition-colors">Componente Crítico</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional info card for architecture */}
                  <div className="p-10 rounded-[3rem] bg-zinc-900/50 border border-dashed border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 mt-8 relative overflow-hidden group">
                     {isDiagnosing && (
                       <motion.div 
                         initial={{ x: '-100%' }}
                         animate={{ x: '200%' }}
                         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-industrial-accent/10 to-transparent pointer-events-none"
                       />
                     )}
                     
                     <div className="flex items-center gap-8 relative z-10">
                        <div className={cn(
                          "w-20 h-20 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500",
                          isDiagnosing ? "bg-industrial-accent/20 border-industrial-accent animate-pulse" : "bg-industrial-accent/10 border-industrial-accent/20"
                        )}>
                           {isDiagnosing ? <Loader2 className="w-10 h-10 text-industrial-accent animate-spin" /> : <Database className="w-10 h-10 text-industrial-accent" />}
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-2xl font-black text-white tracking-tighter uppercase">Industrial Scan Integrator</h4>
                           <p className="text-zinc-500 text-sm max-w-xl">
                             {isDiagnosing 
                               ? `Ejecutando paso ${diagnosticStep} de 5... Analizando integridad del bus de campo conforme a ISO 11898.`
                               : "Inicie un análisis de redundancia para sincronizar todos los nodos industriales con la estación CCC principal."}
                           </p>
                        </div>
                     </div>

                     <button 
                       disabled={isDiagnosing}
                       onClick={startDiagnostic}
                       className={cn(
                         "px-12 py-5 border text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 flex items-center gap-3",
                         isDiagnosing 
                           ? "bg-zinc-800 border-zinc-700 cursor-not-allowed" 
                           : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-industrial-accent/30"
                       )}
                     >
                        {isDiagnosing ? 'Escaneando...' : 'Ejecutar Diagnóstico'}
                        {!isDiagnosing && <ArrowRight className="w-4 h-4" />}
                     </button>
                  </div>

                  {/* Diagnostic Report Overlay */}
                  <AnimatePresence>
                    {showDiagnosticReport && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-10 rounded-[3rem] bg-industrial-status/5 border border-industrial-status/20 flex flex-col md:flex-row items-center justify-between gap-8"
                      >
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-industrial-status/20 flex items-center justify-center">
                              <CheckCircle2 className="w-8 h-8 text-industrial-status" />
                           </div>
                           <div>
                              <h5 className="text-lg font-black text-white uppercase tracking-tight">Reporte: SALUD ÓPTIMA (99.2%)</h5>
                              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Todos los subsistemas responden correctamente | Latencia: 12ms</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => setShowDiagnosticReport(false)}
                          className="px-6 py-3 rounded-xl bg-industrial-status/10 text-industrial-status text-[10px] font-black uppercase tracking-widest hover:bg-industrial-status/20 transition-all"
                        >
                          Cerrar Reporte
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === 'imagenes' && (
                <motion.div
                  key="img"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {(machine?.gallery || [machine?.image]).map((img, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/5 bg-black/40 group cursor-pointer shadow-2xl"
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image 
                        src={img} 
                        alt={`${machine.name} gallery ${idx}`}
                        fill
                        className="object-cover p-4 transition-all duration-700 filter group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-industrial-accent/20 backdrop-blur-sm">
                         <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                            <Maximize2 className="w-5 h-5" />
                         </div>
                      </div>
                    </motion.div>
                  )) || (
                    <p className="col-span-full text-center py-20 text-zinc-600 uppercase tracking-widest font-black text-xs">No hay imágenes adicionales disponibles</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'manuales' && (
                <motion.div
                  key="doc"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {(machine.manuals || []).map((doc) => (
                    <button 
                      key={doc.name} 
                      onClick={() => setActivePdf({ name: doc.name, url: doc.url })}
                      className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/5 border border-white/5 group hover:bg-industrial-accent/5 hover:border-industrial-accent/20 transition-all text-left shadow-lg"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-industrial-accent group-hover:bg-industrial-accent/10 group-hover:border-industrial-accent/20 transition-all">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-white tracking-tight">{doc.name}</p>
                          <div className="flex items-center gap-3">
                             <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-black text-zinc-400 uppercase tracking-widest border border-white/5">{doc.type}</span>
                             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-industrial-accent group-hover:bg-industrial-accent/10 transition-all">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}


              {activeTab === 'formacion' && (
                <motion.div
                  key="training"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-12"
                >
                  {machine.trainingData ? (
                    <div className="space-y-20">
                      {machine.trainingData.map((section, idx) => (
                        <div key={idx} className="space-y-10">
                           <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-industrial-accent/10 flex items-center justify-center text-industrial-accent shadow-[inset_0_0_20px_rgba(211,125,40,0.1)]">
                                 {section.icon === 'Settings' && <Settings className="w-8 h-8" />}
                                 {section.icon === 'Zap' && <Zap className="w-8 h-8" />}
                                 {section.icon === 'Cpu' && <Cpu className="w-8 h-8" />}
                                 {section.icon === 'ShieldAlert' && <ShieldAlert className="w-8 h-8" />}
                                 {section.icon === 'AlertTriangle' && <AlertTriangle className="w-8 h-8" />}
                              </div>
                              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{section.title}</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {section.points.map((point, pIdx) => (
                                 <div key={pIdx} className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:bg-industrial-accent/[0.02] hover:border-industrial-accent/20 transition-all flex flex-col gap-6 group">
                                    <h4 className="text-xl font-bold text-industrial-accent tracking-tight group-hover:translate-x-1 transition-transform">{point.title}</h4>
                                    {point.description && <p className="text-zinc-400 text-base leading-relaxed font-medium">{point.description}</p>}
                                    {point.items && (
                                      <ul className="space-y-4 pt-2">
                                         {point.items.map((item, iIdx) => (
                                           <li key={iIdx} className="flex items-start gap-4 text-sm text-zinc-500 font-bold group-hover:text-zinc-300 transition-colors">
                                              <div className="w-2 h-2 rounded-full bg-industrial-accent/30 mt-1.5 shrink-0" />
                                              {item}
                                           </li>
                                         ))}
                                      </ul>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-32 flex flex-col items-center justify-center space-y-8 bg-white/5 rounded-[3rem] border border-dashed border-white/5">
                      <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                        <GraduationCap className="w-10 h-10" />
                      </div>
                      <p className="text-zinc-600 uppercase tracking-[0.4em] font-black text-xs text-center">Información de formación <br/>no disponible para este sistema</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Fullscreen Image Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-10 right-10 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
               <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-7xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedImage} 
                alt="Fullscreen Preview"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen PDF Viewer Overlay */}
      <AnimatePresence>
        {activePdf && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#1c2225] flex flex-col"
          >
            <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/20">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-industrial-accent/10 flex items-center justify-center text-industrial-accent">
                     <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold tracking-tight">{activePdf.name}</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Lector de Componentes Técnicos</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleDownload(activePdf.name, activePdf.url)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-white hover:bg-white/10 transition-all"
                  >
                     <Download className="w-4 h-4" />
                     Descargar Original
                  </button>
                  <button 
                    onClick={() => setActivePdf(null)}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                  >
                     <X className="w-5 h-5" />
                  </button>
               </div>
            </div>
            <div className="flex-1 w-full bg-zinc-900/50">
               <iframe 
                 src={activePdf.url} 
                 className="w-full h-full border-none"
                 title={activePdf.name}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


