# 📘 Documentación Completa — HackAccess Frontend

> **Tecnología:** Angular 20 · TypeScript 5.9 · SCSS · Standalone Components  
> **Conexión API:** Laravel backend en `http://localhost:8000/api`

---

## 📁 Estructura del Proyecto

```
hackaccess-front/
├── angular.json                  # Configuración de Angular CLI
├── package.json                  # Dependencias y scripts npm
├── tsconfig.json                 # Configuración base de TypeScript
├── tsconfig.app.json             # Configuración TS para la app
├── tsconfig.spec.json            # Configuración TS para tests
├── public/
│   └── favicon.ico               # Icono de la aplicación
└── src/
    ├── index.html                # Punto de entrada HTML
    ├── main.ts                   # Bootstrap de la aplicación Angular
    ├── styles.scss               # Estilos globales (vacío, estilos por componente)
    └── app/
        ├── app.ts                # Componente raíz (App)
        ├── app.html              # Template del componente raíz
        ├── app.scss              # Estilos del header global y menú usuario
        ├── app.config.ts         # Configuración de providers (router, HTTP, interceptors)
        ├── app.routes.ts         # Definición de rutas con lazy loading y guards
        ├── environments/
        │   └── environment.ts    # Variables de entorno (URL de la API)
        ├── models/
        │   └── participant.model.ts  # Interfaz TypeScript del modelo Participant
        ├── services/
        │   ├── auth.ts           # Servicio de autenticación (login, logout, register)
        │   ├── participant.ts    # Servicio CRUD de participantes
        │   └── toast.ts          # Servicio de notificaciones toast
        ├── guards/
        │   └── auth-guard.ts     # Guard de protección de rutas privadas
        ├── interceptors/
        │   └── auth-interceptor.ts   # Interceptor HTTP para inyectar token Bearer
        └── components/
            ├── toast.component.ts    # Componente visual de notificaciones toast
            ├── landing/              # Página de inicio pública
            ├── login/                # Página de inicio de sesión
            ├── register-admin/       # Página de registro de administrador
            ├── register-form/        # Formulario de registro de participantes
            └── dashboard/            # Panel principal con tabla de participantes
```

---

## 🔧 Ficheros de Configuración

### `package.json`
Define el proyecto **hackaccess-front** con las dependencias principales:
- **Angular 20.3** (`@angular/core`, `@angular/router`, `@angular/forms`, `@angular/common`)
- **RxJS 7.8** para programación reactiva
- **TypeScript 5.9** como lenguaje
- **Scripts:** `npm start` → `ng serve`, `npm run build` → `ng build`, `npm test` → `ng test`
- Configuración de **Prettier** integrada para formateo de código

**¿Por qué es importante?** Sin este fichero no se pueden instalar las dependencias ni ejecutar la app.

---

### `angular.json`
Configuración del workspace Angular:
- Define el proyecto como **application** con prefijo `app`
- Usa **SCSS** como preprocesador de estilos por defecto
- Entry point: `src/main.ts`
- Estilos globales: `src/styles.scss`
- Assets estáticos servidos desde `public/`
- Configuración de **budgets** de producción: máximo 500kB warning / 1MB error
- Modo development con **sourceMaps** activados y sin optimización

**¿Por qué es importante?** Angular CLI usa este fichero para saber cómo compilar, servir y testear la aplicación.

---

### `tsconfig.json`
Configuración estricta de TypeScript:
- `strict: true` — Verifica tipos de forma rigurosa
- `noImplicitReturns`, `noFallthroughCasesInSwitch` — Previene errores comunes
- `strictTemplates: true` — Comprobación estricta de tipos en templates HTML de Angular
- Target **ES2022** con módulos en modo `preserve`

**¿Por qué es importante?** Garantiza la calidad del código TypeScript y detecta errores en compilación.

---

## 🚀 Punto de Entrada

### `src/index.html`
```html
<app-root></app-root>
```
Es el shell HTML mínimo que carga la aplicación Angular. Contiene el meta viewport para responsive, el favicon y el tag `<app-root>` donde Angular inyecta toda la app.

---

### `src/main.ts`
```typescript
bootstrapApplication(App, appConfig)
```
Arranca la aplicación Angular en modo **standalone** (sin NgModules). Usa `bootstrapApplication` en vez del antiguo `platformBrowserDynamic().bootstrapModule()`. Pasa el componente `App` y la configuración `appConfig`.

