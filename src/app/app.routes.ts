import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'sobre-mi',
    loadComponent: () =>
      import('./features/sobre-mi/sobre-mi.component').then((m) => m.SobreMiComponent),
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./features/proyectos/proyectos.component').then((m) => m.ProyectosComponent),
  },
  {
    path: 'proyectos/:id',
    loadComponent: () =>
      import('./features/proyectos/proyecto-detalle.component').then(
        (m) => m.ProyectoDetalleComponent,
      ),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  { path: '**', redirectTo: '' },
];
