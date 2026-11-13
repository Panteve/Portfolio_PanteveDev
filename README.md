# Portfolio — Diego

Portfolio personal construido como una SPA con estética de ventana de IDE (VS Code en modo oscuro).
Todo el contenido vive en archivos de datos tipados; las vistas solo se encargan de presentarlo.

- **Framework:** Angular 22 (standalone components, signals, `@if` / `@for`).
- **Estilos:** Tailwind CSS 3.4, sin librerías de UI ni de animación.
- **Idioma:** español. **Tema:** claro y oscuro. **Tipografía:** Geist (UI) y JetBrains Mono (código).
- **Estado:** responsive en 360, 768 y 1280 px; sin errores de consola.

## Requisitos

- Node.js 24.15 o superior
- npm 11 o superior

## Comandos

```bash
npm install        # instalar dependencias
npm start          # servidor de desarrollo en http://localhost:4200
npm run build      # build de producción en dist/portfolio
```

## Rutas

| Ruta                    | Vista                                                        |
| ----------------------- | ------------------------------------------------------------ |
| `/`                     | Hero + mini-juego de puntería (`empezar-juego` / `saltar`).  |
| `/sobre-mi`             | Explorador de archivos, editor con líneas numeradas y snippets. |
| `/proyectos`            | Filtros técnicos y grid de proyectos.                        |
| `/proyectos/:id`        | Detalle del proyecto (POS multisucursal incluido).           |
| `/contacto`             | Formulario reactivo con envío real (Vercel + Resend).        |

Las rutas se cargan de forma diferida (`loadComponent`) y cada una actualiza el título y la
meta descripción mediante `SeoService`. La ruta comodín redirige a `/`.

## Estructura

```text
src/
├─ app/
│  ├─ core/                  # barra superior, barra de estado, nav móvil, SEO
│  ├─ data/                  # TODO el contenido editable
│  │  ├─ profile.ts          # datos personales, stack, educación, experiencia, bio
│  │  ├─ projects.ts         # proyectos, estados, tecnologías y enlaces
│  │  ├─ about.ts            # archivos del editor de "sobre mí"
│  │  ├─ snippets.ts         # tarjetas de snippets
│  │  └─ navigation.ts       # tabs y nav inferior
│  ├─ features/
│  │  ├─ inicio/             # hero + aim-game
│  │  ├─ sobre-mi/           # explorador + editor + snippets
│  │  ├─ proyectos/          # filtros, grid y detalle
│  │  └─ contacto/           # formulario reactivo
│  ├─ shared/                # icon, code-block, resaltador, project-card, etc.
│  ├─ app.component.*        # shell de la ventana IDE
│  ├─ app.routes.ts          # rutas lazy
│  └─ app.config.ts          # router (input binding, scroll restoration)
├─ styles.css                # tokens, fondo, estilos base y utilidades del IDE
└─ index.html                # metadatos y fuente
```

### Editar contenido

No hace falta tocar templates para actualizar el portfolio:

- **Datos personales, bio, stack, educación y experiencia:** `src/app/data/profile.ts`.
- **Proyectos (nombre, estado, stack, enlaces, descripción):** `src/app/data/projects.ts`.
- **Archivos y snippets de "sobre mí":** `src/app/data/about.ts` y `snippets.ts`.
- **Navegación:** `src/app/data/navigation.ts`.

Los proyectos usan estados honestos (`terminado`, `en desarrollo`, `en pausa`) y no se muestran
métricas, testimonios ni barras de habilidades inventadas.

## Responsive y accesibilidad

- Por debajo de 1024 px los tabs se ocultan y aparece una barra inferior fija.
- En móvil el explorador se convierte en acordeón, los snippets pasan debajo del editor,
  los filtros se vuelven un desplegable y el juego se coloca debajo del hero.
- `role="tree"` / `role="treeitem"` en el explorador, `role="tablist"` en la navegación,
  botones de icono con `aria-label`, foco visible, enlace "saltar al contenido" y HTML semántico.

## Despliegue

El build genera una SPA con rutas limpias, así que el hosting debe redirigir todas las rutas a
`index.html`. El directorio a publicar es `dist/portfolio/browser`.

- **Netlify / Cloudflare Pages:** `public/_redirects` ya incluye `/* /index.html 200` y se copia
  automáticamente al build. Configura el publish directory en `dist/portfolio/browser`.
- **Vercel:** `vercel.json` ya define el rewrite; el framework se detecta solo.
- **GitHub Pages:** funciona solo en la raíz del dominio. En un subdirectorio hay que compilar con
  `ng build --base-href /nombre-del-repo/` y resolver el fallback de rutas (por ejemplo, copiando
  `index.html` a `404.html`). Para este proyecto es más simple Netlify, Cloudflare Pages o Vercel.

## Contacto (Vercel + Resend)

El formulario de `_contacto` envía un `POST` a `/api/contact` (función serverless en `api/contact.ts`). Esa función valida el mensaje y lo envía por correo con Resend.

### Variables de entorno

Configura estas variables en el proyecto de Vercel (Settings → Environment Variables):

- `RESEND_API_KEY`: clave de API de Resend.
- `CONTACT_TO_EMAIL`: correo donde quieres recibir los mensajes.

Para desarrollo local, crea un `.env` a partir de `.env.example`. No subas `.env` al repositorio.

### Probar en local

`ng serve` no ejecuta la carpeta `/api`; el formulario solo puede enviar mensajes cuando hay un servidor que exponga la función. Para probarlo en local se usa `vercel dev` (requiere la CLI de Vercel; instálala por tu cuenta si no la tienes). La CLI lee las variables del `.env` y sirve la SPA y `/api/contact` en la misma URL.

### Deploy

Despliega el proyecto en Vercel. `vercel.json` mantiene el build de Angular y excluye `/api` del rewrite de la SPA. Configura las variables de entorno en Vercel antes de probar el formulario.

Nota: el remitente de la función es `onboarding@resend.dev`, el dominio de pruebas de Resend. Para producción, verifica un dominio en Resend y actualiza el `from` en `api/contact.ts`.

## Pendientes (TODO)

- [ ] Apellido real y `handle` de la barra superior (`profile.ts`).
- [ ] Cargo real en DJS New World y Entelgy Colombia.
- [ ] Correo definitivo, GitHub y LinkedIn.
- [ ] Texto final de la bio y del hero.
- [ ] Capturas reales de cada proyecto (hoy son miniaturas generadas).
- [ ] Diagrama de arquitectura del POS multisucursal.
- [ ] Snippets reales de código.
- [ ] Descripción definitiva del proyecto RAG.
- [ ] Añadir Open Graph image y URL canónica cuando exista dominio.