**¿Por qué es importante?** Es el primer fichero que se ejecuta; sin él la app no arranca.

---

## ⚙️ Configuración de la Aplicación

### `src/app/app.config.ts`
Registra los **providers globales** de la aplicación:

| Provider | Función |
|----------|---------|
| `provideZoneChangeDetection({ eventCoalescing: true })` | Optimiza la detección de cambios agrupando eventos |
| `provideRouter(routes)` | Registra el sistema de rutas con lazy loading |
| `provideHttpClient(withInterceptors([authInterceptor]))` | Configura HttpClient con el interceptor de autenticación |

**¿Por qué es importante?** Centraliza toda la configuración de providers. Sin él no habría routing, ni HTTP, ni interceptors.

---

### `src/app/environments/environment.ts`
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000/api'
};
```
Define la URL base de la API Laravel. Todos los servicios importan `environment.apiUrl` para construir las URLs de los endpoints.

**¿Por qué es importante?** Permite cambiar la URL de la API en un solo punto al pasar a producción.

---

## 🗺️ Sistema de Rutas

### `src/app/app.routes.ts`

| Ruta | Componente | Protección | Descripción |
|------|-----------|------------|-------------|
| `/` | `LandingComponent` | Pública | Página de inicio/landing |
| `/register-admin` | `RegisterAdminComponent` | Pública | Registro de cuenta de administrador |
| `/login` | `LoginComponent` | Pública | Inicio de sesión |
| `/dashboard` | `DashboardComponent` | `authGuard` | Panel con tabla de participantes |
| `/register` | `RegisterFormComponent` | `authGuard` | Formulario para añadir participante |
| `**` | Redirect → `/` | — | Cualquier ruta no encontrada redirige al inicio |

Todas las rutas usan **lazy loading** con `loadComponent()` para cargar los componentes solo cuando se necesitan.

**¿Por qué es importante?** Define la navegación completa de la aplicación y qué rutas requieren autenticación.

---

## 🏗️ Componente Raíz

### `src/app/app.ts` + `app.html` + `app.scss`

El componente **App** es el contenedor principal de toda la aplicación:

**Lógica (`app.ts`):**
- Usa `toSignal()` para convertir los eventos de navegación del Router en una señal reactiva (`currentUrl`)
- Métodos `isLanding()`, `isLogin()`, `isRegisterAdmin()` determinan en qué página estamos
- Controla el estado del menú desplegable de usuario (`userMenuOpen`)
- `@HostListener('document:click')` cierra el menú al hacer clic fuera
- El menú se cierra automáticamente al cambiar de ruta (`NavigationEnd`)

**Template (`app.html`):**
- Muestra un **header sticky** con el logo "HackAccess" y un menú de usuario SOLO en las páginas internas (dashboard, register)
- En landing, login y register-admin NO se muestra el header
- El menú desplegable muestra el nombre, email y botón de "Tancar sessió" (cerrar sesión)
- El `<router-outlet>` renderiza el componente de la ruta activa

**Estilos (`app.scss`):**
- Header sticky con fondo `#f9f8f5` y borde inferior
- Avatar circular con la inicial del usuario en color teal (`#01696f`)
- Dropdown con animación `dropdown-in` (fade + slide)
- Botón de logout con hover en magenta (`#a12c7b`)

**¿Por qué es importante?** Es el esqueleto de toda la aplicación. Gestiona el layout global, la navegación y la sesión del usuario visible en todas las páginas privadas.

---

## 📦 Modelo de Datos

### `src/app/models/participant.model.ts`

```typescript
export interface Participant {
    id: number;
    nom: string;
    cognom: string;
    nom_complet: string;
    email: string;
    tipus_entrada: 'Presencial' | 'Online' | 'Mentor';
    necessitats_especials: boolean;
    registrat_el: string;
}
```

Define la estructura TypeScript de un participante del hackathon:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador único (generado por la API) |
| `nom` | `string` | Nombre del participante |
| `cognom` | `string` | Apellido del participante |
| `nom_complet` | `string` | Nombre completo (calculado por la API) |
| `email` | `string` | Correo electrónico |
| `tipus_entrada` | `'Presencial' \| 'Online' \| 'Mentor'` | Tipo de participación |
| `necessitats_especials` | `boolean` | Si requiere adaptaciones de accesibilidad |
| `registrat_el` | `string` | Fecha de registro (generada por la API) |

