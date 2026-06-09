# Gestión de Horarios de Staff

> **Feature:** Página independiente para configurar horarios de trabajo de estilistas
> **Historia de usuario:** Como administrador, quiero tener una página dedicada donde pueda ver todos los estilistas y configurar sus días y horarios de trabajo con múltiples bloques por día, para que el sistema de reservas calcule correctamente la disponibilidad.
> **Prioridad:** Alta

---

## Contexto

Actualmente el modelo `Schedule` existe en Prisma con los campos `staffId`, `dayOfWeek`, `startTime`, `endTime`. El seed crea horarios para María García (L a V, 9:00-18:00), pero no hay ninguna interfaz en el admin para que el administrador pueda gestionar estos horarios. El sistema de reservas (Paso 2) ya usa los horarios para calcular disponibilidad, pero sin UI de gestión no se pueden personalizar.

---

## Criterios de aceptación

### CA-1: Página `/admin/horarios` existe con todos los estilistas

- **Given** que soy un administrador autenticado
- **When** navego a `/admin/horarios`
- **Then** veo una lista de todos los estilistas activos
- **And** cada estilista tiene un panel expandible con su configuración de horarios

### CA-2: Sección de horarios por estilista

- **Given** que expandí un estilista
- **Then** veo una tabla de 7 filas (Lun a Dom) con:
  - Checkbox para activar/desactivar el día
  - Select de hora inicio (HH:MM)
  - Select de hora fin (HH:MM)
  - Botón "+" para agregar otro bloque horario ese mismo día

### CA-3: Múltiples bloques por día

- **Given** que estoy editando un estilista
- **When** hago clic en "+" en un día
- **Then** se agrega un nuevo bloque con hora inicio y fin
- **And** puedo agregar tantos bloques como necesite
- **And** cada bloque tiene un botón "×" para eliminarlo

### CA-4: Validación de horarios

- **Given** que estoy configurando horarios
- **Then** no se permiten bloques donde `startTime >= endTime`
- **And** no se permiten bloques solapados dentro del mismo día
- **And** se muestran mensajes de error claros si hay conflictos

### CA-5: Guardado

- **Given** que configuré los horarios de un estilista
- **When** hago clic en "Guardar horarios"
- **Then** se envían los datos a la API y se guardan en la base de datos
- **And** veo un toast de éxito

### CA-6: Los horarios se reflejan en la reserva

- **Given** que un administrador configuró horarios para un estilista
- **When** un cliente llega al Paso 2 de la reserva
- **Then** los días y horarios disponibles del estilista corresponden a lo configurado

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | Si un día no tiene ningún bloque, el estilista no está disponible ese día |
| RB02 | Un día puede tener múltiples bloques (ej: mañana 9:00-12:00, tarde 14:00-18:00) |
| RB03 | Los bloques no pueden solaparse dentro del mismo día |
| RB04 | `startTime` debe ser menor que `endTime` |
| RB05 | Solo estilistas activos (`isActive: true`) aparecen en la página |
| RB06 | Al guardar, se reemplaza TODO el schedule del estilista (no se hace merge) |

---

## Flujos

### Flujo principal: Editar horarios de un estilista

```
1. Admin navega a /admin/horarios
2. Se cargan todos los estilistas activos con sus horarios actuales
3. Admin hace clic en un estilista para expandir su panel
4. Admin activa checkboxes de los días que trabaja
5. Admin ajusta hora inicio y fin para cada bloque
6. Admin agrega o elimina bloques según necesite
7. Admin hace clic en "Guardar horarios"
8. Se envían los datos a la API
9. Se muestra toast de éxito
```

### Flujo alternativo: Error de validación

```
1. Admin configura un bloque con hora inicio > hora fin
2. Admin hace clic en "Guardar horarios"
3. Se muestra error de validación en el bloque conflictivo
4. Admin corrige y reintenta
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│  Gestión de Horarios                │
├─────────────────────────────────────┤
│                                     │
│  ▼ María García - Estilista Senior  │
│  ┌─────────┬───────┬───────┬──────┐│
│  │ Día     │ Inicio│ Fin   │      ││
│  ├─────────┼───────┼───────┼──────┤│
│  │ ☑ Lun   │ 09:00 │ 12:00 │  ×   ││
│  │         │ 14:00 │ 18:00 │  ×   ││
│  │         │               │ [+ ] ││
│  ├─────────┼───────┼───────┼──────┤│
│  │ ☑ Mar   │ 09:00 │ 18:00 │  ×   ││
│  │         │               │ [+ ] ││
│  ├─────────┼───────┼───────┼──────┤│
│  │ ☐ Mié   │       │       │[+ ]  ││
│  └─────────┴───────┴───────┴──────┘│
│  [Guardar horarios]                │
│                                     │
│  ▼ Carlos López - Barbero           │
│  ┌─────────┬───────┬───────┬──────┐│
│  │ ☑ Lun   │ 14:00 │ 20:00 │  ×   ││
│  │         │               │ [+ ] ││
│  └─────────┴───────┴───────┴──────┘│
│  [Guardar horarios]                │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `app/admin/horarios/page.tsx` | Server Component que obtiene staff activos y sus horarios |
| `app/admin/horarios/components/ScheduleEditor.tsx` | Client Component con panel editable de horarios |
| `app/api/staff/[id]/schedule/route.ts` | API para GET/PUT los horarios de un estilista |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `app/admin/layout.tsx` | Agregar link a `/admin/horarios` en el sidebar |

---

## Notas adicionales

- Cada estilista se guarda individualmente (no hay "Guardar todo").
- Los inputs de hora pueden ser `type="time"` nativos del navegador (formato HH:MM).
- Al expandir un estilista, se cargan sus horarios actuales via GET.
- Se reutiliza el tipo `ScheduleSlot` de `@/types`.
- El sidebar debe incluir un ícono de `Clock` para la sección de horarios.
