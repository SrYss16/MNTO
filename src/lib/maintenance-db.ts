export interface Component {
  id: string;
  name: string;
  section: string;
  function: string;
  image: string;
  safetyNotes: string;
  maintenanceInterval: string;
}

export interface DiagnosisEntry {
  id: string;
  symptom: string;
  category: "mechanical" | "electrical" | "control" | "sensor";
  probableCause: string;
  steps: string[];
  priority: "high" | "medium" | "low";
}

export interface MaintenanceLog {
  id: string;
  date: string;
  technicianId: string;
  type: "preventive" | "corrective";
  checklistCompleted: boolean;
  observations: string;
}

export const Diccionario_Tecnico: Component[] = [
  {
    id: "carrier-v1",
    name: "Carrier (Unidad de Transporte)",
    section: "Transporte / Mecánica",
    function: "Elemento base del compartimento. Soporta la zapata y el bulto.",
    image: "/images/manual/image_0d0a85.png",
    safetyNotes: "Verificar integridad de la rueda de pletina de bloqueo.",
    maintenanceInterval: "Inspección semanal / Ajuste semestral"
  },
  {
    id: "scu-v1",
    name: "SCU (Switch Control Unit)",
    section: "Clasificación / Control",
    function: "Control inteligente del motor brushless de desvío.",
    image: "/images/manual/image_0d0a08.png",
    safetyNotes: "Desenergizar antes de manipular conectores bus de campo.",
    maintenanceInterval: "Verificación de firmware anual"
  },
  {
    id: "etu-intake",
    name: "Cinta de Carga (ETU Intake)",
    section: "Inducción",
    function: "Sincroniza la entrada del paquete con el hueco del sorter.",
    image: "/images/manual/image_0d0745.png",
    safetyNotes: "Mantener limpios los sensores ópticos de detección.",
    maintenanceInterval: "Limpieza profunda mensual"
  },
  {
    id: "brushless-motor",
    name: "Motor Brushless 24VDC",
    section: "Desviador",
    function: "Proporciona el impulso de alta velocidad para la zapata.",
    image: "/images/manual/image_0d0a08.png",
    safetyNotes: "Verificar cables de alimentación ante posibles roces.",
    maintenanceInterval: "Comprobar temperatura cada 3 meses"
  }
];

export const Solucion_Problemas: DiagnosisEntry[] = [
  {
    id: "diag-001",
    symptom: "Paquetes no clasificados (Destino No Conocido)",
    category: "control",
    probableCause: "Atasco o bloqueo en el pre-sort switch / No mover paquetes tras scanner.",
    steps: [
      "Despejar cinta de cualquier bulto apelmazado.",
      "Reiniciar contador de seguimiento en la estación CCC.",
      "Evitar manipulación manual tras el túnel de lectura."
    ],
    priority: "high"
  },
  {
    id: "diag-002",
    symptom: "La clasificadora se detiene (Parada de Emergencia)",
    category: "sensor",
    probableCause: "Dispositivo de seguridad activado / Ausencia de perno fusible o holgura de cadena.",
    steps: [
      "Verificar holgura de la cadena en el ETU.",
      "Localizar y sustituir pasador fusible dañado.",
      "Confirmar ausencia de objetos extraños en el rail."
    ],
    priority: "high"
  },
  {
    id: "diag-003",
    symptom: "Ruido anómalo (Golpeteo)",
    category: "mechanical",
    probableCause: "Desviador roto o lama de clasificación suelta.",
    steps: [
      "Sustituir pieza dañada (Ver pág. 71 del manual técnico).",
      "Apretar pernos de sujección de la lama afectada.",
      "Engrasar rail de retorno si presenta fricción excesiva."
    ],
    priority: "medium"
  }
];

export const preventiveTasks = {
  weekly: [
    "Limpieza de fotocélulas de carga y descarga.",
    "Inspección visual de desgaste en cepillos de carriers.",
    "Verificación de tensión de cadena en el ETU.",
    "Check de ruidos anómalos en el motor principal."
  ],
  quarterly: [
    "Engrase de rodamientos de piñones tractores.",
    "Apretado general de tornillería de lamas.",
    "Calibración de sensores de proximidad SCU.",
    "Inspección de estado de cables de bus de campo."
  ],
  annual: [
    "Sustitución preventiva de pasadores de seguridad.",
    "Limpieza integral de raíles de clasificación.",
    "Prueba de carga máxima y eficiencia energética.",
    "Actualización de firmware de unidades SCU (si aplica)."
  ]
};