**¿Por qué es importante?** Garantiza que todos los componentes y servicios usan la misma estructura de datos con tipado fuerte.

---

## 🔐 Servicios

### `src/app/services/auth.ts` — AuthService

Servicio singleton (`providedIn: 'root'`) que gestiona toda la autenticación:

**Estado reactivo (Signals):**
- `_token` → Signal con el token JWT (o `null`)
- `_user` → Signal con `{ name, email }` del usuario (o `null`)
- `isAuthenticated()` → devuelve `true` si hay token
- `user()` / `token()` → señales de solo lectura expuestas al exterior

**Métodos:**

| Método | Endpoint API | Acción |
|--------|-------------|--------|
| `login(email, password)` | `POST /api/login` | Inicia sesión, guarda token y usuario en signals |
| `logout()` | `POST /api/logout` | Cierra sesión, limpia signals y localStorage, redirige a `/` |
| `registerAdmin(name, email, password)` | `POST /api/register` | Crea cuenta admin, guarda token en signals Y en localStorage |

**¿Por qué es importante?** Es el núcleo de seguridad del frontend. Sin este servicio no se podría iniciar sesión ni acceder a las rutas protegidas. El guard y el interceptor dependen de él.

---

### `src/app/services/participant.ts` — ParticipantService

Servicio singleton que gestiona el CRUD de participantes:

**Estado reactivo (Signals):**
- `_participants` → Array de participantes cargados
- `_loading` → Estado de carga (true/false)
- `_error` → Mensaje de error (o null)

**Propiedades computadas:**
- `total()` → Total de participantes
- `totalNecessitats()` → Participantes con necesidades especiales
- `totalPresencial()` → Participantes presenciales
- `totalOnline()` → Participantes online
- `totalMentor()` → Participantes mentores

**Métodos:**

| Método | Endpoint API | Acción |
|--------|-------------|--------|
| `load()` | `GET /api/participants` | Carga todos los participantes |
| `register(data)` / `create(data)` | `POST /api/participants` | Crea un nuevo participante |
| `update(id, data)` | `PUT /api/participants/:id` | Actualiza un participante existente |
| `delete(id)` | `DELETE /api/participants/:id` | Elimina un participante |

**¿Por qué es importante?** Centraliza toda la comunicación con la API de participantes. Los componentes Dashboard y RegisterForm dependen de este servicio.

---

### `src/app/services/toast.ts` — ToastService

Servicio de notificaciones temporales:

- `show(msg, kind)` → Muestra un mensaje de tipo `'success'` o `'error'`
- El mensaje desaparece automáticamente a los **4 segundos** (`setTimeout`)
- Usa Signals para que el componente Toast reaccione automáticamente

**¿Por qué es importante?** Proporciona feedback visual al usuario tras acciones como crear, editar o eliminar participantes.

---

## 🛡️ Guard

### `src/app/guards/auth-guard.ts`

```typescript
export const authGuard: CanActivateFn = () => {
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
```

Es un **functional guard** (Angular moderno) que protege las rutas `/dashboard` y `/register`:
- Si el usuario tiene token → permite el acceso (`return true`)
- Si NO tiene token → redirige a `/login` y bloquea el acceso (`return false`)

**¿Por qué es importante?** Sin este guard, cualquier usuario no autenticado podría acceder al dashboard y ver datos de participantes.

---

## 🔗 Interceptor

