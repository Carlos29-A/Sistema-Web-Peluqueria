# Búsqueda en Tablas Admin

> **Feature:** Campo de búsqueda en tablas de Citas, Staff, Servicios y Galería
> **Historia de usuario:** Como administrador, quiero poder buscar por texto en las tablas de citas, staff, servicios y galería, con resultados filtrados en tiempo real y que se combinen con la paginación, para encontrar registros rápidamente.
> **Prioridad:** Baja

---

## Contexto

Actualmente las tablas del admin no tienen ninguna funcionalidad de búsqueda. Cuando hay muchos registros, el administrador tiene que hacer scroll manual o navegar entre páginas para encontrar lo que busca. Las APIs ya soportan paginación con `page` y `limit`. Falta agregar un parámetro `search` que permita filtrar por texto en los campos relevantes de cada tabla.

---

## Criterios de aceptación

### CA-1: Input de búsqueda en cada tabla

- **Given** que estoy en cualquier tabla admin
- **Then** veo un input con icono de lupa antes de la tabla
- **And** el placeholder es contextual (ej: "Buscar cliente..." en Citas)

### CA-2: Búsqueda con debounce

- **Given** que escribo en el campo de búsqueda
- **When** dejo de escribir por 300ms
- **Then** se ejecuta la búsqueda automáticamente
- **And** la página se reinicia a 1

### CA-3: API con parámetro `search`

- **Given** que realizo una búsqueda
- **Then** la API recibe `search` y filtra con `contains` (case-insensitive):

| Tabla | Campos de búsqueda |
|-------|-------------------|
| Citas | `clientName`, `clientEmail` |
| Staff | `name`, `role` |
| Servicios | `name`, `description`, `category` |
| Galería | `description`, `category` |

### CA-4: Búsqueda combinada con filtros y paginación

- **Given** que tengo un filtro activo y texto de búsqueda
- **Then** la búsqueda se aplica sobre los resultados filtrados
- **And** al cambiar de página, el texto de búsqueda se mantiene

### CA-5: Estado vacío

- **Given** que busco y no hay resultados
- **Then** veo mensaje "No se encontraron resultados para 'texto'" con botón "Limpiar búsqueda"

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | La búsqueda usa `contains` de Prisma (case-insensitive) |
| RB02 | El debounce es de 300ms |
| RB03 | Al escribir, la página se reinicia a 1 |
| RB04 | El campo tiene un botón "×" para limpiar cuando hay texto |
| RB05 | `search` se combina con los filtros existentes |

---

## Archivos a modificar

### APIs (4 archivos)

| Archivo | Cambio |
|---------|--------|
| `app/api/appointments/route.ts` | Agregar `search` con OR en `clientName` y `clientEmail` |
| `app/api/staff/route.ts` | Agregar `search` con OR en `name` y `role` |
| `app/api/services/route.ts` | Agregar `search` con OR en `name`, `description`, `category` |
| `app/api/gallery/route.ts` | Agregar `search` con OR en `description`, `category` |

### Componentes (5 archivos)

| Archivo | Cambio |
|---------|--------|
| `components/admin/SearchInput.tsx` | **Nuevo** — input reutilizable con debounce y lupa |
| `app/admin/citas/components/AppointmentTable.tsx` | Agregar `SearchInput` + estado `search` |
| `app/admin/staff/components/StaffTable.tsx` | Agregar búsqueda |
| `app/admin/servicios/components/ServiceTable.tsx` | Agregar búsqueda |
| `app/admin/galeria/components/GalleryGrid.tsx` | Agregar búsqueda |

---

## Estructura visual

```
┌─────────────────────────────────────┐
│ [Filtros: Todas Pendientes ...]      │
│ 🔍 [Buscar cliente...         ] [×]  │
├─────────────────────────────────────┤
│ Tabla                               │
├─────────────────────────────────────┤
│ Paginación                          │
└─────────────────────────────────────┘
```

---

## Notas adicionales

- El `SearchInput` es un componente reutilizable con debounce de 300ms
- En Citas busca en `clientName` O `clientEmail`
- En Galería busca en `description` O `category`
- Al limpiar la búsqueda, se recargan todos los resultados
