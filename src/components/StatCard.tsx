"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, trendType = 'neutral', delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-elegant rounded-[2rem] p-8 group hover:border-industrial-accent/30 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="p-4 rounded-2xl bg-white/5 text-zinc-400 group-hover:text-industrial-accent group-hover:bg-industrial-accent/10 transition-all duration-300">
          <Icon className="w-8 h-8 stroke-[1.5]" />
        </div>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            trendType === 'up' ? 'bg-industrial-status/10 text-industrial-status' : 
            trendType === 'down' ? 'bg-red-500/10 text-red-500' : 
            'bg-zinc-500/10 text-zinc-500'
          }`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-bold text-white tracking-tight leading-none pt-1">
          {value}
        </h3>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Ver Detalles</span>
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
      </div>
    </motion.div>
  );
}
