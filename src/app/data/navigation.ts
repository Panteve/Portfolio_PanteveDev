export interface NavTab {
  label: string;
  path: string;
  /** Solo la pestaña de inicio exige coincidencia exacta de ruta. */
  exact?: boolean;
}

export const NAV_TABS: NavTab[] = [
  { label: '_inicio', path: '/', exact: true },
  { label: '_sobre-mi', path: '/sobre-mi' },
  { label: '_proyectos', path: '/proyectos' },
  { label: '_contacto', path: '/contacto' },
];
