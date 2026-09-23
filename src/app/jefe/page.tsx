"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Plus, X, CheckCircle2, Circle,
  Loader2, Trash2, Calendar, HardHat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'done';
  machine?: string;
  deadline?: string;
  createdAt: number;
  updatedAt: number;
}

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

// ─── Config ───────────────────────────────────────────────────────────────────

const TEAM = [
  { id: 'yakub-sidibe',       name: 'Yakub Sidibe',       initials: 'YS', color: '#D37D28' },
  { id: 'daniel-jimenez',     name: 'Daniel Jiménez',     initials: 'DJ', color: '#3b82f6' },
  { id: 'alejandro-carvajal', name: 'Alejandro Carvajal', initials: 'AC', color: '#a855f7' },
  { id: 'karim-el-hannach',   name: 'Karim El-Hannach',   initials: 'KE', color: '#10b981' },
];

const MACHINES = ['Compax Sorter', 'Mailbox Sorter', 'Crossbelt', 'FSC', 'Sistema General'];

const PRIORITY: Record<TaskPriority, { label: string; color: string; bg: string; dot: string }> = {
  high:   { label: 'Alta',  color: 'text-red-400',             bg: 'bg-red-500/10 border-red-500/25',                 dot: 'bg-red-500' },
  medium: { label: 'Media', color: 'text-industrial-accent',   bg: 'bg-industrial-accent/10 border-industrial-accent/25', dot: 'bg-industrial-accent' },
  low:    { label: 'Baja',  color: 'text-zinc-400',            bg: 'bg-white/5 border-white/10',                      dot: 'bg-zinc-500' },
};

const COLUMNS: Array<{ key: TaskStatus; label: string; icon: React.ElementType; colBg: string; colBorder: string; spinIcon?: boolean }> = [
  { key: 'pending',    label: 'Pendiente', icon: Circle,       colBg: 'bg-zinc-900/40',  colBorder: 'border-zinc-700/40' },
  { key: 'in-progress',label: 'En Curso',  icon: Loader2,      colBg: 'bg-blue-950/30',  colBorder: 'border-blue-700/25', spinIcon: true },
  { key: 'done',       label: 'Completada',icon: CheckCircle2, colBg: 'bg-green-950/30', colBorder: 'border-green-700/25' },
];

const STATUS_COLORS: Record<TaskStatus, string> = {
  'pending':    'text-zinc-400',
  'in-progress':'text-blue-400',
  'done':       'text-industrial-status',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDeadline(deadline?: string): { text: string; overdue: boolean } | null {
  if (!deadline) return null;
  const d = new Date(deadline + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const overdue = d < today;
  const isToday = d.toDateString() === today.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const text = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return { text, overdue };
}

function getMember(id: string) {
  return TEAM.find(t => t.id === id);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ memberId, size = 8 }: { memberId: string; size?: number }) {
  const m = getMember(memberId);
  if (!m) return null;
  return (
    <div
      className={`w-${size} h-${size} rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0`}
      style={{ backgroundColor: m.color }}
    >
      {m.initials}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const p = PRIORITY[priority];
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border', p.bg, p.color)}>
      {p.label}
    </span>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const deadline = formatDeadline(task.deadline);
  const member = getMember(task.assignedTo);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="w-full glass-elegant rounded-[1.75rem] p-5 text-left hover:border-white/20 active:scale-[0.98] transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        {task.machine && (
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest truncate max-w-[45%]">
            {task.machine}
          </span>
        )}
      </div>

      <h3 className="text-sm font-bold text-white leading-snug mb-3 group-hover:text-industrial-accent transition-colors line-clamp-2">
        {task.title}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {member && (
            <>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: member.color }}
              >
                {member.initials[0]}
              </div>
              <span className="text-[10px] font-semibold text-zinc-500">{member.name.split(' ')[0]}</span>
            </>
          )}
        </div>
        {deadline && (
          <span className={cn('text-[9px] font-bold uppercase tracking-widest', deadline.overdue ? 'text-red-500' : 'text-zinc-600')}>
            {deadline.text}
          </span>
        )}
      </div>
    </motion.button>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full z-[80] glass-elegant rounded-t-[2.5rem] md:rounded-[2.5rem] p-7 max-h-[92dvh] overflow-y-auto no-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all active:scale-90">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
}

