"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, Info, Maximize2, Cpu, Activity, Zap, Box, Settings } from 'lucide-react';

interface SorterInfo {
  id: string;
  name: string;
  image: string;
  description: string;
  definition?: string;
  characteristics?: string[];
  features?: { title: string; desc: string }[];
  applications?: string[];
  advantages?: string[];
  components?: string[];
  operation?: string[];
}

const sorters: SorterInfo[] = [
  { 
    id: 'fsc', 
    name: 'FSC', 
    image: '/images/maquinas/fsc.png',
    description: 'Fieldbus Signal Converter',
    definition: 'Convierte señales de un tipo de bus de campo a otro, permitiendo la comunicación entre dispositivos con diferentes protocolos en sistemas de automatización industrial.',
    features: [
      { title: 'PLC (Programmable Logic Controller)', desc: 'Controlador digital usado en automatización industrial. Recibe señales de sensores, las procesa y controla actuadores. Destacado por su fiabilidad en entornos industriales.' },
      { title: 'CCC (Centralized Control Console)', desc: 'Estación centralizada para supervisar y controlar múltiples procesos desde un solo lugar, mejorando la eficiencia y la capacidad de respuesta en operaciones complejas.' },
      { title: 'SCU (Signal Conditioning Unit)', desc: 'Modifica señales eléctricas para hacerlas adecuadas para su procesamiento. Incluye amplificación, filtrado y conversión de señales de sensores, asegurando precisión en sistemas de control industrial.' }
    ]
  },
  { 
    id: 'compax-sorter', 
    name: 'COMPAX SORTER', 
    image: '/images/maquinas/compax.jpg',
    description: 'Máquina automatizada de clasificación de alta eficiencia.',
    definition: 'Una COMPAX SORTER es una máquina automatizada de clasificación usada en logística, distribución, correos y almacenes. Destaca por su eficiencia y precisión.',
    characteristics: [
      'Alta Velocidad: Clasifica muchos artículos rápidamente.',
      'Sensores Avanzados: Usa sensores ópticos, de peso y volumen.',
      'Flexibilidad: Maneja productos de distintos tamaños.',
      'Precisión y Fiabilidad: Minimiza errores.',
      'Integración: Compatible con sistemas de gestión (WMS y ERP).',
      'Diseño Modular: Fácil de expandir y adaptar.',
      'Interfaz Intuitiva: Fácil de operar.'
    ],
    applications: [
      'Logística y Distribución: Optimiza rutas y tiempos de entrega.',
      'Correos y Paquetería: Mejora la eficiencia en la clasificación de envíos.',
      'Almacenes: Facilita la gestión de inventarios y preparación de pedidos.',
      'Alimentación y Bebidas: Clasifica productos por tamaño y peso.'
    ],
    advantages: [
      'Eficiencia Operativa: Reduce tiempo y esfuerzo.',
      'Menos Errores: Aumenta la precisión.',
      'Escalabilidad: Fácil adaptación a necesidades crecientes.',
      'Satisfacción del Cliente: Mejora la entrega y la experiencia del cliente.'
    ]
  },
  { 
    id: 'mailbox-sorter', 
    name: 'MAILBOX SORTER', 
    image: '/images/maquinas/mailbox.jpg',
    description: 'Sistema de clasificación para correos y paquetes.',
    definition: 'Un MailBox Sorter es una máquina automatizada utilizada para clasificar correo y paquetes en oficinas de correos, centros de distribución y empresas de mensajería. Estas máquinas organizan los envíos de acuerdo con criterios predefinidos como destino, tamaño, y tipo de servicio, mejorando la eficiencia y precisión en el proceso de clasificación. Son esenciales para manejar grandes volúmenes de correo de manera rápida y eficiente, reduciendo errores y tiempos de entrega.'
  },
  { 
    id: 'crossbelt-sorter', 
    name: 'CROSSBELT SORTER', 
    image: '/images/maquinas/crossbelt.jpg',
    description: 'Sistema modular de bandas cruzadas para alta velocidad.',
    definition: 'Es un sistema automatizado para la clasificación y distribución eficiente de productos en centros de distribución y almacenes. Se caracteriza por su diseño modular y la capacidad de manejar diversos productos y tamaños simultáneamente.',
    components: [
      'Cintas Transportadoras Cruzadas (Crossbelts): Bandas individuales que se mueven horizontalmente sobre rieles, transportando productos a lo largo de rutas predeterminadas.',
      'Estaciones de Carga: Lugares donde operadores o robots colocan productos para ser clasificados.',
      'Sistema de Identificación y Control: Utiliza tecnología avanzada para identificar cada producto y dirigirlo hacia su destino.',
      'Estaciones de Descarga: Puntos donde los productos son retirados del sistema para envío o almacenamiento.'
    ],
    operation: [
      'Ingreso de Productos: Identificación y asignación de destino basado en códigos de barras u otras etiquetas.',
      'Transporte y Clasificación: Movimiento de productos hacia las cintas adecuadas para su destino final.',
      'Descarga: Retiro de productos para envío o almacenamiento.'
    ],
    advantages: [
      'Alta Velocidad y Precisión: Procesamiento rápido y preciso de grandes volúmenes de productos.',
      'Flexibilidad: Manejo eficiente de productos de diferentes tamaños y formas.',
      'Reducción de Errores: Minimización de errores comparado con métodos manuales.',
      'Eficiencia Operativa: Mejora general en la eficiencia del almacén al acelerar la clasificación y distribución.'
    ]
  },
];

