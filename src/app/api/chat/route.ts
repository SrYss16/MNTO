import { NextRequest, NextResponse } from 'next/server';

export interface ChatMessage {
  id: string;
  room: string;      // 'general' | DM room key
  text: string;
  sender: string;
  senderId: string;
  color: string;
  timestamp: number;
}

declare global {
  var _chatStore: ChatMessage[] | undefined;
}

const COLORS: Record<string, string> = {
  'yakub-sidibe':       '#D37D28',
  'daniel-jimenez':     '#3b82f6',
  'alejandro-carvajal': '#a855f7',
  'karim-el-hannach':   '#10b981',
};

function getStore(): ChatMessage[] {
  if (!global._chatStore) {
    global._chatStore = [
      {
        id: 'sys-init',
        room: 'general',
        text: 'Canal de comunicación técnica activo. Bienvenidos al turno.',
        sender: 'Sistema',
        senderId: 'system',
        color: '#00E676',
        timestamp: Date.now() - 3600000,
      },
    ];
  }
  return global._chatStore;
}

export async function GET(req: NextRequest) {
  const since  = Number(req.nextUrl.searchParams.get('since') ?? 0);
  const room   = req.nextUrl.searchParams.get('room');          // optional filter
  let messages = getStore().filter(m => m.timestamp > since);
  if (room) messages = messages.filter(m => m.room === room);
  return NextResponse.json({ messages, ts: Date.now() });
}

export async function POST(req: NextRequest) {
  const { room = 'general', text, sender, senderId } = await req.json();
  if (!text?.trim() || !sender || !senderId) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const msg: ChatMessage = {
    id: crypto.randomUUID(),
    room,
    text: text.trim(),
    sender,
    senderId,
    color: COLORS[senderId] ?? '#D37D28',
    timestamp: Date.now(),
  };
  const store = getStore();
  store.push(msg);
  if (store.length > 500) store.splice(0, store.length - 500);
  return NextResponse.json({ message: msg });
}