// ─── Task Detail ──────────────────────────────────────────────────────────────

function TaskDetail({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (t: Task, s: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  const deadline = formatDeadline(task.deadline);
  const member = getMember(task.assignedTo);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <PriorityBadge priority={task.priority} />
        {task.machine && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold bg-white/5 border border-white/10 text-zinc-400 uppercase tracking-widest">
            <HardHat className="w-3 h-3" />
            {task.machine}
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold text-white leading-snug">{task.title}</h2>

      {task.description && (
        <p className="text-sm text-zinc-400 leading-relaxed">{task.description}</p>
      )}

      <div className="space-y-2">
        {member && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
            <Avatar memberId={task.assignedTo} size={8} />
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Asignado a</p>
              <p className="text-sm font-bold text-white">{task.assignedToName}</p>
            </div>
          </div>
        )}
        {task.assignedBy && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-industrial-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-industrial-accent" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Asignado por</p>
              <p className="text-sm font-bold text-white">{task.assignedBy}</p>
            </div>
          </div>
        )}
        {task.deadline && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Fecha límite</p>
              <p className={cn('text-sm font-bold', deadline?.overdue ? 'text-red-500' : 'text-white')}>
                {deadline?.text ?? task.deadline}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status change */}
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">Cambiar Estado</p>
        <div className="grid grid-cols-3 gap-2">
          {COLUMNS.map(({ key, label, icon: Icon, spinIcon }) => {
            const isActive = task.status === key;
            return (
              <button
                key={key}
                onClick={() => onStatusChange(task, key)}
                className={cn(
                  'py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border flex flex-col items-center gap-1.5',
                  isActive
                    ? 'bg-industrial-accent text-white border-industrial-accent shadow-[0_4px_15px_rgba(211,125,40,0.2)]'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive && spinIcon && 'animate-spin')} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delete */}
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar Tarea
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-zinc-400 hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── New Task Form ─────────────────────────────────────────────────────────────

const EMPTY_FORM = { title: '', description: '', assignedTo: '', assignedToName: '', priority: 'medium' as TaskPriority, machine: '', deadline: '' };

function NewTaskForm({ onCreated, jefeName }: { onCreated: (task: Task) => void; jefeName: string }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof EMPTY_FORM, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.assignedTo) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, assignedBy: jefeName }),
      });
      const data = await res.json();
      onCreated(data.task);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-industrial-accent/50 transition-colors";
  const labelCls = "text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Título *</label>
        <input
          value={form.title}
          onChange={e => update('title', e.target.value)}
          placeholder="Ej: Revisión diaria Compax Sorter"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Descripción</label>
        <textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder="Detalla los pasos o información relevante…"
          rows={3}
          className={cn(inputCls, 'resize-none')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Asignar a *</label>
          <select
            value={form.assignedTo}
            onChange={e => {
              const m = TEAM.find(t => t.id === e.target.value);
              update('assignedTo', e.target.value);
              update('assignedToName', m?.name ?? '');
            }}
            required
            className={cn(inputCls, 'appearance-none')}
          >
            <option value="" disabled className="bg-[#2C3539]">Seleccionar</option>
            {TEAM.map(m => (
              <option key={m.id} value={m.id} className="bg-[#2C3539]">{m.name.split(' ')[0]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Prioridad</label>
          <select
            value={form.priority}
            onChange={e => update('priority', e.target.value)}
            className={cn(inputCls, 'appearance-none')}
          >
            <option value="high"   className="bg-[#2C3539]">Alta</option>
            <option value="medium" className="bg-[#2C3539]">Media</option>
            <option value="low"    className="bg-[#2C3539]">Baja</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Máquina</label>
          <select
            value={form.machine}
            onChange={e => update('machine', e.target.value)}
            className={cn(inputCls, 'appearance-none')}
          >
            <option value="" className="bg-[#2C3539]">Ninguna</option>
            {MACHINES.map(m => (
              <option key={m} value={m} className="bg-[#2C3539]">{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Fecha límite</label>
          <input
            type="date"
            value={form.deadline}
            onChange={e => update('deadline', e.target.value)}
            className={cn(inputCls, '[color-scheme:dark]')}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting || !form.title.trim() || !form.assignedTo}
          className="flex-1 py-3.5 rounded-2xl bg-industrial-accent text-white font-bold text-sm shadow-[0_4px_20px_rgba(211,125,40,0.3)] disabled:opacity-40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
        >
          {submitting ? 'Creando…' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JefePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [activeCol, setActiveCol] = useState<TaskStatus>('pending');
  const [jefeName, setJefeName] = useState('Yakub Sidibe');

  useEffect(() => {
    const stored = localStorage.getItem('chatIdentity');
    if (stored) setJefeName(JSON.parse(stored).name);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tareas');
      const data = await res.json();
      setTasks(data.tasks ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 6000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const changeStatus = async (task: Task, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status } : t));
    setSelected(prev => prev?.id === task.id ? { ...prev, status } : prev);
    await fetch('/api/tareas', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, status }),
    });
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelected(null);
    await fetch(`/api/tareas?id=${id}`, { method: 'DELETE' });
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
    setShowNew(false);
  };

  const byStatus = (s: TaskStatus) => tasks.filter(t => t.status === s);
  const stats = { pending: byStatus('pending').length, 'in-progress': byStatus('in-progress').length, done: byStatus('done').length };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-industrial-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-28 md:pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-industrial-accent/10 border border-industrial-accent/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-industrial-accent" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Mando</h1>
          </div>
          <p className="text-zinc-500 text-sm pl-1">Asignación y supervisión del equipo técnico</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-industrial-accent text-white font-bold text-sm shadow-[0_8px_25px_rgba(211,125,40,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Nueva Tarea
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(({ key, label, icon: Icon, spinIcon, colBg, colBorder }) => (
          <div key={key} className={cn('glass-elegant rounded-[2rem] p-5 border', colBorder)}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className={cn('w-4 h-4', STATUS_COLORS[key], spinIcon && stats['in-progress'] > 0 && 'animate-spin')} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden sm:block">{label}</span>
            </div>
            <p className={cn('text-4xl font-black', STATUS_COLORS[key])}>{stats[key]}</p>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1 hidden sm:block">
              {stats[key] === 1 ? 'tarea' : 'tareas'}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex gap-1.5 p-1 glass-elegant rounded-2xl">
        {COLUMNS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCol(key)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all',
              activeCol === key ? 'bg-industrial-accent text-white' : 'text-zinc-500 hover:text-white'
            )}
          >
            {label}
            <span className="ml-1 opacity-60">({stats[key]})</span>
          </button>
        ))}
      </div>

      {/* Desktop Kanban */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {COLUMNS.map(({ key, label, icon: Icon, spinIcon, colBg, colBorder }) => {
          const colTasks = byStatus(key);
          return (
            <div key={key} className={cn('rounded-[2.5rem] border p-5 space-y-3', colBg, colBorder)}>
              <div className="flex items-center justify-between px-1 pb-1">
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', STATUS_COLORS[key], spinIcon && colTasks.length > 0 && 'animate-spin')} />
                  <span className="text-xs font-black text-white uppercase tracking-widest">{label}</span>
                </div>
                <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10', STATUS_COLORS[key])}>
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                <AnimatePresence>
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelected(task)} />
                  ))}
                </AnimatePresence>
                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center h-[100px] rounded-2xl border border-dashed border-white/10">
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Sin tareas</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile single column */}
      <div className="md:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {byStatus(activeCol).map(task => (
            <TaskCard key={task.id} task={task} onClick={() => setSelected(task)} />
          ))}
        </AnimatePresence>
        {byStatus(activeCol).length === 0 && (
          <div className="flex items-center justify-center h-[120px] rounded-[2rem] border border-dashed border-white/10">
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Sin tareas en esta columna</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNew && (
          <Modal onClose={() => setShowNew(false)} title="Nueva Tarea">
            <NewTaskForm onCreated={addTask} jefeName={jefeName} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <Modal onClose={() => setSelected(null)} title="Detalle de Tarea">
            <TaskDetail
              task={selected}
              onStatusChange={changeStatus}
              onDelete={deleteTask}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
