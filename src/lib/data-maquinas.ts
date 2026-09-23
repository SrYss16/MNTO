export interface MachinePart {
  name: string;
  description: string;
  icon?: string;
}

export interface MachineSpec {
  label: string;
  value: string;
  category: 'electric' | 'mechanical' | 'performance' | 'dimension';
}

export interface MachineManual {
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface TrainingPoint {
  title: string;
  description?: string;
  items?: string[];
}

export interface TrainingSection {
  title: string;
  icon?: string;
  points: TrainingPoint[];
}

export interface Machine {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  definition?: string;
  structure?: string[];
  image: string;
  parts: MachinePart[];
  specs?: MachineSpec[];
  gallery?: string[];
  manuals?: MachineManual[];
  trainingData?: TrainingSection[];
}

export const machines: Machine[] = [
  {
    id: "fsc",
    name: "FSC",
    description: "Fieldbus Signal Converter",
    fullDescription: "Convertidor de señales de bus de campo de alta precisión diseñado para entornos industriales críticos.",
    definition: "Convierte señales de un tipo de bus de campo a otro, permitiendo la comunicación entre dispositivos con diferentes protocolos en sistemas de automatización industrial.",
    structure: [
      "Fieldbus Interface",
      "Signal Processor",
      "Protocol Converter",
      "I/O Modules",
      "Power Supply Interface"
    ],
    image: "/images/maquinas/fsc.png",
    gallery: [
      "/images/maquinas/fsc.png",
      "/images/maquinas/fsc.png",
      "/images/maquinas/fsc.png"
    ],
    specs: [
      { label: "Voltaje de Entrada", value: "24V DC / 230V AC", category: "electric" },
      { label: "Consumo Potencia", value: "15W", category: "electric" },
      { label: "Protocolos", value: "ProfiNet, Bus-CAN, EtherCAT", category: "performance" },
      { label: "Temp. Operativa", value: "-10°C a +55°C", category: "performance" },
      { label: "Dimensiones", value: "200x150x80 mm", category: "dimension" },
      { label: "Peso", value: "1.2 kg", category: "dimension" }
    ],
    manuals: [
      { name: "Manual de Instalación FSC", type: "PDF", size: "2.4 MB", url: "/manuals/formacion.pdf" },
      { name: "Guía de Configuración Protocolos", type: "PDF", size: "1.8 MB", url: "/manuals/mantenimiento.pdf" },
      { name: "Esquema Eléctrico FSC-V1", type: "DWG", size: "5.2 MB", url: "/manuals/seguridad.pdf" }
    ],
    parts: [
      { name: "PLC", description: "Controlador digital industrial de alta fiabilidad." },
      { name: "CCC", description: "Consola de control para supervisión centralizada." },
      { name: "SCU", description: "Unidad para acondicionamiento y filtrado de señales." }
    ]
  },
  {
    id: "compax-sorter",
    name: "Compax Sorter",
    description: "Transportador clasificador de alta velocidad.",
    fullDescription: "El Compax Sorter es un sistema de clasificación modular que utiliza tecnología de zapatas deslizantes para una distribución precisa y eficiente.",
    definition: "Sistema de clasificación de alta velocidad (0.5 a 2.5 m/s) que utiliza divert-shoes sobre lamas de aluminio. Diseñado para bultos de entre 100mm y 500mm, con capacidad de hasta 15,000 bultos/h.",
    structure: [
      "SCU (Switch Control Unit)",
      "Divert-shoe (Zapata de Desvío)",
      "Pin de Desvío (Punto débil de seguridad)",
      "Lamas de Clasificación (Slats)",
      "Unidad de Tensión (ETU)",
      "Cuña de Seguridad Mecánica",
      "Sensores de Proximidad (Tensión/Pasadores)",
      "Drive Unit (Motor-Reductor)"
    ],
    image: "/images/maquinas/compax.jpg",
    gallery: [
      "/images/maquinas/compax.jpg",
      "/images/maquinas/compax.jpg"
    ],
    specs: [
      { label: "Velocidad Operativa", value: "0.5 - 2.5 m/s", category: "performance" },
      { label: "Capacidad Máxima", value: "15,000 bultos/h", category: "performance" },
      { label: "Largo Bulto (Máx/Min)", value: "500 / 100 mm", category: "dimension" },
      { label: "Peso Bulto (Máx/Min)", value: "10 / 0.03 kg", category: "performance" },
      { label: "Voltaje Control SCU", value: "24V DC", category: "electric" },
      { label: "Nivel Sonoro", value: "< 70 dB(A)", category: "performance" }
    ],
    manuals: [
      { name: "Formación Básica Compaxorter", type: "PDF", size: "3.8 MB", url: "/manuals/Formacion basica compaxorter.pdf" },
      { name: "Manual de Mantenimiento Técnico", type: "PDF", size: "12.7 MB", url: "/manuals/Mantenimiento compaxorter.PDF" },
      { name: "Protocolos de Seguridad Vanderlande", type: "PDF", size: "3.1 MB", url: "/manuals/seguridad.pdf" }
    ],
    parts: [
      { name: "SCU (Switch Control Unit)", description: "Control local con feedback y autotest para mantenimiento." },
      { name: "Brushless Motor 24VDC", description: "Accionamiento de alta velocidad para el desvío de zapatas." },
      { name: "Safety Wedge (Cuña)", description: "Protección mecánica que detiene el sistema ante fallos de pasador." }
    ],
    trainingData: [
      {
        title: "Elementos Mecánicos y Transporte",
        icon: "Settings",
        points: [
          {
            title: "Configuración de Bastidor",
            description: "Interruptores duales posicionados en las salidas (izq/der) que soportan la clasificación bidireccional."
          },
          {
            title: "Principio de Transporte",
            description: "El sistema utiliza compartimentos formados por 5 Carriers.",
            items: ["Cadena de tracción", "Ruedas laterales y pletinas de bloqueo", "Pin de cadena y tuerca de carriers", "Cepillos de limpieza"]
          },
          {
            title: "Unidades de Tensión (ETU)",
            description: "Uso de rodillos tensores (Ø 75) y de seguimiento (Ø 62) para mantener la tensión óptima de la cinta."
          }
        ]
      },
      {
        title: "Sistema de Clasificación",
        icon: "Zap",
        points: [
          {
            title: "Arquitectura de Desvío",
            description: "Compuesta por el Divert-shoe (zapata), el Pin de desvío y el Sort beam.",
            items: ["Rueda guía del pin", "Perfil de guía del pasador", "Interruptor de desvío (Merge)"]
          },
          {
            title: "Pre-sort Switch",
            description: "Las zapatas se pre-alinean según el destino conocido 4 metros antes de la entrada al sorter."
          }
        ]
      },
      {
        title: "Sistemas de Control (SCU)",
        icon: "Cpu",
        points: [
          {
            title: "Switch Control Unit (SCU)",
            description: "Todas las unidades son idénticas; la función (izq/der) se define mediante el switch en el enchufe de alimentación.",
            items: ["Control local y Status feedback", "Autotest local para mantenimiento", "I/O directa simplificada"]
          },
          {
            title: "Accionamiento",
            description: "Motor Brushless DC con suministro de 24VDC, capaz de operar entre 0.5 m/s y 2.5 m/s."
          },
          {
            title: "Parcel Tracking",
            description: "Seguimiento mediante PLC usando encoders en motores y ETU, sincronizados con fotocélulas en la carga y el drive."
          }
        ]
      },
      {
        title: "Seguridad Industrial",
        icon: "ShieldAlert",
        points: [
          {
            title: "Pasador de Desviación",
            description: "Diseñado con un 'punto débil' (fusible mecánico) para romperse en caso de bloqueo, evitando daños mayores."
          },
          {
            title: "Detección de Fallos Críticos",
            description: "Sensores de proximidad y fotocélulas que detienen el sistema inmediatamente ante:",
            items: ["Pasador faltante", "Viga faltante (pérdida de lamas)", "Cadena floja (estiramiento detectado en piñones)", "Activación de Cuña de Seguridad"]
          }
        ]
      },
      {
        title: "Solución de Problemas",
        icon: "AlertTriangle",
        points: [
          {
            title: "Paquetes no clasificados",
            items: ["Verificar si la línea de salida está llena", "Chequear error de paquete perdido en PEC", "Validar funcionalidad del interruptor mediante botón de test en SCU", "Cargar tabla de destinos"]
          },
          {
            title: "Fallos de Posicionamiento",
            description: "Si el pívot no cambia de posición, verificar sensor dañado o caída de tensión en el suministro de 24VDC."
          }
        ]
      }
    ]
  },
  {
    id: "mailbox-sorter",
    name: "Mailbox Sorter",
    description: "Sistema de clasificación ultra-compacto.",
    fullDescription: "Especialmente diseñado para el sector postal y de paquetería pequeña, el Mailbox Sorter maximiza el número de salidas en espacios reducidos.",
    definition: "Máquina automatizada utilizada para organizar envíos de acuerdo con criterios de destino, tamaño y tipo de servicio, optimizando el manejo de grandes volúmenes.",
    structure: [
      "Unidad de Alimentación",
      "Bandejas de Clasificación",
      "Mecanismo de Caída Libre",
      "Sistema de Visión Artificial",
      "Tolvas de Salida"
    ],
    image: "/images/maquinas/mailbox.jpg",
    gallery: [
      "/images/maquinas/mailbox.jpg"
    ],
    specs: [
      { label: "Capacidad", value: "12,000 sobres/h", category: "performance" },
      { label: "Precisión de Clasificación", value: "99.98%", category: "performance" },
      { label: "Consumo Aire", value: "250 L/min", category: "mechanical" },
      { label: "Alimentación Eléctrica", value: "400V 3PH", category: "electric" },
      { label: "Altura de Trabajo", value: "1100 mm", category: "dimension" }
    ],
    manuals: [
      { name: "Manual de Usuario Mailbox", type: "PDF", size: "5.4 MB", url: "#" },
      { name: "Esquemas de Conexión Sensores", type: "DWG", size: "3.7 MB", url: "#" }
    ],
    parts: [
      { name: "Sistema de Carga", description: "Cinta de alimentación con separador dinámico." },
      { name: "Módulo OCR", description: "Cámaras de alta velocidad para lectura de etiquetas." }
    ]
  },
  {
    id: "crossbelt-sorter",
    name: "Crossbelt Sorter",
    description: "Clasificación transversal de alta precisión.",
    fullDescription: "El estándar de oro en clasificación de alta velocidad, permitiendo el manejo de casi cualquier tipo de producto sin importar su forma o textura.",
    definition: "Sistema automatizado para la clasificación eficiente de productos que utiliza cintas transversales individuales montadas sobre carros motorizados.",
    structure: [
      "Circuito de Rodadura Principal",
      "Carros Portadores (Chassis)",
      "Bandas de Descarga Transversal",
      "Bus de Datos Inalámbrico",
      "Sistema de Tracción Lineal"
    ],
    image: "/images/maquinas/crossbelt.jpg",
    gallery: [
      "/images/maquinas/crossbelt.jpg"
    ],
    specs: [
      { label: "Velocidad Máxima", value: "3.2 m/s", category: "performance" },
      { label: "Peso Máximo Bulto", value: "35 kg", category: "performance" },
      { label: "Tipo de Motor", value: "Motor Lineal (LIM)", category: "electric" },
      { label: "Radio de Giro", value: "1500 mm", category: "dimension" },
      { label: "Eficiencia Energética", value: "Grado IE4", category: "performance" }
    ],
    manuals: [
      { name: "Guía de Mantenimiento de Bandas", type: "PDF", size: "9.1 MB", url: "#" },
      { name: "Manual Técnico Hardware Control", type: "PDF", size: "18.3 MB", url: "#" },
      { name: "Diagramas de Red Industrial", type: "PDF", size: "4.5 MB", url: "#" }
    ],
    parts: [
      { name: "Cintas Transversales", description: "Banda motorizada independiente para cada bulto." },
      { name: "Inducción Dinámica", description: "Aportación de carga sincronizada con el carro." }
    ]
  }
];
