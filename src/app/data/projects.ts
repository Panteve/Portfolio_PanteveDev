export type ProjectStatus = 'terminado' | 'en-desarrollo' | 'en-pausa';
export type ProjectType = 'web' | 'escritorio' | 'movil' | 'juegos' | 'diseno';
export type ProjectOrigin = 'personal' | 'académico' | 'laboral';
export type ProjectTone = 'teal' | 'violet' | 'amber' | 'rose' | 'sky' | 'lime';

export interface Project {
  id: string;
  name: string;
  /** Identificador corto que se muestra en la miniatura. */
  code: string;
  summary: string;
  problem: string;
  technologies: string[];
  /** Tipo principal del proyecto; se usa para el filtro "Tipo". */
  tipo: ProjectType;
  status: ProjectStatus;
  /** Origen del proyecto; se muestra en el pie de la tarjeta. */
  origen: ProjectOrigin;
  /** Año de realización; se muestra en el pie de la tarjeta. */
  anio: number;
  /** Captura o GIF del proyecto. Vacío = placeholder. */
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  tone: ProjectTone;
  /** El POS necesita un diagrama de arquitectura que todavía no existe. */
  needsArchitectureDiagram?: boolean;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  terminado: 'terminado',
  'en-desarrollo': 'en desarrollo',
  'en-pausa': 'en pausa',
};

export interface ProjectTypeOption {
  value: ProjectType;
  label: string;
}

export const PROJECT_TYPES: ProjectTypeOption[] = [
  { value: 'web', label: 'Web' },
  { value: 'escritorio', label: 'Escritorio' },
  { value: 'movil', label: 'Móvil' },
  { value: 'juegos', label: 'Juegos' },
  { value: 'diseno', label: 'Diseño' },
];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: 'Web',
  escritorio: 'Escritorio',
  movil: 'Móvil',
  juegos: 'Juegos',
  diseno: 'Diseño',
};

export const PROJECTS: Project[] = [
  {
    id: 'pos-multisucursal',
    name: 'POS multisucursal',
    code: 'POS',
    summary:
      'Punto de venta de escritorio para varias sucursales: facturación electrónica, inventario en tiempo real y ventas que no dependen de la conexión.',
    problem:
      'Varias cajas vendiendo a la vez no pueden pelearse por el mismo inventario. Y si la red se cae, la tienda no puede dejar de facturar: el sistema trabaja offline y sincroniza cuando vuelve la conexión.',
    technologies: [
      'Angular',
      'NgRx Signal Store',
      'NestJS',
      'Prisma',
      'PostgreSQL',
      'Electron',
    ],
    tipo: 'escritorio',
    status: 'en-pausa',
    // TODO(diego): confirmar origen y año.
    origen: 'personal',
    anio: 2025,
    // TODO(diego): capturas reales del POS.
    imageUrl: '',
    featured: true,
    tone: 'teal',
    needsArchitectureDiagram: true,
  },
  {
    id: 'aimlabs-godot',
    name: 'Juego de puntería',
    code: 'AIM',
    summary:
      'Juego 3D en Godot con varios modos de entrenamiento: objetivos fijos, móviles, con vida y un objetivo errático.',
    problem:
      'Entrenar la puntería sin salir de un rango de práctica. Cada modo cambia el reto, pero los controles y la lógica de disparo se mantienen iguales.',
    technologies: ['Godot', 'GDScript'],
    tipo: 'juegos',
    status: 'en-desarrollo',
    // TODO(diego): confirmar origen y año.
    origen: 'personal',
    anio: 2026,
    // TODO(diego): capturas reales del juego.
    imageUrl: '',
    tone: 'rose',
  },
  {
    id: 'transmilenio-ux',
    name: 'Análisis UX de TransMilenio',
    code: 'UX',
    summary:
      'Evaluación heurística del sitio web de TransMilenio y propuesta de corrección de la interfaz en Figma.',
    problem:
      'El sitio resuelve consultas de rutas, pero la información clave se pierde entre menús y pasos de más. Revisé los recorridos principales con las heurísticas de Nielsen y propuse una versión corregida.',
    technologies: ['Figma', 'UX/UI'],
    tipo: 'diseno',
    status: 'terminado',
    // TODO(diego): confirmar origen y año.
    origen: 'académico',
    anio: 2024,
    // TODO(diego): capturas del antes/después en Figma.
    imageUrl: '',
    tone: 'sky',
  },
  {
    id: 'gimnasio-android',
    name: 'App de gimnasio',
    code: 'GYM',
    summary:
      'Aplicación Android para gestionar rutinas, ejercicios y el progreso del entrenamiento.',
    problem:
      'Las rutinas en notas del teléfono se pierden y no muestran avance. La app reúne rutinas, ejercicios y progreso en un solo lugar.',
    technologies: ['Java', 'Android'],
    tipo: 'movil',
    status: 'en-desarrollo',
    // TODO(diego): confirmar origen y año.
    origen: 'personal',
    anio: 2026,
    // TODO(diego): capturas de la app.
    imageUrl: '',
    tone: 'amber',
  },
  {
    id: 'sistema-rag',
    name: 'Sistema RAG',
    code: 'RAG',
    summary:
      'Sistema de generación aumentada por recuperación. La definición del alcance sigue en progreso.',
    // TODO(diego): completar descripción y tecnologías.
    problem: '// TODO(diego): describir el problema que resuelve el sistema RAG.',
    technologies: [],
    // TODO(diego): confirmar tipo, origen y año.
    tipo: 'web',
    status: 'en-desarrollo',
    origen: 'personal',
    anio: 2026,
    // TODO(diego): imagen o diagrama del sistema.
    imageUrl: '',
    tone: 'lime',
  },
  {
    id: 'mundiales-futbol',
    name: 'Web de mundiales',
    code: 'WC',
    summary:
      'Consulta de información histórica de los mundiales de fútbol: ediciones, selecciones y resultados.',
    problem:
      'Los datos de los mundiales están repartidos entre tablas y artículos. La idea es consultarlos desde una sola interfaz, por edición o por selección.',
    technologies: ['Angular', 'NestJS'],
    tipo: 'web',
    status: 'en-desarrollo',
    // TODO(diego): confirmar origen y año.
    origen: 'personal',
    anio: 2025,
    // TODO(diego): capturas del sitio.
    imageUrl: '',
    tone: 'violet',
  },
];

export interface TechnologyFilter {
  name: string;
  count: number;
}

/** Tecnologías principales que se ofrecen como filtros. */
const MAIN_TECHNOLOGY_NAMES = new Set([
  'Angular',
  'NestJS',
  'PostgreSQL',
  'Prisma',
  'Electron',
  'Godot',
  'Android',
  'Figma',
]);

/** Tecnologías principales presentes en los proyectos, con cuántas veces aparecen. */
export const TECHNOLOGIES: TechnologyFilter[] = PROJECTS.reduce<TechnologyFilter[]>(
  (list, project) => {
    for (const technology of project.technologies) {
      const existing = list.find((item) => item.name === technology);
      if (existing) {
        existing.count += 1;
      } else {
        list.push({ name: technology, count: 1 });
      }
    }
    return list;
  },
  [],
)
  .filter((technology) => MAIN_TECHNOLOGY_NAMES.has(technology.name))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
