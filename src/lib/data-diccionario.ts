import { Cpu, Activity, Network, Zap, Watch, Repeat, Shield, Eye } from "lucide-react";

export interface TechComponent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: "Control" | "Motor" | "Seguridad" | "Sensores";
  location: string;
  maintenanceInterval: string;
  safetyNotes: string;
  replacementProtocol: string;
  technicalSpecs: string[];
}

export const componentsData: TechComponent[] = [
  {
    id: "scu",
    name: "SCU",
    description: "La unidad SCU (System Control Unit) actúa como el cerebro de automatización de nivel inferior del clasificador. Basada en un PLC Siemens de alto rendimiento, procesa todas las señales críticas de campo en tiempo real. Controla el anillo de red Profinet y garantiza que todas las interacciones de hardware cumplan con los estándares de seguridad.",
    icon: Cpu,
    category: "Control",
    location: "Armario de Control Principal (Main Cabinet)",
    maintenanceInterval: "Anual (Inspección conexiones)",
    safetyNotes: "Riesgo eléctrico. Desconectar alimentación general antes de manipular.",
    replacementProtocol: "Requiere backup previo de parámetros vía Ethernet. Reconfigurar IP tras instalación.",
    technicalSpecs: ["Tensión de alimentación: 24V DC", "Interfaces: PROFINET / Ethernet", "Feedback local con display"]
  },
  {
    id: "fsc",
    name: "FSC",
    description: "El servidor FSC (Flow System Control) es el nodo informático de nivel superior de encargado de la optimización del flujo. Mientras el SCU controla el hardware, el FSC decide el destino de cada paquete, maneja algoritmos de prevención de cuellos de botella y gestiona las ventanas de inducción simultáneas.",
    icon: Activity,
    category: "Control",
    location: "Servidor de Control / Rack IT",
    maintenanceInterval: "Mensual (Limpieza de logs)",
    safetyNotes: "Crítico operativo. Su apagado detiene toda la planta.",
    replacementProtocol: "Swap de hardware guiado por L2. Disco en espejo.",
    technicalSpecs: ["S.O: Linux/Windows Server", "Sincronización BBDD tiempo real", "Regulación de rampas de inducción"]
  },
  {
    id: "scalance",
    name: "Switch Ethernet Scalance",
    description: "Los switches industriales Siemens Scalance son la columna vertebral de la topología en anillo óptico de la red Profinet. Gracias al protocolo de redundancia de medios (MRP), si un segmento del cable se corta, el Scalance reconfigura la red en menos de 200ms, asegurando la comunicación ininterrumpida.",
    icon: Network,
    category: "Control",
    location: "Armarios de campo y Main Cabinet",
    maintenanceInterval: "Anual (Verificación de puertos y soplado)",
    safetyNotes: "Evitar curvaturas extremas en FO o Cat6.",
    replacementProtocol: "Configuración Plug-in (C-Plug). Reiniciar tras insertar clavija.",
    technicalSpecs: ["Redundancia RSTP nativa", "Puertos híbridos RJ45/FO", "Certificación industrial IP20"]
  },
  {
    id: "motores-bf",
    name: "Motores BF",
    description: "Los motores manorreductores SEW de bajo rozamiento actúan como la fuerza motriz del sistema. Su diseño de corona y su robusta carcasa están específicamente calibrados para suministrar un torque instantáneo garantizando que la posición teórica dictada coincida milimétricamente con las zapatas.",
    icon: Zap,
    category: "Motor",
    location: "Tambores de tracción y divergencias",
    maintenanceInterval: "Preventivo cada 35.000h de operación",
    safetyNotes: "Superficie muy caliente. Partes mecánicas rotativas sin resguardo tras tapas.",
    replacementProtocol: "Alinear y tensar tras cambio. Calibrar encóder si dispone de lazo cerrado.",
    technicalSpecs: ["Freno magnético 24VDC acoplado", "Tensión nominal: 400V 3Ph", "IP55/IP66 según housing"]
  },
  {
    id: "watchdog",
    name: "WatchDog",
    description: "El circuito WatchDog es un supervisor de hardware de nivel 0, diseñado para vigilar constantemente el 'latido de vida' (heartbeat) del PLC. Si detecta la ausencia de la señal, abre los relés maestros provocando una Parada Controlada Sincronizada (SS1) de la instalación.",
    icon: Watch,
    category: "Seguridad",
    location: "PLC Principal (SCU Rack)",
    maintenanceInterval: "Semestral (Test de simulación SS1)",
    safetyNotes: "Actúa sobre relés master. Provoca parada crítica Safe Stop 1.",
    replacementProtocol: "Cambio de módulo hardware sin reprogramación.",
    technicalSpecs: ["Tiempo de reacción < 20ms", "Reset puramente manual", "Diodo LED indicador Naranja"]
  },
  {
    id: "variadores",
    name: "Variadores movidrive",
    description: "Los drives SEW Movidrive gestionan la conversión de potencia enviada a los servomotores. Controlan dinámicamente la corriente mediante PWM. En el Sorter, parametrizan rígidas 'Rampas-S' que suavizan los tirones mecánicos al arrancar, evitando deslizamientos del producto sobre el Carrier.",
    icon: Repeat,
    category: "Motor",
    location: "Sectores de Potencia (Drive Cabinets)",
    maintenanceInterval: "Anual (Sustitución de ventiladores de refrigeración)",
    safetyNotes: "PELIGRO: Esperar 10 min tras apagar. Condensadores cargados a >500V.",
    replacementProtocol: "Extraer panel parametrizador (keypad) y sustituir variador base.",
    technicalSpecs: ["Rampas S configurables", "Control Vectorial Integrado", "Bus DC para ahorro energético"]
  },
  {
    id: "proteccion-termica",
    name: "Protección térmica",
    description: "Los disyuntores guardamotores o protecciones térmicas son el último salvavidas electromecánico del sistema. Monitorean continuamente el amperaje consumido por fase; si un motor sufre un bloqueo mecánico y la intensidad se eleva, el circuito de potencia se interrumpe inmediatamente.",
    icon: Shield,
    category: "Seguridad",
    location: "Gabinete CCM (Control Motores)",
    maintenanceInterval: "Semestral (Reapriete de terminales M4)",
    safetyNotes: "No rearmar sin comprobar atascos mecánicos en línea.",
    replacementProtocol: "Clonar valor de la ruleta de intensidad máxima durante el cambio.",
    technicalSpecs: ["Disparo por clase térmica 10A", "Sensibilidad a pérdida de fase", "Rango de calibración decimal"]
  },
  {
    id: "fotocelula",
    name: "Foto-célula tipo espejo",
    description: "Las fotocélulas retrorreflectivas forman los 'ojos' del sistema periférico. Equipadas con filtros polarizados, ignoran los reflejos generados por plásticos de embalaje y detectan la interrupción de su haz infrarrojo. Son vitales para el dimensionamiento geométrico y control logístico de colas.",
    icon: Eye,
    category: "Sensores",
    location: "Perfiles de transportador, Rampas de Inyección",
    maintenanceInterval: "Semanal (Limpieza de cristal emisor y reflector)",
    safetyNotes: "Cuidado al limpiar. No usar disolventes abrasivos en lentes de metacrilato.",
    replacementProtocol: "Alineamiento fino de rayo luz roja post-cambio. Comprobar LED verde.",
    technicalSpecs: ["Señal de salida Push-Pull", "Rango eficaz: 0.1 a 12 metros", "Aislamiento NEMA 4X / IP67"]
  }
];
