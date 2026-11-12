export interface AboutFile {
  id: string;
  name: string;
  folderId: string;
  code: string;
}

export interface AboutFolder {
  id: string;
  label: string;
  files: AboutFile[];
}

const BIO_CODE = `/**
 * bio.ts
 * Quién soy, en pocas líneas.
 */

export const diego = {
  nombre: 'Diego',
  ciudad: 'Bogotá, Colombia',
  rol: 'desarrollador full-stack',
  carrera: 'Ingeniería de Software',
  universidad: 'Uniempresarial',
};

// Directo, sin "apasionado por la tecnología".
// Construyo, rompo, leo el error y vuelvo a construir.
// TODO(diego): este es un borrador; el texto final lo escribo yo.
`;

const INTERESTS_CODE = `/**
 * intereses.ts
 * Lo que hago cuando no estoy en clase.
 */

export const intereses = [
  'desarrollo de videojuegos con Godot',
  'automatización de flujos con n8n',
  'ciberseguridad',
  'diseño de interfaces',
];

// TODO(diego): ajustar la lista.
`;

const EDUCATION_CODE = `/**
 * educacion.ts
 */

export const educacion = {
  programa: 'Ingeniería de Software',
  institucion: 'Uniempresarial',
  ciudad: 'Bogotá, Colombia',
  estado: 'en curso',
};
`;

const EXPERIENCE_CODE = `/**
 * experiencia.ts
 */

export interface Experiencia {
  empresa: string;
  rol?: string;
  periodo: string;
}

export const experiencia: Experiencia[] = [
  { empresa: 'RSec', rol: 'aprendiz SENA', periodo: 'mayo – nov 2024' },
  { empresa: 'DJS New World', periodo: 'temporada 2024-2025' },
  { empresa: 'Entelgy Colombia', periodo: 'enero – junio 2026' },
];

// TODO(diego): cargos de DJS New World y Entelgy.
`;

const CONTACT_CODE = `/**
 * contacto.ts
 */

export const contacto = {
  correo: 'diego@correo.com', // TODO(diego)
  github: 'https://github.com/TODO', // TODO(diego)
  linkedin: 'https://linkedin.com/in/TODO', // TODO(diego)
  ciudad: 'Bogotá, Colombia',
};
`;

export const ABOUT_FOLDERS: AboutFolder[] = [
  {
    id: 'bio',
    label: 'bio',
    files: [{ id: 'bio', name: 'bio.ts', folderId: 'bio', code: BIO_CODE }],
  },
  {
    id: 'intereses',
    label: 'intereses',
    files: [
      {
        id: 'intereses',
        name: 'intereses.ts',
        folderId: 'intereses',
        code: INTERESTS_CODE,
      },
    ],
  },
  {
    id: 'educacion',
    label: 'educación',
    files: [
      {
        id: 'educacion',
        name: 'educacion.ts',
        folderId: 'educacion',
        code: EDUCATION_CODE,
      },
    ],
  },
  {
    id: 'experiencia',
    label: 'experiencia',
    files: [
      {
        id: 'experiencia',
        name: 'experiencia.ts',
        folderId: 'experiencia',
        code: EXPERIENCE_CODE,
      },
    ],
  },
  {
    id: 'contacto',
    label: 'contacto',
    files: [
      {
        id: 'contacto',
        name: 'contacto.ts',
        folderId: 'contacto',
        code: CONTACT_CODE,
      },
    ],
  },
];

export const ABOUT_FILES: AboutFile[] = ABOUT_FOLDERS.flatMap((folder) => folder.files);
