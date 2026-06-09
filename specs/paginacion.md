# Paginación en Tablas Admin

> **Feature:** Paginación con navegación de páginas en tablas del panel admin
> **Historia de usuario:** Como administrador, quiero poder navegar entre páginas de resultados en las tablas de citas, servicios, staff y galería, con controles de página anterior/siguiente y números, manteniendo los filtros activos al cambiar de página, para que no se carguen todos los registros de golpe cuando haya muchos.
> **Prioridad:** Baja

---

## Contexto

Actualmente las tablas del admin (Citas, Servicios, Staff, Galería) cargan **todos los registros** de la base de datos en una sola petición y los muestran completos en la página. A medida que el negocio crezca y acumule más datos, esto provocará tiempos de carga lentos, scroll excesivo y consumo innecesario de memoria.

Las API routes actuales no soportan paginación. Necesitan aceptar parámetros `page` y `limit` para devolver solo un subconjunto de registros más metadata de paginación.

---

## Criterios de aceptación

### CA-1: Parámetros de paginación en APIs

- **Given** que consulto una tabla admin
- **When** la tabla solicita datos a la API
- **Then** la API acepta `page` (empieza en 1) y `limit` (default 20, max 50)
- **And** la API retorna `{ items, total, page, limit, totalPages }`

### CA-2: Controles de paginación visibles

- **Given** que hay más de `limit` registros
- **Then** veo debajo de la tabla:
  - Botón "Anterior" (deshabilitado en página 1)
  - Números de página (máximo 5 visibles con ellipsis)
  - Botón "Siguiente" (deshabilitado en última página)
  - Texto "Mostrando X-Y de Z registros"

### CA-3: Persistencia de filtros

- **Given** que tengo un filtro activo
- **When** cambio de página
- **Then** el filtro se mantiene activo en la nueva página

### CA-4: Indicador de carga

- **Given** que cambio de página o filtro
- **Then** veo un indicador de carga mientras se obtienen los nuevos datos

### CA-5: APIs con paginación

| API | Parámetros nuevos |
|-----|-------------------|
| `GET /api/appointments` | `page`, `limit`, (más `status`, `date`, `staffId`) |
| `GET /api/services` | `page`, `limit` |
| `GET /api/staff` | `page`, `limit`, (más `active`) |
| `GET /api/gallery` | `page`, `limit`, (más `featured`, `category`, `staffId`) |

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | `limit` por defecto es 20. Máximo permitido 50 |
| RB02 | `page` empieza en 1. Si es menor a 1, se usa 1 |
| RB03 | Si `page` excede `totalPages`, se devuelve página vacía (no error) |
| RB04 | Los filtros existentes se combinan con la paginación |
| RB05 | `total` se calcula con `count` usando los mismos filtros (sin paginación) |

---

## Estructura visual del paginador

```
[← Anterior]  1  2  3  ...  10  [Siguiente →]
Mostrando 1-20 de 198 registros
```

---

## Archivos a modificar

### APIs (4 archivos)

| Archivo | Cambio |
|---------|--------|
| `app/api/appointments/route.ts` | Agregar `page`/`limit` a query, `skip`/`take` en Prisma, metadata de paginación |
| `app/api/services/route.ts` | Agregar paginación |
| `app/api/staff/route.ts` | Agregar paginación |
| `app/api/gallery/route.ts` | Agregar paginación |

### Frontend (4 archivos + 1 componente nuevo)

| Archivo | Cambio |
|---------|--------|
| `components/admin/Pagination.tsx` | **Nuevo** — componente reutilizable de paginación |
| `app/admin/citas/components/AppointmentTable.tsx` | Agregar `page` state + `Pagination` |
| `app/admin/servicios/components/ServiceTable.tsx` | Agregar paginación |
| `app/admin/staff/components/StaffTable.tsx` | Agregar paginación |
| `app/admin/galeria/components/GalleryGrid.tsx` | Agregar paginación |

---

## Notas adicionales

- El componente `Pagination` recibe props: `page`, `totalPages`, `total`, `limit`, `onPageChange`.
- No se necesita selector de items por página — usar fixed de 20.
- Las APIs existentes siguen funcionando sin `page`/`limit` (compatibilidad hacia atrás).
- Los filtros (`status`, `category`, `featured`, etc.) se mantienen al cambiar de página.
