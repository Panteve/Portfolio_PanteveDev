export interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'mail';
  external: boolean;
}

// Datos personales. Los TODO(diego) se reemplazan cuando tenga los definitivos.
export const PROFILE = {
  firstName: 'Diego',
  // TODO(diego): apellido real.
  lastName: '',
  // TODO(diego): usar el apellido en el identificador de la barra superior.
  handle: 'diego-apellido',
  // TODO(diego): confirmar el título profesional.
  role: 'Desarrollador full-stack',
  city: 'Bogotá, Colombia',
  // TODO(diego): correo de contacto definitivo.
  email: 'diego@correo.com',
  // TODO(diego): URLs reales de GitHub y LinkedIn.
  githubUrl: 'https://github.com/TODO',
  linkedinUrl: 'https://linkedin.com/in/TODO',
} as const satisfies {
  firstName: string;
  lastName: string;
  handle: string;
  role: string;
  city: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', url: PROFILE.githubUrl, icon: 'github', external: true },
  { label: 'LinkedIn', url: PROFILE.linkedinUrl, icon: 'linkedin', external: true },
  { label: 'Correo', url: `mailto:${PROFILE.email}`, icon: 'mail', external: false },
];

/** Stack que aparece en el inicio, sin porcentajes ni barras. */
export const STACK: string[] = [
  'Angular',
  'NestJS',
  'Prisma',
  'PostgreSQL',
  'Godot',
  'Figma',
];

export interface TimelineItem {
  title: string;
  subtitle?: string;
  period?: string;
}

export const EDUCATION: TimelineItem[] = [
  {
    title: 'Ingeniería de Software',
    subtitle: 'Uniempresarial · Bogotá, Colombia',
    period: 'en curso',
  },
];

export const EXPERIENCE: TimelineItem[] = [
  {
    title: 'RSec',
    subtitle: 'aprendiz SENA',
    period: 'mayo – nov 2024',
  },
  {
    title: 'DJS New World',
    // TODO(diego): cargo real.
    period: 'temporada 2024-2025',
  },
  {
    title: 'Entelgy Colombia',
    // TODO(diego): cargo real.
    period: 'enero – junio 2026',
  },
];

export const INTERESTS: string[] = [
  'desarrollo de videojuegos (Godot)',
  'automatización de flujos (n8n)',
  'ciberseguridad',
  'diseño de interfaces',
];

// Borrador con tono directo. TODO(diego): texto final de la bio.
export const BIO_LINES: string[] = [
  'Estudiante de Ingeniería de Software en Bogotá.',
  'Construyo cosas que uso: un POS, un juego de puntería y una app de gimnasio.',
  'Prefiero entender el problema antes de elegir el framework.',
  'Aprendo rompiendo el proyecto y arreglándolo después. Hasta ahora funciona.',
];
