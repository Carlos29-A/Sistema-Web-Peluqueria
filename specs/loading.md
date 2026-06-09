# Páginas de Carga — loading.tsx

> **Feature:** Indicadores de carga para rutas públicas y admin
> **Historia de usuario:** Como usuario, quiero ver un indicador de carga visual mientras la página obtiene sus datos, para que la experiencia sea fluida y no parezca que la web se colgó.
> **Prioridad:** Media

---

## Contexto

Actualmente el proyecto no tiene ningún archivo `loading.tsx` en ningún segmento de rutas. Cuando un usuario navega entre páginas, Next.js muestra una pantalla en blanco hasta que los Server Components terminan de resolver sus datos (consultas a Prisma, etc.). Esto da la impresión de que la web está congelada o no funciona.

En particular, las páginas que cargan datos desde Prisma (landing, catálogo de servicios, equipo, admin dashboard, etc.) pueden tardar varios cientos de milisegundos en renderizar, tiempo durante el cual el usuario no ve ningún feedback visual.

---

## Criterios de aceptación

### CA-1: Existe `app/(public)/loading.tsx`

- **Given** que soy un usuario navegando en la parte pública
- **When** navego a una página que está cargando datos
- **Then** veo un skeleton de carga que representa la estructura de la página

### CA-2: Existe `app/admin/loading.tsx`

- **Given** que soy un administrador navegando en el panel admin
- **When** navego a una página admin que está cargando datos
- **Then** veo un skeleton de carga que representa la estructura del panel admin

### CA-3: Diseño del skeleton público

- **Given** que veo el loader público
- **Then** veo:
  - Header simulado con barra horizontal gris
  - Título placeholder (barra corta)
  - Grid de 3-6 cards rectangulares con bordes redondeados
  - Colores grises suaves con animación `animate-pulse`

### CA-4: Diseño del skeleton admin

- **Given** que veo el loader admin
- **Then** veo:
  - Grid de 4 cards rectangulares (stat cards)
  - Tabla simulada de 4-5 filas
  - Colores grises suaves con animación `animate-pulse`

### CA-5: Sin dependencias externas

- **Given** que se muestra el loader
- **Then** el componente no depende de API, BD ni configuración externa

### CA-6: Coherente con el diseño del sitio

- **Given** que veo el loader público
- **Then** bordes redondeados, espaciados y proporciones coinciden con los componentes reales

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | `loading.tsx` NO debe depender de datos externos (API, BD, config) |
| RB02 | Los skeletons usan `animate-pulse` de Tailwind |
| RB03 | Los colores son `bg-gray-200` y `bg-gray-100` |
| RB04 | El loader admin respeta el layout del admin (sidebar visible, contenido a la derecha) |

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `app/(public)/loading.tsx` | Skeleton de carga para rutas públicas |
| `app/admin/loading.tsx` | Skeleton de carga para rutas admin |

---

## Notas adicionales

- `loading.tsx` se muestra automáticamente mientras se resuelven los Server Components.
- No necesita `"use client"`.
- El skeleton admin se renderiza dentro del `AdminLayout` (solo el área de contenido).
- El skeleton público se renderiza dentro del `PublicLayout` (solo el área de contenido).
- `animate-pulse` crea un destello suave más profesional que un spinner.
- Los skeletons usan `rounded-xl` y `bg-gray-200 animate-pulse`.
