"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, HardHat, Book, FileText, Users,
  MessageSquare, ShieldCheck, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Inicio',      href: '/',           icon: Home },
  { name: 'Máquinas',   href: '/maquinas',    icon: HardHat },
  { name: 'Chat',        href: '/chat',        icon: MessageSquare, badge: true },
  { name: 'Jefe',        href: '/jefe',        icon: ShieldCheck },
  { name: 'Diccionario', href: '/diccionario', icon: Book },
  { name: 'Reportar',   href: '/reportar',    icon: FileText },
  { name: 'Equipo',      href: '/equipo',      icon: Users },
];

// Bottom nav shows the 5 most-used items on mobile
const bottomItems = [
  { name: 'Inicio',    href: '/',        icon: Home },
  { name: 'Máquinas', href: '/maquinas', icon: HardHat },
  { name: 'Chat',      href: '/chat',    icon: MessageSquare, badge: true },
  { name: 'Reportar', href: '/reportar', icon: FileText },
  { name: 'Jefe',      href: '/jefe',    icon: ShieldCheck },
];

function useChatUnread(pathname: string | null): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (pathname === '/chat') {
      setCount(0);
      return;
    }

    const check = async () => {
      try {
        const last = localStorage.getItem('lastChatVisit') ?? '0';
        const res = await fetch(`/api/chat?since=${last}`);
        const data = await res.json();
        const unread = (data.messages ?? []).filter(
          (m: { senderId: string }) => m.senderId !== 'system'
        ).length;
        setCount(unread);
      } catch {
        // silent
      }
    };

    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [pathname]);

  return count;
}

export function Sidebar() {
  const pathname = usePathname();
  const chatUnread = useChatUnread(pathname);

  return (
    <aside className="hidden md:flex flex-col w-72 h-[calc(100vh-2rem)] sticky top-4 m-4">
      <div className="flex-1 glass-elegant rounded-[2rem] p-4 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-industrial-accent to-[#b06a21] flex items-center justify-center font-bold text-white text-sm shadow-lg">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                <span className="text-industrial-accent">C</span>ACESA
              </h1>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-0.5">Maintenance App</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.badge && chatUnread > 0 && pathname !== item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-industrial-accent text-white shadow-[0_4px_20px_rgba(211,125,40,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className="relative">
                  <item.icon className={cn('w-5 h-5', isActive ? 'text-white' : 'group-hover:text-industrial-accent transition-colors')} />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-industrial-accent rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-[#2C3539]">
                      {chatUnread > 9 ? '9+' : chatUnread}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-3 border-t border-white/5 mt-3">
          <Link
            href="/config"
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>Configuración</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const chatUnread = useChatUnread(pathname);

  return (
    <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
      <div className="glass-elegant rounded-full px-3 py-2 flex justify-between items-center shadow-2xl">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.badge && chatUnread > 0 && !isActive;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-200 relative',
                isActive ? 'text-industrial-accent' : 'text-zinc-500 active:scale-90'
              )}
            >
              <div className="relative">
                <item.icon className={cn('w-6 h-6 transition-transform', isActive && 'scale-110')} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-industrial-accent rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-[#364146]">
                    {chatUnread > 9 ? '9+' : chatUnread}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[8px] font-bold uppercase tracking-widest mt-0.5 transition-all',
                isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
