"use client";

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MailIcon, PhoneIcon, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: "Yakub Sidibe",
    role: "Desarrollador y Técnico Electromecánico",
    image: "/images/team/yakub.png",
    specialty: "Sistemas Automatizados",
    admin: true
  },
  {
    name: "Daniel Jiménez",
    role: "Electricista",
    image: "/images/team/daniel.png",
    specialty: "Diagnóstico Eléctrico",
    admin: false
  },
  {
    name: "Alejandro Carvajal",
    role: "Técnico Aviónico",
    image: "/images/team/alejandro.png",
    specialty: "Instrumentación",
    admin: false
  },
  {
    name: "Karim El-Hannach",
    role: "Técnico Aviónico y Electromecánico",
    image: "/images/team/karim.png",
    specialty: "Mantenimiento Integral",
    admin: false
  }
];

export default function EquipoPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Equipo Técnico</h1>
          <p className="text-zinc-500 font-medium max-w-lg">Personal especializado a cargo del mantenimiento preventivo y correctivo de planta CACESA.</p>
        </motion.div>
        
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            8 Técnicos Activos
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, i) => (
          <motion.div 
            key={member.name} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-elegant rounded-[2.5rem] p-8 flex flex-col items-center group relative hover:border-industrial-accent/40 transition-all duration-500"
          >
            {/* FAB Action Button */}
            <button className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 flex items-center justify-center transition-all hover:bg-industrial-accent hover:text-white hover:shadow-lg hover:rotate-12">
              <ArrowUpRight className="w-5 h-5" />
            </button>

            <div className="relative w-full aspect-square mb-8 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
              <Image 
                src={member.image} 
                alt={member.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2C3539] via-transparent to-transparent opacity-60" />
              
              {member.admin && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-industrial-accent text-white shadow-xl">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">{member.name}</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.15em]">{member.role}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-industrial-accent uppercase tracking-widest border border-white/10">
                {member.specialty}
              </div>
            </div>

            <div className="w-full pt-8 border-t border-white/5 flex gap-3 mt-auto">
              <button className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-industrial-accent/10 hover:border-industrial-accent/20 transition-all flex items-center justify-center group/btn">
                <MailIcon className="w-5 h-5 transition-transform group-hover/btn:-translate-y-1" />
              </button>
              <button className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-industrial-accent/10 hover:border-industrial-accent/20 transition-all flex items-center justify-center group/btn">
                <PhoneIcon className="w-5 h-5 transition-transform group-hover/btn:-translate-y-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-elegant p-10 rounded-[3rem] border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8 mt-12 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-industrial-accent/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <div className="relative z-10 text-center lg:text-left">
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Protocolo de Emergencia</h3>
          <p className="text-zinc-500 font-medium max-w-lg">En caso de parada crítica SS1/SS2, contactar inmediatamente con el responsable de planta.</p>
        </div>
        <button className="relative z-10 px-10 py-5 rounded-[2rem] bg-industrial-accent text-white font-bold shadow-[0_10px_40px_rgba(211,125,40,0.3)] active:scale-95 transition-all text-sm uppercase tracking-widest">
          Llamada Prioritaria
        </button>
      </motion.div>
    </div>
  );
}