export function SorterVisualGrid() {
  const [selectedEnlarge, setSelectedEnlarge] = useState<SorterInfo | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<SorterInfo | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleInteraction = (item: SorterInfo, isDoubleClick: boolean) => {
    if (isDoubleClick) {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setSelectedInfo(item);
      setSelectedEnlarge(null);
    } else {
      clickTimer.current = setTimeout(() => {
        setSelectedEnlarge(item);
      }, 250);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
      {sorters.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center group cursor-pointer"
          onClick={() => handleInteraction(item, false)}
          onDoubleClick={() => handleInteraction(item, true)}
        >
          <div className="w-full relative">
            <div className="relative aspect-[16/10] overflow-hidden border border-industrial-accent/20 bg-zinc-900/40 transition-all duration-500 group-hover:border-industrial-accent group-hover:shadow-[0_0_30px_rgba(211,125,40,0.2)] rounded-xl">
              <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
              
              {/* Overlay indicators */}
              <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5 text-white/70" />
                </div>
                <div className="p-1.5 rounded-lg bg-industrial-accent/80 border border-industrial-accent backdrop-blur-md shadow-lg">
                  <Info className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="w-full h-full relative p-1">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e2528'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23D37D28' fill-opacity='0.1'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em] group-hover:text-industrial-accent transition-colors">
              {item.name}
            </span>
            <div className="mt-2 h-0.5 w-0 group-hover:w-full bg-industrial-accent/30 mx-auto transition-all duration-500" />
            <p className="text-[9px] text-zinc-600 mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Click: Ampliar | Doble Click: Info (Técnico)
            </p>
          </div>
        </motion.div>
      ))}

      {/* Enlarge Modal */}
      <AnimatePresence>
        {selectedEnlarge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedEnlarge(null)}
          >
            <motion.button 
              className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors z-[110]"
              whileHover={{ rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedEnlarge.image} 
                alt={selectedEnlarge.name}
                fill
                className="object-contain bg-zinc-900/50"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedEnlarge.name}</h2>
                <p className="text-zinc-400 font-medium tracking-widest uppercase text-xs mt-2">{selectedEnlarge.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {selectedInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#1c2225]/80 backdrop-blur-xl"
            onClick={() => setSelectedInfo(null)}
          >
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="relative w-full max-w-5xl max-h-[90vh] glass-elegant rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-industrial-accent/30 shadow-[0_0_50px_rgba(211,125,40,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all z-20"
                onClick={() => setSelectedInfo(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sidebar Info */}
              <div className="w-full md:w-2/5 p-8 md:p-12 bg-black/20 border-b md:border-b-0 md:border-r border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-industrial-accent/10 border border-industrial-accent/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-industrial-accent" />
                  </div>
                  <span className="text-[10px] font-black text-industrial-accent uppercase tracking-[0.2em]">Especificaciones Técnicas</span>
                </div>
                
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{selectedInfo.name}</h2>
                <div className="w-12 h-1 bg-industrial-accent rounded-full mb-8" />
                
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 mb-8 bg-black/40">
                  <Image 
                    src={selectedInfo.image} 
                    alt={selectedInfo.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Descripción</p>
                    <p className="text-sm text-zinc-300 leading-relaxed italic">"{selectedInfo.description}"</p>
                  </div>
                </div>
              </div>

              {/* Main Detailed Content */}
              <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto detail-scrollbar">
                <div className="space-y-10">
                  {/* Definition Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-industrial-accent">
                      <Zap className="w-4 h-4 fill-industrial-accent" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em]">Definición</h3>
                    </div>
                    <p className="text-zinc-300 text-base leading-relaxed font-medium">
                      {selectedInfo.definition}
                    </p>
                  </section>

                  {/* Dynamic sections based on content */}
                  {selectedInfo.features && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 mb-4 text-industrial-accent">
                        <Activity className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Características Técnicas</h3>
                      </div>
                      <div className="grid gap-4">
                        {selectedInfo.features.map((feature, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                            <h4 className="text-industrial-accent font-bold text-sm mb-2 uppercase tracking-wide flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-industrial-accent" />
                              {feature.title}
                            </h4>
                            <p className="text-zinc-400 text-xs leading-relaxed group-hover:text-zinc-300 transition-colors">
                              {feature.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedInfo.characteristics && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-industrial-accent">
                        <Settings className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Atributos Clave</h3>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedInfo.characteristics.map((char, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-industrial-accent flex-shrink-0" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {selectedInfo.components && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-industrial-accent">
                        <Box className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Componentes Principales</h3>
                      </div>
                      <div className="space-y-3">
                        {selectedInfo.components.map((comp, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-industrial-accent/5 border border-industrial-accent/10 text-xs text-zinc-300 font-medium">
                            {comp}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedInfo.operation && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-industrial-accent">
                        <Activity className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Funcionamiento</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedInfo.operation.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs text-zinc-400">
                             <span className="font-black text-industrial-accent">{idx + 1}.</span>
                             {step}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedInfo.applications && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-industrial-accent">
                        <Box className="w-4 h-4" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Aplicaciones</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedInfo.applications.map((app, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500 uppercase">
                            {app}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedInfo.advantages && (
                    <section className="p-6 rounded-3xl bg-industrial-status/5 border border-industrial-status/20">
                      <h3 className="text-industrial-status font-black text-xs uppercase tracking-[0.2em] mb-4">Ventajas Operativas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedInfo.advantages.map((adv, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-industrial-status shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
                            {adv}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
