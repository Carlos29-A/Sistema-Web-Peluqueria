# Paso 1 — Seleccionar Servicio para Reserva

> **Feature:** Primer paso del sistema de reservas online
> **Historia de usuario:** Como cliente, quiero poder ver una lista clara de servicios disponibles, filtrar por categoría si lo deseo, y seleccionar uno para comenzar mi reserva, para que el sistema sepa qué tratamiento voy a recibir.
> **Prioridad:** Alta

---

## Contexto

Actualmente la página `/reservar` es un placeholder que dice "Estamos trabajando en nuestro sistema de reservas en línea". Los catálogos de servicios (`/servicios`) y equipo (`/equipo`) ya tienen enlaces que apuntan a `/reservar?servicio=ID` y `/reservar?staff=ID`, pero la página no procesa esos parámetros. El sistema de reservas aún no tiene ningún paso implementado.

Este es el **Paso 1** de un flujo multi-paso (stepper) que permitirá al cliente seleccionar servicio → elegir estilista y horario → ingresar sus datos y confirmar.

---

## Criterios de aceptación

### CA-1: La página `/reservar` ya no es un placeholder

- **Given** que soy un cliente
- **When** navego a `/reservar`
- **Then** veo el primer paso del sistema de reservas, no un mensaje de "estamos trabajando"

### CA-2: Se muestran solo servicios activos

- **Given** que veo la lista de servicios
- **Then** solo veo servicios con `isActive: true`, obtenidos desde la base de datos

### CA-3: Grid de servicios con información completa

- **Given** que veo los servicios
- **Then** cada servicio se muestra en una tarjeta que incluye:
  - Nombre del servicio
  - Precio
  - Duración en minutos
  - Categoría (con badge de color)
  - Icono representativo según categoría

### CA-4: Filtro por categoría

- **Given** que hay múltiples categorías de servicios
- **When** hago clic en un filtro de categoría
- **Then** la lista se filtra para mostrar solo los servicios de esa categoría
- **And** hay un filtro "Todos" que muestra todos los servicios

### CA-5: Preselección por URL

- **Given** que llego a `/reservar?servicio=ID`
- **Then** el servicio con ese ID aparece preseleccionado automáticamente

### CA-6: Botón "Siguiente" habilitado solo con selección

- **Given** que no he seleccionado ningún servicio
- **Then** el botón "Siguiente" está deshabilitado
- **When** selecciono un servicio
- **Then** el botón "Siguiente" se habilita
- **And** al hacer clic, avanza al Paso 2 (seleccionar estilista y horario)

### CA-7: Barra de progreso del stepper

- **Given** que estoy en el Paso 1
- **Then** veo una barra de progreso que indica "Paso 1 de 3"
- **And** el paso actual está resaltado visualmente

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | Solo se muestran servicios con `isActive: true` |
| RB02 | Los servicios se ordenan por categoría alfabéticamente |
| RB03 | Si no hay servicios activos, se muestra un mensaje "No hay servicios disponibles" con botón "Volver al inicio" |
| RB04 | La selección de servicio es obligatoria para avanzar al siguiente paso |
| RB05 | El parámetro `?servicio=ID` en la URL preselecciona el servicio automáticamente |

---

## Flujos

### Flujo principal: Seleccionar servicio desde la lista

```
1. Usuario llega a /reservar
2. Se cargan los servicios activos desde la API
3. Se muestran en un grid con nombre, precio, duración, categoría
4. Usuario puede filtrar por categoría si lo desea
5. Usuario hace clic en un servicio para seleccionarlo
6. El servicio queda resaltado visualmente
7. Botón "Siguiente" se habilita
8. Usuario hace clic en "Siguiente"
9. Se avanza al Paso 2
```

### Flujo alternativo: Llegada con servicio preseleccionado

```
1. Usuario llega a /reservar?servicio=ID (desde catálogo de servicios o equipo)
2. Se cargan los servicios activos
3. El servicio con ID coincidente aparece preseleccionado y resaltado
4. Botón "Siguiente" se habilita automáticamente
5. Usuario puede cambiar de servicio si lo desea
```

### Flujo alternativo: Sin servicios disponibles

```
1. Usuario llega a /reservar
2. No hay servicios activos en la base de datos
3. Se muestra mensaje "No hay servicios disponibles actualmente"
4. Se muestra botón "Volver al inicio"
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│  Paso 1 ● ● ●                       │
│  Servicio  ○ Horario  ○ Confirmar   │
├─────────────────────────────────────┤
│                                     │
│  Categorías: [Todos] [Corte] [Color]│
│                                     │
│  ┌──────────┐ ┌──────────┐         │
│  │ ✂ Corte  │ │ 🎨 Color  │         │
│  │ $25      │ │ $80      │         │
│  │ 45 min   │ │ 120 min  │         │
│  └──────────┘ └──────────┘         │
│                                     │
│  ┌──────────┐ ┌──────────┐         │
│  │ ✂ Corte  │ │ 💆 Trat.  │         │
│  │ $35      │ │ $120     │         │
│  │ 60 min   │ │ 90 min   │         │
│  └──────────┘ └──────────┘         │
│                                     │
│         [← Atrás]  [Siguiente →]    │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `components/public/cards/StepSelectService.tsx` | Grid de servicios con filtros y selección |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `app/(public)/reservar/page.tsx` | Reemplazar placeholder por Server Component con datos y stepper |
| `components/public/sections/ReservationStepper.tsx` | Orquestador multi-paso (si no existe, crearlo) |

---

## Notas adicionales

- Grid responsive: 1 columna en mobile, 2 en tablet, 3 en desktop.
- Selección visual clara: borde resaltado, checkmark o cambio de fondo.
- Los iconos por categoría ya existen en `lib/constants/landing.ts` (`SERVICE_CATEGORIES`).
- El componente recibe `services: CatalogService[]` y `defaultServiceId?: string` como props.
- Callback `onSelect(serviceId: string)` notifica al stepper la selección.
- Los datos se obtienen desde `prisma.service.findMany({ where: { isActive: true } })` en el Server Component.
