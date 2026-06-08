# Especificación: Página de Equipo `/equipo`

## Resumen

Página pública dedicada que muestra el equipo de estilistas con perfiles expandibles inline, galería de trabajos por estilista (filtrable por categoría), servicios que ofrece y CTA de reserva. Paleta **neutra/elegante**: negro, grises, blanco, tonos piel.

## Historia de usuario

Como cliente, quiero conocer al equipo de estilistas y ver su galería de trabajos realizados para elegir con quién quiero agendar.

## Suposiciones validadas

1. Página dedicada en `/equipo`
2. Perfil expandido de cada estilista (bio, servicios, galería)
3. Galería filtrada por `staffId`
4. Botón "Reservar con este estilista" → `/reservar?staff={id}`
5. Solo estilistas activos (`isActive: true`)
6. Card resumida: nombre, rol, foto, extracto, cantidad de trabajos/servicios
7. Expansión inline (no otra página)
8. Galería filtrable por categoría dentro del perfil
9. Link de Instagram si disponible
10. **Paleta: negro/plomo/blanco/piel** — elegante y minimalista como el dashboard
11. Servicios que ofrece cada estilista (desde `StaffService`)

## Paleta de colores

| Elemento | Color |
|----------|-------|
| Fondo página | `bg-gray-50` / `bg-white` |
| Cards de resumen | `bg-white border border-gray-200` |
| Texto principal | `text-gray-900` |
| Texto secundario | `text-gray-500` |
| Rol/especialidad | `text-stone-600` / `text-neutral-600` |
| Foto placeholder | gradiente `from-stone-200 to-stone-100` |
| Botón CTA principal | `bg-gray-900 hover:bg-gray-800 text-white` |
| Botón filtro activo | `bg-gray-900 text-white` |
| Botón filtro inactivo | `bg-white text-gray-600 border-gray-200` |
| Línea decorativa | `bg-stone-400` |
| Iconos | `text-gray-400` / `text-stone-500` |
| Perfil expandido fondo | `bg-white` con sombra `shadow-lg` |
| Hover cards | `hover:shadow-xl hover:border-gray-300` |

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `app/(public)/equipo/page.tsx` | **Crear** — Server Component: fetch staff activo + servicios + galería |
| `components/public/sections/StaffCatalog.tsx` | **Crear** — Client Component con expansión inline y filtros |
| `components/public/cards/StaffCatalogCard.tsx` | **Crear** — Card resumida del estilista (negro/blanco/piel) |
| `components/public/cards/StaffProfileExpanded.tsx` | **Crear** — Perfil expandido inline con galería y servicios |
| `components/public/layout/PublicHeader.tsx` | **Modificar** — Agregar link "Equipo" en la navegación |

## Detalle por componente

### 1. `app/(public)/equipo/page.tsx` (Server Component)

- Fetch paralelo: staff activo con `staffServices` + galería
- Serializar datos (Decimal → Number si aplica)
- Pasar al client component `StaffCatalog`
- Metadata SEO: "Equipo - GlamStudio"

```typescript
const staff = await prisma.staff.findMany({
  where: { isActive: true },
  orderBy: { createdAt: "asc" },
  include: {
    staffServices: {
      include: { service: { select: { id: true, name: true, category: true } } }
    },
    gallery: { orderBy: { createdAt: "desc" } },
  },
})
```

### 2. `StaffCatalogCard.tsx` — Card resumida

- Foto circular con borde sutil, nombre, rol, extracto bio (`line-clamp-2`)
- Cantidad de servicios y trabajos como badges sutiles
- Flecha/indicador de expansión
- Click → expande el perfil inline
- Hover: sombra suave, borde ligeramente más oscuro
- Paleta: blanco, gris suave, texto negro/gris

### 3. `StaffProfileExpanded.tsx` — Perfil expandido

- Se expande debajo de la card clickeada (no en página separada)
- Contiene:
  - Foto grande (rectangular con rounded), nombre, rol, bio completa
  - Link de Instagram si existe
  - Lista de servicios que ofrece (badges/pills)
  - Galería de trabajos con filtro por categoría (mismo patrón de pills que ServicesCatalog)
  - Botón "Reservar con [nombre]" → `/reservar?staff={id}`
- Animación de expansión con `framer-motion` (`AnimatePresence` + layout)
- Fondo blanco, sombra pronunciada, bordes sutiles
- Botón cerrar/minimizar

### 4. `StaffCatalog.tsx` — Client Component orquestador

- Estado local: `expandedId: string | null` (ID del estilista expandido)
- Renderiza grid de `StaffCatalogCard`
- Cuando se expande uno, inserta `StaffProfileExpanded` debajo de la card
- Usa `LayoutGroup` + `AnimatePresence` para animación suave
- Si se hace clic en otra card, cierra la actual y abre la nueva

### 5. `PublicHeader.tsx` — Agregar link "Equipo"

- Desktop: link "Equipo" en nav, destacado cuando `pathname === "/equipo"`
- Mobile: entrada "Equipo" en menú hamburguesa

## Datos del modelo Staff (ya existente)

```
id, name, role, bio?, photoUrl?, instagram?, isActive
```

### Relaciones incluidas

- `staffServices` → incluye `service` (id, name, category)
- `gallery` → imágenes de la galería del estilista (imageUrl, description?, category?)

## Convenciones

- Server Component para data fetching, Client Component solo para lo interactivo (expansión, filtros, galería)
- `Number()` para campos Decimal antes de pasar a client components
- Reutilizar `Container`, `SectionHeader` de components/public/ui
- Animaciones con `framer-motion`: `LayoutGroup`, `AnimatePresence`, `motion.div` con `layout`
- Grid responsive: 1 col mobile, 2 col tablet, 3-4 col desktop
- Solo staff con `isActive: true`