### `src/app/interceptors/auth-interceptor.ts`

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  if (token) {
    return next(req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    }));
  }
  return next(req);
};
```

Es un **functional interceptor** que se ejecuta en CADA petición HTTP:
- Si hay token → clona la petición y añade el header `Authorization: Bearer <token>`
- Si no hay token → deja pasar la petición sin modificar

Se registra en `app.config.ts` con `withInterceptors([authInterceptor])`.

**¿Por qué es importante?** Sin este interceptor, las peticiones a endpoints protegidos de la API (como GET /participants) fallarían con error 401 Unauthorized.

---

## 🖼️ Componentes de Página

### 🏠 Landing — `src/app/components/landing/`

| Fichero | Función |
|---------|---------|
| `landing.ts` | Componente standalone que importa `RouterLink` para los botones de navegación |
| `landing.html` | Página de bienvenida con 4 secciones: Hero, Qué és, Features y CTA final |
| `landing.scss` | Estilos completos: hero full-height con gradiente, cards de features, sección CTA en teal, botones primary/ghost/large, clase sr-only para accesibilidad |

**Secciones del template:**
1. **Hero** — Título "HackAccess", subtítulo sobre inclusión, botones "Registra't ara" y "Ja tinc compte"
2. **Què és** — Descripción del hackathon de 24 horas
3. **Features** — Grid con cards: "100% Inclusiu" y "Obert a estudiants"
4. **CTA** — Fondo teal con botón "Registra'm al hackathon"

**¿Por qué es importante?** Es la primera impresión del usuario. Explica qué es HackAccess y dirige a registro o login.

---

### 🔑 Login — `src/app/components/login/`

| Fichero | Función |
|---------|---------|
| `login.ts` | Formulario reactivo con validaciones (email requerido/formato, password requerido). Llama a `AuthService.login()` y redirige a `/dashboard` |
| `login.html` | Card centrada con logo, campos email/password, botón "Entrar", enlace "Tornar a l'inici". Muestra errores de validación y de servidor |
| `login.scss` | Layout centrado con gradiente, card con sombra, estilos de formulario, estados de error con color magenta, skip-link de accesibilidad |

**Flujo:**
1. El usuario rellena email y password
2. Se valida el formulario (required, formato email)
3. Se envía `POST /api/login`
4. Si OK → guarda token y redirige a `/dashboard`
5. Si error → muestra mensaje de error de la API

**¿Por qué es importante?** Es la puerta de entrada a la zona privada. Sin login no se puede acceder al dashboard.

---

### 📝 Register Admin — `src/app/components/register-admin/`

| Fichero | Función |
|---------|---------|
| `register-admin.ts` | Formulario reactivo con campos nombre (min 2, max 100), email y password (min 8). Llama a `AuthService.registerAdmin()` |
| `register-admin.html` | Card con logo, campos nombre/email/password, botón "Crear compte", enlace a login. Misma estructura visual que login |
| `register-admin.scss` | Importa directamente los estilos de login con `@use '../login/login.scss'` para mantener consistencia visual |

**Flujo:**
1. El usuario rellena nombre, email y password
2. Se valida (nombre ≥2 chars, email válido, password ≥8 chars)
3. Se envía `POST /api/register`
4. Si OK → guarda token + user en signals Y en localStorage, redirige a `/dashboard`
5. Si error → muestra mensaje de error

**¿Por qué es importante?** Permite crear nuevas cuentas de administrador que podrán gestionar participantes del hackathon.

---

### 📊 Dashboard — `src/app/components/dashboard/`

| Fichero | Función |
|---------|---------|
| `dashboard.ts` | Carga participantes al iniciar (`ngOnInit`), gestiona edición con modal (signal `editingParticipant`), eliminación con confirmación, y formulario reactivo de edición |
| `dashboard.html` | Header con botón "Nou participant", KPIs (total, necesidades especiales, presenciales), tabla con badges por tipo, modal de edición, estados vacío/cargando/error |
| `dashboard.scss` | Layout responsive con grid de KPIs, tabla con badges de colores, modal con backdrop y animaciones slide-up/fade-in, botones de acción (editar/eliminar), estilos de formulario en modal |

**Funcionalidades:**
- **KPIs:** 3 tarjetas con estadísticas en tiempo real (total, necesidades especiales, presenciales)
- **Tabla:** Lista todos los participantes con nombre, email, tipo (badge con color), necesidades, fecha de registro
- **Acciones admin:** Botones "Editar" y "Eliminar" visibles solo para `admin@hackaccess.dev`
- **Modal de edición:** Formulario completo con todos los campos, validaciones, botones Guardar/Cancelar
- **Eliminación:** Confirmación con `confirm()` antes de borrar
- **Toast:** Notificaciones de éxito/error tras cada acción
- **Estados:** Loading, error de conexión, lista vacía con CTA

**Badges de color:**

| Tipo | Color fondo | Color texto |
|------|-------------|-------------|
| Presencial | `#d4dfcc` verde | `#1b5e20` |
| Online | `#c6d8e4` azul | `#0d47a1` |
| Mentor | `#dacfde` púrpura | `#7a39bb` |
| Necessitats | `#cedcd8` teal | `#01696f` |

**¿Por qué es importante?** Es la página principal de la aplicación. Permite visualizar y gestionar todos los participantes del hackathon con operaciones CRUD completas.

---

### ➕ Register Form — `src/app/components/register-form/`

