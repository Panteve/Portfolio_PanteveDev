import { PROFILE } from './profile';

export type AboutFileIcon = 'typescript' | 'json' | 'env' | 'log' | 'markdown';
export type AboutViewMode = 'view' | 'code';

export interface AboutViewSection {
  title: string;
  meta?: string;
  text: string;
}

export interface AboutView {
  title: string;
  intro: string;
  sections: AboutViewSection[];
}

export interface AboutFile {
  id: string;
  name: string;
  folderId: string;
  icon: AboutFileIcon;
  language: string;
  defaultMode: AboutViewMode;
  code: string;
  view: AboutView;
}

export interface AboutFolder {
  id: string;
  label: string;
  files: AboutFile[];
}

const BIO_CODE = `export const diego = {
  nombre: 'Diego',
  ubicacion: {
    ciudad: 'Bogotá',
    pais: 'Colombia',
  },
  rol: 'desarrollador full-stack',
  estado: 'abierto a oportunidades',
  construyendo: 'POS multisucursal',
  herramientas: ['Angular', 'NestJS', 'Prisma', 'PostgreSQL', 'Godot', 'Figma'],
  formacion: {
    programa: 'Ingeniería de Software',
    institucion: 'Uniempresarial',
    estado: 'en curso',
  },
  enfoque: [
    'entender el problema antes de elegir el framework',
    'construir, romper y volver a construir',
  ],
};
`;

const README_CODE = `# Hola, soy Diego

Desarrollador de software en Bogotá, Colombia.

## Quién soy
Estudiante de Ingeniería de Software y desarrollador de software.
Me gusta entender cómo funcionan las cosas y construir herramientas
que resuelvan problemas reales.

## Qué hago
Diseño y desarrollo aplicaciones web, de escritorio y videojuegos.
Trabajo desde la interfaz hasta la base de datos, cuidando que el
resultado sea claro y fácil de usar.

## Dónde estoy
Vivo en Bogotá, Colombia. Estoy abierto a oportunidades para seguir
aprendiendo y aportar en equipos de tecnología.
`;

const INTERESTS_CODE = `# Lo que hago cuando no estoy en clase.
VIDEOJUEGOS="desarrollo con Godot"
AUTOMATIZACION="flujos con n8n"
CIBERSEGURIDAD="aprendizaje continuo"
DISENO="interfaces y experiencia"
`;

const EDUCATION_CODE = `{
  "programa": "Ingeniería de Software",
  "institucion": "Uniempresarial",
  "ciudad": "Bogotá, Colombia",
  "estado": "en curso",
  "finalizado": false
}
`;

const EXPERIENCE_CODE = `$ git log --oneline --date=short
e4c1a9d (2026-06-30) Entelgy Colombia
b7d2f01 (2025-12-31) DJS New World
a3c6e54 (2024-11-29) RSec · aprendiz SENA
`;

export const README_FILE: AboutFile = {
  id: 'readme',
  name: 'README.md',
  folderId: '',
  icon: 'markdown',
  language: 'Markdown',
  defaultMode: 'view',
  code: README_CODE,
  view: {
    title: `Hola, soy ${PROFILE.firstName}`,
    intro: `Desarrollador de software en ${PROFILE.city}.`,
    sections: [
      {
        title: 'Quién soy',
        text: 'Soy estudiante de Ingeniería de Software y desarrollador de software. Me gusta entender cómo funcionan las cosas y construir herramientas que resuelvan problemas reales.',
      },
      {
        title: 'Qué hago',
        text: 'Diseño y desarrollo aplicaciones web, de escritorio y videojuegos. Trabajo desde la interfaz hasta la base de datos, cuidando que el resultado sea claro y fácil de usar.',
      },
      {
        title: 'Dónde estoy',
        text: `Vivo en ${PROFILE.city}. Estoy abierto a oportunidades para seguir aprendiendo y aportar en equipos de tecnología.`,
      },
    ],
  },
};

export const ABOUT_ROOT_FILES: AboutFile[] = [README_FILE];

