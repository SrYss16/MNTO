"use client";

import React from 'react';
import { Activity, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const machines = [
  { id: 'cs', name: 'Compax', status: 'online' },
  { id: 'ms', name: 'Mailbox', status: 'online' },
  { id: 'cb', name: 'Crossbelt', status: 'warning' },
];

export function MachineLiveStatus() {
  return (
    <div className="flex flex-wrap gap-3">
      {machines.map((machine, i) => (
        <motion.div
          key={machine.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-2xl glass-elegant border border-white/5",
            machine.status === 'warning' ? "border-industrial-accent/20" : "border-white/5"
          )}
        >
          <div className="relative">
            <Circle className={cn(
              "w-2 h-2 fill-current",
              machine.status === 'online' ? "text-industrial-status glow-status-green" : "text-industrial-accent glow-status-orange"
            )} />
            <div className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-40",
              machine.status === 'online' ? "bg-industrial-status" : "bg-industrial-accent"
            )} />
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{machine.name} Sorter</span>
          <span className={cn(
            "text-[8px] font-black uppercase px-2 py-0.5 rounded-md",
            machine.status === 'online' ? "bg-industrial-status/10 text-industrial-status" : "bg-industrial-accent/10 text-industrial-accent"
          )}>
            {machine.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
