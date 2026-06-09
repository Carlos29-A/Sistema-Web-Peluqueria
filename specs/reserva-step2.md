# Paso 2 — Seleccionar Estilista y Horario

> **Feature:** Segundo paso del sistema de reservas online
> **Historia de usuario:** Como cliente, quiero poder ver los estilistas que realizan el servicio que elegí, seleccionar una fecha disponible y elegir un horario libre, para reservar con quien prefiera en el momento que mejor me convenga.
> **Prioridad:** Alta

---

## Contexto

Actualmente el sistema de reservas tiene implementado el **Paso 1** (selección de servicio). El cliente ya eligió un servicio y ahora necesita seleccionar un estilista y un horario disponible para completar su reserva. Los modelos `Schedule`, `StaffService` y `Appointment` ya existen en Prisma con datos seed, pero no hay UI ni lógica de disponibilidad implementada.

Este es el **Paso 2** del flujo multi-paso: Servicio ✅ → **Estilista + Horario** → Confirmar.

---

## Criterios de aceptación

### CA-1: Solo se muestran estilistas que ofrecen el servicio seleccionado

- **Given** que seleccioné un servicio en el Paso 1
- **When** llego al Paso 2
- **Then** solo veo los estilistas que tienen ese servicio asociado en `StaffService`
- **And** hay una opción "Sin preferencia" al inicio de la lista

### CA-2: Opción "Sin preferencia"

- **Given** que estoy en el Paso 2
- **Then** veo una tarjeta "Sin preferencia" que permite reservar sin asignar estilista
- **When** selecciono "Sin preferencia"
- **Then** se muestran los horarios combinados de todos los estilistas disponibles

### CA-3: Preselección por URL

- **Given** que llego a `/reservar?staff=ID` desde el catálogo de equipo
- **Then** el estilista con ese ID aparece preseleccionado automáticamente

### CA-4: Calendario visual de fechas

- **Given** que seleccioné un estilista (o "Sin preferencia")
- **Then** veo un calendario con:
  - Mes actual con navegación (mes anterior / siguiente)
  - Días del mes en grid
  - Días no laborables atenuados (según `Schedule`)
  - Días pasados deshabilitados

### CA-5: Slots de horario disponibles

- **Given** que seleccioné un estilista y una fecha
- **Then** se calculan horarios según:
  - `Schedule` del estilista para ese día de la semana
  - Citas existentes para esa fecha y estilista
  - Bloques según duración del servicio seleccionado
- **When** no hay slots disponibles
- **Then** se muestra mensaje "No hay horarios disponibles para esta fecha"

### CA-6: Navegación entre pasos

- **Given** que estoy en el Paso 2
- **Then** veo botón "Atrás" que vuelve al Paso 1 (manteniendo selecciones)
- **And** botón "Siguiente" habilitado solo cuando hay fecha y hora seleccionadas

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | Los estilistas se filtran por `StaffService` según el `serviceId` del Paso 1 |
| RB02 | Los días laborables se determinan por `Schedule.dayOfWeek` (0=Domingo…6=Sábado) |
| RB03 | Los slots se generan desde `Schedule.startTime` hasta `endTime` en intervalos de la duración del servicio |
| RB04 | Una cita existente bloquea su `appointmentTime` + `service.duration` minutos |
| RB05 | No se permiten reservas en días pasados |
| RB06 | El parámetro `?staff=ID` preselecciona el estilista automáticamente |

---

## Flujos

### Flujo principal: Seleccionar estilista + horario

```
1. Usuario llega al Paso 2 con servicio seleccionado
2. Se cargan estilistas que ofrecen ese servicio (desde StaffService)
3. Se muestra opción "Sin preferencia" + tarjetas de estilistas
4. Usuario selecciona un estilista
5. Se muestra calendario con días laborables resaltados
6. Usuario selecciona una fecha
7. Se consultan citas existentes para ese staff + fecha
8. Se muestran slots horarios disponibles
9. Usuario selecciona un horario
10. Botón "Siguiente" se habilita
11. Usuario avanza al Paso 3
```

### Flujo alternativo: Sin preferencia

```
1. Usuario selecciona "Sin preferencia"
2. Se muestran horarios combinados de todos los estilistas
3. Los slots muestran disponibilidad general
```

### Flujo alternativo: Sin estilistas para el servicio

```
1. No hay estilistas que ofrezcan el servicio seleccionado
2. Se muestra mensaje "No hay estilistas disponibles para este servicio"
3. Botón "Volver a servicios" para cambiar de servicio
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│  Paso 1 ● Paso 2 ● ○ Confirmar ○    │
├─────────────────────────────────────┤
│  Estilistas                         │
│  ┌──────────────────────────────┐   │
│  │ ○ Sin preferencia            │   │
│  └──────────────────────────────┘   │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Foto 1│ │Foto 2│ │Foto 3│       │
│  │María │ │Ana   │ │Luisa │       │
│  │Corte │ │Color │ │Corte │       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  Fecha: [Calendario visual]         │
│   ← Diciembre 2026 →               │
│   Lu Ma Mi Ju Vi Sa Do             │
│        1   2  3  4  5  6           │
│   7  8  9  ...                     │
│                                     │
│  Horarios disponibles               │
│  [09:00] [09:45] [10:30] [11:15]   │
│  [14:00] [14:45] [15:30]           │
│                                     │
│    [← Atrás]     [Siguiente →]      │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `components/public/cards/StepSelectStaff.tsx` | Paso 2: selección de estilista, calendario y horarios |
| `lib/utils/availability.ts` | Funciones para calcular slots disponibles desde Schedule y citas existentes |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `components/public/sections/ReservationStepper.tsx` | Integrar `StepSelectStaff` en Paso 2, pasar `selectedServiceId`, `staff` y `services` |

---

## Notas adicionales

- El calendario se implementa con un grid simple de días (no requiere librería externa).
- La función `getAvailableSlots` debe ser pura, reutilizable y recibir: `staffSchedule`, `existingAppointments`, `serviceDuration`, `date`.
- Para "Sin preferencia", los slots se calculan como unión de horarios disponibles de todos los estilistas.
- Los datos de `Schedule` se cargan desde el Server Component y se pasan como props.
- Las citas existentes se obtienen vía fetch en el cliente (GET /api/appointments?date=X&staffId=Y).
