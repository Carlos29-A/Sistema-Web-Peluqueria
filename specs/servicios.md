# Especificación: Página de Catálogo de Servicios `/servicios`

## Resumen

Crear una página pública dedicada en `/servicios` que muestre el catálogo completo de servicios con precios, agrupados por categoría, con filtros y CTAs de reserva.

## Historia de usuario

Como cliente, quiero poder ver el catálogo de servicios y sus precios de forma clara para saber qué ofrecen.

## Suposiciones validadas

1. El catálogo debe ser una **página dedicada** en `/servicios`, no solo la sección de la landing.
2. Los servicios deben mostrarse **agrupados por categoría** (Corte, Color, Tratamiento, etc.).
3. Cada servicio debe mostrar: **nombre, precio, duración, descripción y una imagen**.
4. Debe haber un **botón "Reservar"** por cada servicio que lleve a `/reservar`.
5. Debe incluir un **filtro por categoría** para que el cliente navegue entre tipos de servicio.
6. Deben mostrarse **solo los servicios activos** (isActive: true).
7. El diseño debe ser visualmente atractivo, con **cards/grilla** en lugar de tabla.
8. Debe ser **responsivo** y accesible desde la landing (navbar).

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `app/(public)/servicios/page.tsx` | **Crear** — Server Component que obtiene servicios activos, los serializa y pasa al client component |
| `components/public/sections/ServicesCatalog.tsx` | **Crear** — Client Component con filtro por categoría, animaciones framer-motion y grid de ServiceCatalogCard |
| `components/public/cards/ServiceCatalogCard.tsx` | **Crear** — Card detallada para el catálogo (imagen, nombre, descripción completa, precio, duración, categoría, botón "Reservar") |
| `components/public/layout/PublicHeader.tsx` | **Modificar** — Agregar link "Servicios" en la navegación |

## Detalle por componente

### 1. `app/(public)/servicios/page.tsx` (Server Component)

- Fetch `prisma.service.findMany({ where: { isActive: true }, orderBy: { category: "asc" } })`
- Serializar `price` con `Number()`, pasar `imageUrl`
- Renderiza `<ServicesCatalog services={...} />`
- Metadata: título "Servicios - GlamStudio", descripción SEO

### 2. `ServicesCatalog.tsx` (Client Component, `"use client"`)

- Recibe `services` como prop
- Extrae categorías únicas con `useMemo`: `[...new Set(services.map(s => s.category).filter(Boolean))]`
- Estado local: `selectedCategory: string | null` (null = todas)
- Filtros como pills/tabs horizontales: "Todos" + cada categoría
- Usa `SERVICE_CATEGORIES` de `lib/constants/landing.ts` para íconos por categoría
- Grid responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Animaciones con `framer-motion`: `AnimatePresence` + `motion.div` con `layout` para transición al filtrar
- Muestra **todos** los servicios (sin `.slice(0, 6)`)
- Paleta: **violet/purple** (consistente con la sección de servicios en landing)

### 3. `ServiceCatalogCard.tsx` (Server Component — sin interactividad)

- Props: `id, name, description, price, duration, category, imageUrl`
- Estructura:
  - Imagen superior (si `imageUrl`, sino placeholder con gradiente violeta + ícono de categoría)
  - Badge de categoría (esquina superior derecha, posición absoluta)
  - `<h3>` con nombre del servicio
  - `<p>` con descripción completa (sin `line-clamp`)
  - Footer: precio (`$X.toLocaleString("es-CL")`) + duración (`Clock` icon) + botón "Reservar" (Link a `/reservar?servicio={id}`)
- Paleta violet: badges `bg-violet-100 text-violet-700`, gradiente `from-violet-500 to-purple-600`, botón `bg-violet-600 hover:bg-violet-700`
- Hover: `shadow-xl`, `-translate-y-1`, `transition-all duration-300`

### 4. Modificación `PublicHeader.tsx`

- Agregar entry "Servicios" en la navegación con link a `/servicios`

## Datos del modelo Service (ya existente)

```
id, name, description?, price (Decimal), duration (min), category?, imageUrl?, isActive
```

## Convenciones

- Server Component para data fetching, Client Component solo para lo interactivo (filtros, animaciones)
- `Number(price)` antes de pasar a client components (Prisma Decimal)
- Reutilizar `Container`, `SectionHeader`, `SERVICE_CATEGORIES`, `Clock` de lucide-react
- Responsivo: 1 col mobile, 2 col tablet, 3 col desktop
- Solo servicios con `isActive: true`