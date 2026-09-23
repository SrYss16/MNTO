import { NextRequest, NextResponse } from 'next/server';

export interface Task {
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

declare global {
  var _taskStore: Task[] | undefined;
}

function getStore(): Task[] {
  if (!global._taskStore) {
    const now = Date.now();
    global._taskStore = [
      {
        id: 'task-1',
        title: 'Inspección fotocélulas CB Sorter',
        description: 'Limpiar y verificar el correcto funcionamiento de todas las fotocélulas de carga y descarga del CB Sorter.',
        assignedTo: 'daniel-jimenez',
        assignedToName: 'Daniel Jiménez',
        assignedBy: 'Yakub Sidibe',
        priority: 'medium',
        status: 'pending',
        machine: 'Compax Sorter',
        deadline: new Date(now + 86400000).toISOString().split('T')[0],
        createdAt: now - 7200000,
        updatedAt: now - 7200000,
      },
      {
        id: 'task-2',
        title: 'Calibración sensores SCU — Mailbox',
        description: 'Verificar parámetros de calibración de todas las SCUs en la línea Mailbox según protocolo Q-210.',
        assignedTo: 'alejandro-carvajal',
        assignedToName: 'Alejandro Carvajal',
        assignedBy: 'Yakub Sidibe',
        priority: 'high',
        status: 'in-progress',
        machine: 'Mailbox Sorter',
        deadline: new Date(now + 3600000 * 5).toISOString().split('T')[0],
        createdAt: now - 14400000,
        updatedAt: now - 3600000,
      },
      {
        id: 'task-3',
        title: 'Revisión variadores MS Sorter',
        description: 'Comprobar temperatura y estado de los variadores del Mailbox tras la alarma registrada ayer.',
        assignedTo: 'karim-el-hannach',
        assignedToName: 'Karim El-Hannach',
        assignedBy: 'Yakub Sidibe',
        priority: 'high',
        status: 'done',
        machine: 'Mailbox Sorter',
        createdAt: now - 86400000,
        updatedAt: now - 18000000,
      },
    ];
  }
  return global._taskStore;
}

export async function GET() {
  return NextResponse.json({ tasks: getStore() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, assignedTo, assignedToName, assignedBy, priority, machine, deadline } = body;
  if (!title || !assignedTo || !assignedBy) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    description: description ?? '',
    assignedTo,
    assignedToName,
    assignedBy,
    priority: priority ?? 'medium',
    status: 'pending',
    machine: machine || undefined,
    deadline: deadline || undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  getStore().push(task);
  return NextResponse.json({ task }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const store = getStore();
  const idx = store.findIndex(t => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  store[idx] = { ...store[idx], ...body, updatedAt: Date.now() };
  return NextResponse.json({ task: store[idx] });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const store = getStore();
  const idx = store.findIndex(t => t.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  store.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
