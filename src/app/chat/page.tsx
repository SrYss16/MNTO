"use client";

import React, {
  useState, useEffect, useRef, useCallback, useLayoutEffect,
} from 'react';
import {
  Send, MessageSquare, User, Circle, ArrowLeft,
  RefreshCw, Hash, Lock, CheckCheck, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Team data ────────────────────────────────────────────────────────────────

const TEAM = [
  { id: 'yakub-sidibe',       name: 'Yakub Sidibe',       initials: 'YS', color: '#D37D28', role: 'Técnico / Jefe' },
  { id: 'daniel-jimenez',     name: 'Daniel Jiménez',     initials: 'DJ', color: '#3b82f6', role: 'Electricista' },
  { id: 'alejandro-carvajal', name: 'Alejandro Carvajal', initials: 'AC', color: '#a855f7', role: 'Técnico Aviónico' },
  { id: 'karim-el-hannach',   name: 'Karim El-Hannach',   initials: 'KE', color: '#10b981', role: 'Técnico Integral' },
] as const;

type TeamMember = typeof TEAM[number];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  room: string;
  text: string;
  sender: string;
  senderId: string;
  color: string;
  timestamp: number;
  pending?: boolean; // optimistic
}

interface Identity {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface RoomDef {
  id: string;
  name: string;
  type: 'general' | 'dm';
  otherId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const dmKey = (a: string, b: string) => [a, b].sort().join('|');

const getMember = (id: string): TeamMember | undefined =>
  TEAM.find(t => t.id === id);

function fmtTime(ts: number): string {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function getRooms(identity: Identity): RoomDef[] {
  return [
    { id: 'general', name: 'Canal General', type: 'general' },
    ...TEAM
      .filter(m => m.id !== identity.id)
      .map(m => ({
        id: dmKey(identity.id, m.id),
        name: m.name,
        type: 'dm' as const,
        otherId: m.id,
      })),
  ];
}

function lastRead(roomId: string): number {
  return parseInt(localStorage.getItem(`lastRead_${roomId}`) ?? '0');
}

function setLastRead(roomId: string) {
  localStorage.setItem(`lastRead_${roomId}`, String(Date.now()));
}

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideIn  = { x: '100%', opacity: 0 };
const slideOut = { x: '-30%', opacity: 0 };
const center   = { x: 0,     opacity: 1 };
const backIn   = { x: '-30%', opacity: 0 };
const backOut  = { x: '100%', opacity: 0 };

// ─── Identity Picker ──────────────────────────────────────────────────────────

function IdentityPicker({ onSelect }: { onSelect: (m: TeamMember) => void }) {
  return (
    <motion.div
      key="picker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[65vh] gap-10"
    >
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-20 h-20 rounded-[2rem] bg-industrial-accent/10 border border-industrial-accent/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(211,125,40,0.12)]">
          <MessageSquare className="w-10 h-10 text-industrial-accent" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Chat Técnico</h1>
        <p className="text-zinc-500 text-sm">Selecciona tu perfil para acceder</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {TEAM.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(m)}
            className="glass-elegant p-6 rounded-[2rem] flex flex-col items-center gap-3 hover:border-white/25 active:scale-95 transition-all group"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${m.color}20`, border: `2px solid ${m.color}45` }}
            >
              <span style={{ color: m.color }}>{m.initials}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">{m.name.split(' ')[0]}</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.15em] mt-0.5">{m.role}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Unread badge ─────────────────────────────────────────────────────────────

function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="min-w-[20px] h-5 px-1.5 bg-industrial-accent rounded-full flex items-center justify-center text-[9px] font-black text-white tabular-nums">
      {count > 99 ? '99+' : count}
    </span>
  );
}

// ─── Chat List ────────────────────────────────────────────────────────────────

function ChatList({
  identity,
  allMessages,
  onOpenRoom,
  onChangeIdentity,
  direction,
}: {
  identity: Identity;
  allMessages: Message[];
  onOpenRoom: (room: RoomDef) => void;
  onChangeIdentity: () => void;
  direction: 'forward' | 'back';
}) {
  const rooms = getRooms(identity);

  function msgsFor(roomId: string) {
    return allMessages.filter(m => m.room === roomId && !m.pending);
  }

  function unread(roomId: string) {
    const lr = lastRead(roomId);
    return msgsFor(roomId).filter(
      m => m.timestamp > lr && m.senderId !== 'system' && m.senderId !== identity.id,
    ).length;
  }

  function lastMsg(roomId: string): Message | undefined {
    const arr = msgsFor(roomId);
    return arr[arr.length - 1];
  }

  function preview(msg: Message | undefined): string {
    if (!msg) return 'Sin mensajes aún';
    const who =
      msg.senderId === identity.id ? 'Tú'
      : msg.senderId === 'system'  ? 'Sistema'
      : msg.sender.split(' ')[0];
    return `${who}: ${msg.text.length > 48 ? msg.text.slice(0, 48) + '…' : msg.text}`;
  }

  const generalRoom = rooms.find(r => r.type === 'general')!;
  const dmRooms = rooms.filter(r => r.type === 'dm');

  return (
    <motion.div
      key="list"
      initial={direction === 'back' ? backIn : { opacity: 0 }}
      animate={center}
      exit={direction === 'back' ? { opacity: 0 } : slideOut}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="flex flex-col gap-6 pb-28 md:pb-8"
    >
      {/* Header */}
      <div className="glass-elegant rounded-[2rem] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg"
            style={{ backgroundColor: identity.color }}
          >
            {identity.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{identity.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Circle className="w-1.5 h-1.5 fill-industrial-status text-industrial-status animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">En línea</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* All team avatars */}
          <div className="hidden sm:flex -space-x-2 mr-2">
            {TEAM.filter(m => m.id !== identity.id).map(m => (
              <div
                key={m.id}
                title={m.name}
                className="w-7 h-7 rounded-full border-2 border-[#2C3539] flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.initials[0]}
              </div>
            ))}
          </div>
          <button
            onClick={onChangeIdentity}
            title="Cambiar usuario"
            className="p-2.5 rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* General channel */}
      <section>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] px-1 mb-3">Canales</p>
        <button
          onClick={() => onOpenRoom(generalRoom)}
          className="w-full glass-elegant rounded-[2rem] p-5 flex items-center gap-4 hover:border-white/20 active:scale-[0.985] transition-all text-left"
        >
          <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-industrial-accent/10 border border-industrial-accent/20 flex items-center justify-center shrink-0">
            <Hash className="w-5 h-5 text-industrial-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-white">Canal General</span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {lastMsg(generalRoom.id) && (
                  <span className="text-[9px] text-zinc-600">{fmtTime(lastMsg(generalRoom.id)!.timestamp)}</span>
                )}
                <UnreadBadge count={unread(generalRoom.id)} />
              </div>
            </div>
            <p className="text-xs text-zinc-500 truncate">{preview(lastMsg(generalRoom.id))}</p>
          </div>
        </button>
      </section>

      {/* Direct messages */}
      <section>
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] px-1 mb-3">Mensajes Directos</p>
        <div className="space-y-2">
          {dmRooms.map(room => {
            const other = getMember(room.otherId!);
            if (!other) return null;
            const lm = lastMsg(room.id);
            const u = unread(room.id);
            return (
              <button
                key={room.id}
                onClick={() => onOpenRoom(room)}
                className="w-full glass-elegant rounded-[2rem] p-4 flex items-center gap-4 hover:border-white/20 active:scale-[0.985] transition-all text-left"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg"
                  style={{ backgroundColor: other.color }}
                >
                  {other.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn('text-sm font-semibold', u > 0 ? 'text-white' : 'text-zinc-300')}>
                      {other.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {lm && <span className="text-[9px] text-zinc-600">{fmtTime(lm.timestamp)}</span>}
                      <UnreadBadge count={u} />
                    </div>
                  </div>
                  <p className={cn('text-xs truncate', u > 0 ? 'text-zinc-300 font-medium' : 'text-zinc-600')}>
                    {preview(lm)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MsgBubble({
  msg,
  isOwn,
  isSystem,
  showSender,
  showAvatar,
  inDm,
}: {
  msg: Message;
  isOwn: boolean;
  isSystem: boolean;
  showSender: boolean;
  showAvatar: boolean;
  inDm: boolean;
}) {
  if (isSystem) {
    return (
      <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-1">
        <span className="px-4 py-1.5 rounded-full bg-industrial-status/10 border border-industrial-status/20 text-[10px] font-bold text-industrial-status uppercase tracking-widest">
          {msg.text}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn('flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar (others only, hide in DM since you know who it is) */}
      {!isOwn && !inDm && (
        <div className={cn('shrink-0 self-end mb-1', !showAvatar && 'opacity-0 pointer-events-none')}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ backgroundColor: msg.color }}
          >
            {getMember(msg.senderId)?.initials ?? msg.sender.slice(0, 2).toUpperCase()}
          </div>
        </div>
      )}

      <div className={cn('flex flex-col max-w-[80%]', isOwn ? 'items-end' : 'items-start')}>
        {showSender && !isOwn && !inDm && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider mb-1 px-1"
            style={{ color: msg.color }}
          >
            {msg.sender.split(' ')[0]}
          </span>
        )}

        <div
          className={cn(
            'relative px-4 py-2.5 text-sm leading-relaxed',
            isOwn
              ? 'bg-industrial-accent/15 border border-industrial-accent/25 text-white rounded-2xl rounded-tr-sm'
              : 'bg-white/5 border border-white/10 text-zinc-100 rounded-2xl rounded-tl-sm',
            msg.pending && 'opacity-60',
          )}
        >
          {msg.text}
          {msg.pending && (
            <RefreshCw className="absolute bottom-1.5 right-2 w-2.5 h-2.5 text-zinc-500 animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-1 mt-0.5 px-1">
          <span className="text-[9px] text-zinc-700 font-medium">{fmtTime(msg.timestamp)}</span>
          {isOwn && !msg.pending && <CheckCheck className="w-3 h-3 text-zinc-700" />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Chat Room ────────────────────────────────────────────────────────────────

function ChatRoom({
  room,
  identity,
  allMessages,
  onClose,
  sendToRoom,
  direction,
}: {
  room: RoomDef;
  identity: Identity;
  allMessages: Message[];
  onClose: () => void;
  sendToRoom: (roomId: string, text: string) => Promise<void>;
  direction: 'forward' | 'back';
}) {
  const messages = allMessages.filter(m => m.room === room.id);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const otherMember = room.otherId ? getMember(room.otherId) : undefined;

  // Mark as read when opening
  useEffect(() => {
    setLastRead(room.id);
    return () => { setLastRead(room.id); }; // also mark on close
  }, [room.id]);

  // Scroll to bottom on new messages
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    await sendToRoom(room.id, text);
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const userMsgs = messages.filter(m => m.senderId !== 'system');

  return (
    <motion.div
      key={`room-${room.id}`}
      initial={direction === 'forward' ? slideIn : backIn}
      animate={center}
      exit={direction === 'forward' ? slideOut : backOut}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="flex flex-col h-[calc(100dvh-14rem)] md:h-[calc(100dvh-7.5rem)]"
    >
      {/* Room header */}
      <div className="glass-elegant rounded-[2rem] px-4 py-3 mb-3 flex items-center gap-3 shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all active:scale-90 shrink-0"
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {room.type === 'general' ? (
          <div className="w-9 h-9 rounded-xl bg-industrial-accent/10 border border-industrial-accent/20 flex items-center justify-center shrink-0">
            <Hash className="w-4 h-4 text-industrial-accent" />
          </div>
        ) : (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: otherMember?.color ?? '#888' }}
          >
            {otherMember?.initials ?? '??'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate leading-tight">{room.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {room.type === 'dm' ? (
              <>
                <Lock className="w-2.5 h-2.5 text-zinc-600" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Chat privado</span>
              </>
            ) : (
              <>
                <Circle className="w-1.5 h-1.5 fill-industrial-status text-industrial-status" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {TEAM.length} participantes
                </span>
              </>
            )}
          </div>
        </div>

        <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest shrink-0">
          {userMsgs.length} {userMsgs.length === 1 ? 'msg' : 'msgs'}
        </span>
      </div>

      {/* Messages feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 px-0.5">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isOwn    = msg.senderId === identity.id;
            const isSystem = msg.senderId === 'system';
            const prevMsg  = messages[i - 1];
            const prevSame = !!prevMsg && prevMsg.senderId === msg.senderId;
            return (
              <MsgBubble
                key={msg.id}
                msg={msg}
                isOwn={isOwn}
                isSystem={isSystem}
                showSender={!prevSame}
                showAvatar={!prevSame}
                inDm={room.type === 'dm'}
              />
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {userMsgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-3 mt-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              {room.type === 'dm'
                ? <Lock className="w-6 h-6 text-zinc-700" />
                : <Hash className="w-6 h-6 text-zinc-700" />}
            </div>
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center max-w-[200px]">
              {room.type === 'dm'
                ? `Inicio de conversación con ${otherMember?.name.split(' ')[0]}`
                : 'Sé el primero en escribir en el canal'}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 pt-3">
        <div className="glass-elegant rounded-[2rem] p-3 flex items-end gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 mb-0.5"
            style={{ backgroundColor: identity.color }}
          >
            {identity.initials}
          </div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              room.type === 'dm'
                ? `Mensaje privado a ${otherMember?.name.split(' ')[0]}…`
                : 'Escribe en el canal… (Enter para enviar)'
            }
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed overflow-hidden no-scrollbar py-1.5 min-h-[1.5rem]"
          />

          {input && (
            <button
              onClick={() => { setInput(''); if (inputRef.current) inputRef.current.style.height = 'auto'; }}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 transition-all shrink-0 mb-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0',
              input.trim() && !sending
                ? 'bg-industrial-accent text-white shadow-[0_4px_15px_rgba(211,125,40,0.35)] active:scale-90 hover:scale-105'
                : 'bg-white/5 text-zinc-600 cursor-not-allowed',
            )}
          >
            {sending
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [identity, setIdentity]           = useState<Identity | null>(null);
  const [identityLoaded, setIdentityLoaded] = useState(false);
  const [activeRoom, setActiveRoom]       = useState<RoomDef | null>(null);
  const [navDirection, setNavDirection]   = useState<'forward' | 'back'>('forward');
  const [allMessages, setAllMessages]     = useState<Message[]>([]);
  const latestTsRef = useRef(0);

  // ── Load identity ──────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('chatIdentity');
    if (stored) setIdentity(JSON.parse(stored));
    setIdentityLoaded(true);
  }, []);

  // ── Mark visited (nav badge reset) ────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('lastChatVisit', String(Date.now()));
  }, []);

  // ── Fetch messages (with dedup) ────────────────────────────────────────────
  const loadMessages = useCallback(async (since: number) => {
    try {
      const res  = await fetch(`/api/chat?since=${since}`);
      const data = await res.json();
      if (!data.messages?.length) return;
      setAllMessages(prev => {
        const ids  = new Set(prev.map(m => m.id));
        const fresh = (data.messages as Message[]).filter(m => !ids.has(m.id));
        if (!fresh.length) return prev;
        return [...prev, ...fresh];
      });
      latestTsRef.current = Math.max(
        latestTsRef.current,
        ...(data.messages as Message[]).map(m => m.timestamp),
      );
    } catch { /* silent */ }
  }, []);

  // ── Initial load + polling (2.5 s) ────────────────────────────────────────
  useEffect(() => {
    if (!identity) return;
    loadMessages(0);
    const id = setInterval(() => loadMessages(latestTsRef.current), 2500);
    return () => clearInterval(id);
  }, [identity, loadMessages]);

  // ── Send message (optimistic) ─────────────────────────────────────────────
  const sendToRoom = useCallback(async (roomId: string, text: string) => {
    if (!identity) return;
    const tempId  = `temp_${Date.now()}`;
    const tempMsg: Message = {
      id: tempId, room: roomId, text,
      sender: identity.name, senderId: identity.id,
      color: identity.color, timestamp: Date.now(), pending: true,
    };

    // Optimistic add
    setAllMessages(prev => [...prev, tempMsg]);

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: roomId, text, sender: identity.name, senderId: identity.id }),
      });
      const data = await res.json();
      // Replace temp with confirmed message
      setAllMessages(prev => prev.map(m => m.id === tempId ? { ...data.message, pending: false } : m));
      latestTsRef.current = Math.max(latestTsRef.current, data.message.timestamp);
    } catch {
      // Remove failed temp
      setAllMessages(prev => prev.filter(m => m.id !== tempId));
    }
  }, [identity]);

  // ── Identity selection ────────────────────────────────────────────────────
  const selectIdentity = (member: TeamMember) => {
    const id: Identity = {
      id: member.id, name: member.name,
      initials: member.initials, color: member.color,
    };
    localStorage.setItem('chatIdentity', JSON.stringify(id));
    setIdentity(id);
  };

  const clearIdentity = () => {
    setIdentity(null);
    setActiveRoom(null);
    localStorage.removeItem('chatIdentity');
  };

  // ── Room navigation ───────────────────────────────────────────────────────
  const openRoom = (room: RoomDef) => {
    setNavDirection('forward');
    setActiveRoom(room);
  };

  const closeRoom = () => {
    setNavDirection('back');
    setActiveRoom(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (!identityLoaded) return null;

  if (!identity) {
    return <IdentityPicker onSelect={selectIdentity} />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {activeRoom ? (
        <ChatRoom
          key={activeRoom.id}
          room={activeRoom}
          identity={identity}
          allMessages={allMessages}
          onClose={closeRoom}
          sendToRoom={sendToRoom}
          direction={navDirection}
        />
      ) : (
        <ChatList
          key="list"
          identity={identity}
          allMessages={allMessages}
          onOpenRoom={openRoom}
          onChangeIdentity={clearIdentity}
          direction={navDirection}
        />
      )}
    </AnimatePresence>
  );
}
