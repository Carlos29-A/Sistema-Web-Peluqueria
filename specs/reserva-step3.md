# Paso 3 — Datos del Cliente y Confirmación

> **Feature:** Tercer paso del sistema de reservas online
> **Historia de usuario:** Como cliente, quiero ingresar mi nombre, email y teléfono, ver un resumen completo de mi cita antes de confirmar, y poder volver atrás si algo no está bien, para asegurarme de que todo esté correcto antes de finalizar mi reserva.
> **Prioridad:** Alta

---

## Contexto

Actualmente el sistema de reservas tiene implementados los **Pasos 1 y 2** (selección de servicio + estilista y horario). El cliente ya eligió un servicio, un estilista (u optó por "Sin preferencia"), una fecha y un horario. Ahora necesita ingresar sus datos de contacto, revisar un resumen completo de su cita y confirmar para que la reserva se guarde en la base de datos con estado `PENDING`.

La API `POST /api/appointments` ya existe y funciona con validación Zod (`appointmentSchema`). El esquema de validación ya tiene todos los campos necesarios.

Este es el **Paso 3** del flujo multi-paso: Servicio ✅ → Estilista + Horario ✅ → **Datos + Confirmar** ✅ → **Éxito**.

---

## Criterios de aceptación

### CA-1: Formulario de datos del cliente

- **Given** que estoy en el Paso 3
- **Then** veo un formulario con los campos:
  - Nombre (obligatorio)
  - Email (obligatorio, formato email válido)
  - Teléfono (obligatorio)
  - Notas (opcional, máximo 500 caracteres)

### CA-2: Validación en tiempo real

- **Given** que estoy llenando el formulario
- **When** intento enviar con datos inválidos
- **Then** veo mensajes de error específicos debajo de cada campo
- **And** el botón "Confirmar reserva" permanece deshabilitado hasta que todos los campos obligatorios sean válidos

### CA-3: Resumen de la cita visible

- **Given** que estoy en el Paso 3
- **Then** veo un panel de resumen que muestra:
  - Servicio seleccionado (nombre, precio, duración)
  - Estilista (nombre y rol, o "Sin preferencia")
  - Fecha seleccionada
  - Hora seleccionada
  - Precio total

### CA-4: Confirmación y creación de la cita

- **Given** que completé el formulario y revisé el resumen
- **When** hago clic en "Confirmar reserva"
- **Then** se ejecuta `POST /api/appointments` con todos los datos acumulados
- **And** la cita se crea con estado `PENDING`
- **And** veo una pantalla de éxito

### CA-5: Pantalla de éxito

- **Given** que la cita se creó correctamente
- **Then** veo:
  - Icono de confirmación (checkmark verde)
  - Mensaje "¡Reserva confirmada!"
  - Resumen de la cita
  - Botón "Volver al inicio" que redirige a `/`
  - Botón "Contactar por WhatsApp" con mensaje predefinido

### CA-6: Manejo de errores

- **Given** que ocurre un error al crear la cita
- **Then** veo un mensaje de error en el formulario
- **And** los datos ingresados no se pierden
- **And** puedo intentar de nuevo

### CA-7: Editar desde el resumen

- **Given** que estoy en el Paso 3
- **Then** veo un botón "Atrás" que vuelve al Paso 2
- **And** al volver, todas las selecciones anteriores se mantienen

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | Todos los campos del formulario se validan con el `appointmentSchema` de Zod |
| RB02 | La cita se crea con `status: "PENDING"` |
| RB03 | `totalPrice` se calcula automáticamente desde el precio del servicio seleccionado |
| RB04 | `staffId` puede ser `null` si el cliente eligió "Sin preferencia" |
| RB05 | Al confirmar, se muestra la pantalla de éxito |
| RB06 | Si el cliente vuelve atrás desde el resumen, los datos del formulario se mantienen |

---

## Flujos

### Flujo principal: Confirmar reserva

```
1. Usuario llega al Paso 3 con servicio, estilista, fecha y hora ya seleccionados
2. Se muestra formulario de datos + resumen de la cita
3. Usuario completa los campos
4. Usuario hace clic en "Confirmar reserva"
5. Se valida el formulario (Zod)
6. Se ejecuta POST /api/appointments con todos los datos
7. La cita se crea con estado PENDING
8. Se muestra pantalla de éxito con resumen
9. Usuario puede volver al inicio o contactar por WhatsApp
```

### Flujo alternativo: Error de validación

```
1. Usuario hace clic en "Confirmar reserva"
2. La validación Zod falla
3. Se muestran errores debajo de los campos correspondientes
4. El formulario no se envía
5. Usuario corrige los datos y reintenta
```

### Flujo alternativo: Error del servidor

```
1. Usuario hace clic en "Confirmar reserva"
2. Validación pasa, pero POST /api/appointments falla
3. Se muestra mensaje de error
4. Los datos del formulario se mantienen
5. Usuario puede intentar de nuevo o contactar por WhatsApp
```

### Flujo alternativo: Volver atrás

```
1. Usuario está en el Paso 3
2. Usuario hace clic en "Atrás"
3. Vuelve al Paso 2 con todas las selecciones intactas
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│  Paso 1 ● Paso 2 ● Paso 3 ●        │
│  Servicio  Horario  Confirmar       │
├─────────────────────────────────────┤
│                                     │
│  ┌────────────┐ ┌────────────────┐  │
│  │ Tus datos  │ │  Resumen       │  │
│  │            │ │                │  │
│  │ Nombre     │ │ ✂ Corte $25   │  │
│  │ [_________]│ │ 👩 María García│  │
│  │            │ │ 📅 15/06/2026  │  │
│  │ Email      │ │ ⏰ 10:30       │  │
│  │ [_________]│ │                │  │
│  │            │ │ Total: $25     │  │
│  │ Teléfono   │ └────────────────┘  │
│  │ [_________]│                     │
│  │            │   [← Atrás]         │
│  │ Notas      │   [Confirmar →]     │
│  │ [_________]│                     │
│  └────────────┘                     │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `components/public/cards/StepClientInfo.tsx` | Formulario de datos + resumen + confirmación + pantalla de éxito |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `components/public/sections/ReservationStepper.tsx` | Integrar `StepClientInfo` en Paso 3, pasar datos acumulados |

---

## Notas adicionales

- Se reutiliza `appointmentSchema` de `lib/validations/appointment.ts` para la validación.
- Se reutilizan `CatalogService`, `StaffWithSchedule` de `@/types` para el resumen.
- El estado del stepper acumula: `selectedServiceId`, `selectedStaffId`, `selectedDate`, `selectedTime`.
- La pantalla de éxito es parte del mismo componente (no una ruta separada).
- El botón de WhatsApp abre: `https://wa.me/[numero]?text=Hola%2C%20quiero%20confirmar%20mi%20reserva%20en%20[negocio]`