export const ABOUT_FOLDERS: AboutFolder[] = [
  {
    id: 'bio',
    label: 'bio',
    files: [
      {
        id: 'bio',
        name: 'bio.ts',
        folderId: 'bio',
        icon: 'typescript',
        language: 'TypeScript',
        defaultMode: 'code',
        code: BIO_CODE,
        view: {
          title: `${PROFILE.firstName}`,
          intro: `Desarrollador de software en ${PROFILE.city}.`,
          sections: [
            {
              title: 'Perfil',
              text: 'Estudiante de Ingeniería de Software y desarrollador de software. Me interesa convertir problemas reales en herramientas simples de usar.',
            },
            {
              title: 'Forma de trabajo',
              text: 'Prefiero entender el problema antes de elegir la tecnología. Construyo, pruebo y mejoro hasta que la solución se siente clara.',
            },
            {
              title: 'Ahora',
              text: 'Estoy construyendo un sistema de punto de venta para varias sucursales y sigo abierto a oportunidades.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'intereses',
    label: 'intereses',
    files: [
      {
        id: 'intereses',
        name: 'intereses.env',
        folderId: 'intereses',
        icon: 'env',
        language: 'dotenv',
        defaultMode: 'view',
        code: INTERESTS_CODE,
        view: {
          title: 'Intereses',
          intro: 'Lo que hago cuando no estoy en clase.',
          sections: [
            {
              title: 'Videojuegos',
              meta: 'Desarrollo',
              text: 'Diseño y programo videojuegos. Me gusta pensar en cómo se siente jugar y en las pequeñas decisiones que hacen que una experiencia funcione.',
            },
            {
              title: 'Automatización',
              meta: 'Flujos de trabajo',
              text: 'Conecto herramientas para que las tareas repetitivas se hagan solas y pueda dedicar más tiempo a lo importante.',
            },
            {
              title: 'Ciberseguridad',
              meta: 'Aprendizaje continuo',
              text: 'Me interesa entender cómo funcionan los sistemas por dentro y cómo protegerlos sin complicar su uso.',
            },
            {
              title: 'Diseño',
              meta: 'Interfaces',
              text: 'Disfruto crear interfaces que se entiendan rápido, con información clara y sin ruido innecesario.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'educacion',
    label: 'educación',
    files: [
      {
        id: 'educacion',
        name: 'educacion.json',
        folderId: 'educacion',
        icon: 'json',
        language: 'JSON',
        defaultMode: 'view',
        code: EDUCATION_CODE,
        view: {
          title: 'Ingeniería de Software',
          intro: 'Uniempresarial · Bogotá, Colombia',
          sections: [
            {
              title: 'Estado',
              meta: 'En curso',
              text: 'Actualmente curso el pregrado de Ingeniería de Software. La formación combina fundamentos de programación, diseño de sistemas y trabajo en equipo.',
            },
            {
              title: 'Qué estoy aprendiendo',
              text: 'Diseño de software, bases de datos, desarrollo web y buenas prácticas para construir productos mantenibles.',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'experiencia',
    label: 'experiencia',
    files: [
      {
        id: 'experiencia',
        name: 'experiencia.log',
        folderId: 'experiencia',
        icon: 'log',
        language: 'Git log',
        defaultMode: 'view',
        code: EXPERIENCE_CODE,
        view: {
          title: 'Experiencia',
          intro: 'Etapas en las que he aprendido haciendo.',
          sections: [
            {
              title: 'Entelgy Colombia',
              meta: 'enero — junio 2026',
              text: 'Experiencia profesional en desarrollo de software dentro de un equipo de tecnología.',
            },
            {
              title: 'DJS New World',
              meta: 'temporada 2024-2025',
              text: 'Desarrollo de videojuegos y experiencias interactivas.',
            },
            {
              title: 'RSec',
              meta: 'mayo — noviembre 2024',
              text: 'Formación práctica en desarrollo de software como aprendiz.',
            },
          ],
        },
      },
    ],
  },
];

export const ABOUT_FILES: AboutFile[] = [
  ...ABOUT_ROOT_FILES,
  ...ABOUT_FOLDERS.flatMap((folder) => folder.files),
];