| Fichero | Función |
|---------|---------|
| `register-form.ts` | Formulario reactivo no-nullable con validaciones avanzadas. Métodos `getError()` e `isInvalid()` para mensajes de error dinámicos. Usa `ParticipantService.register()` |
| `register-form.html` | Formulario con fieldset semántico, campos nom/cognom/email/tipus_entrada/necessitats_especials, botones Registrar/Cancelar, enlace "Tornar" al dashboard |
| `register-form.scss` | Layout centrado (max 600px), card con borde, campos con focus visible teal, checkbox estilizado, mensajes de error en magenta, botones primary/secondary |

**Campos del formulario:**

| Campo | Validaciones | Tipo HTML |
|-------|-------------|-----------|
| Nom | required, min 2, max 100 | `text` |
| Cognom | required, min 2, max 100 | `text` |
| Email | required, formato email | `email` |
| Tipus d'entrada | required (Presencial/Online/Mentor) | `select` |
| Necessitats especials | — (opcional) | `checkbox` |

**Flujo:**
1. El usuario rellena los campos
2. Si hay errores → se muestran inline bajo cada campo + toast de error
3. Se envía `POST /api/participants`
4. Si OK → toast de éxito + redirige a `/dashboard`
5. Si error → toast con mensaje de la API

**¿Por qué es importante?** Es el formulario que permite añadir nuevos participantes al hackathon con toda la validación necesaria.

---

### 🔔 Toast — `src/app/components/toast.component.ts`

Componente inline (template y estilos en el mismo fichero) que muestra notificaciones:
- Posición **fixed** en la esquina superior derecha
- Dos variantes: `success` (verde) y `error` (magenta)
- Se muestra solo cuando `ToastService.message()` tiene valor
- Usa `role="alert"` y `aria-live="assertive"` para accesibilidad con lectores de pantalla
- Respeta `prefers-reduced-motion` desactivando animaciones

**¿Por qué es importante?** Proporciona feedback visual accesible al usuario en todas las acciones CRUD.

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Teal principal | `#01696f` | Logo, botones primary, focus, avatar |
| Teal oscuro | `#0c4e54` | Hover de botones primary |
| Teal claro | `#cedcd8` | Tags, badges, fondos accent |
| Texto principal | `#28251d` | Títulos, labels, texto de tabla |
| Texto secundario | `#5c5955` | Subtítulos, labels secundarios |
| Fondo claro | `#f7f6f2` | Backgrounds de secciones, header tabla |
| Fondo page | `#f9f8f5` | Header de la app |
| Borde | `#d4d1ca` | Bordes de cards, inputs, tabla |
| Magenta | `#a12c7b` | Errores, botón eliminar, campos requeridos |
| Magenta fondo | `#e0ced7` | Fondo de alertas de error |
| Verde badge | `#d4dfcc` / `#1b5e20` | Badge "Presencial" |
| Azul badge | `#c6d8e4` / `#0d47a1` | Badge "Online" |
| Púrpura badge | `#dacfde` / `#7a39bb` | Badge "Mentor" |

---

## 🔄 Flujo Completo de la Aplicación

```
Landing (/)
    ├── "Registra't ara" → Register Admin (/register-admin)
    │                           └── POST /api/register → Dashboard
    └── "Ja tinc compte" → Login (/login)
                               └── POST /api/login → Dashboard (/dashboard)
                                                        ├── Ver tabla de participantes (GET /api/participants)
                                                        ├── "Nou participant" → Register Form (/register)
                                                        │                         └── POST /api/participants → Dashboard
                                                        ├── "Editar" → Modal → PUT /api/participants/:id
                                                        ├── "Eliminar" → Confirm → DELETE /api/participants/:id
                                                        └── "Tancar sessió" → POST /api/logout → Landing
```

---

## ♿ Accesibilidad Implementada

- **Skip links** en landing, login y dashboard
- **aria-label**, **aria-live**, **aria-invalid**, **aria-describedby** en formularios
- **role="alert"** en mensajes de error y toast
- **role="dialog"** y **aria-modal** en el modal de edición
- **Clase sr-only** para textos solo visibles por lectores de pantalla
- **focus-visible** con outline teal en todos los elementos interactivos
- **prefers-reduced-motion** respetado en el toast
- **Autocomplete** semántico en todos los inputs (email, given-name, family-name, etc.)
- **Estructura semántica** con `<main>`, `<header>`, `<section>`, `<article>`, `<fieldset>`, `<legend>`
