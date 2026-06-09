# Toggle Activo/Inactivo para Staff y Servicios

> **Feature:** Botón de activar/inactivar rápido desde tablas admin
> **Historia de usuario:** Como administrador, quiero poder activar o inactivar rápidamente a un miembro del staff o un servicio con un solo clic desde la tabla o tarjeta, sin tener que abrir el formulario de edición, para que los cambios de disponibilidad se reflejen al instante.
> **Prioridad:** Baja

---

## Contexto

Actualmente los modelos `Staff` y `Service` tienen el campo `isActive: Boolean @default(true)` y los formularios de edición incluyen un checkbox "Activo". Para inactivar un miembro del staff o un servicio, el administrador debe abrir el modal de edición, buscar el checkbox, desmarcarlo y guardar. No hay una acción directa desde la tabla o tarjeta.

Las APIs `PUT /api/staff/[id]` y `PUT /api/services/[id]` ya aceptan el campo `isActive`.

---

## Criterios de aceptación

### CA-1: Botón de toggle en Staff

- **Given** que estoy en `/admin/staff`
- **Then** cada tarjeta tiene un botón toggle con el estado actual
- **When** hago clic en el toggle
- **Then** se ejecuta `PUT /api/staff/[id]` con `isActive: false` o `true`
- **And** el badge de estado se actualiza sin recargar la página

### CA-2: Botón de toggle en Servicios

- **Given** que estoy en `/admin/servicios`
- **Then** cada fila tiene un botón toggle con el estado actual
- **When** hago clic en el toggle
- **Then** se ejecuta `PUT /api/services/[id]` con `isActive: false` o `true`
- **And** el badge de estado se actualiza sin recargar la página

### CA-3: Feedback visual inmediato

- **Given** que hago clic en el toggle
- **Then** el icono cambia inmediatamente (optimistic update)
- **And** se muestra toast: "Servicio desactivado" / "Servicio activado" / "Staff desactivado" / "Staff activado"
- **And** si la petición falla, se revierte el cambio y se muestra toast de error

### CA-4: Reflejo en parte pública

- **Given** que inactivé un servicio
- **When** un cliente visita la landing o el catálogo
- **Then** el servicio inactivo no aparece

- **Given** que inactivé un staff
- **When** un cliente visita la landing o la página de equipo
- **Then** el staff inactivo no aparece

### CA-5: Staff inactivo no aparece en reservas

- **Given** que inactivé un estilista
- **When** un cliente llega al Paso 2 de la reserva
- **Then** ese estilista no aparece en la lista de selección

### CA-6: Consistencia con edición

- **Given** que inactivé desde el toggle
- **When** abro el formulario de edición
- **Then** el checkbox "Activo" refleja el nuevo estado

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | El toggle cambia `isActive` al valor opuesto |
| RB02 | Las APIs `PUT /api/staff/[id]` y `PUT /api/services/[id]` ya aceptan `isActive` |
| RB03 | Servicios inactivos no se muestran en landing, catálogo ni reservas |
| RB04 | Staff inactivos no se muestran en landing, equipo ni reservas |
| RB05 | El cambio es inmediato sin recargar página |

---

## Flujos

### Flujo principal: Inactivar un servicio

```
1. Admin está en /admin/servicios
2. Admin hace clic en el toggle de "Corte de Cabello"
3. El icono cambia visualmente (optimistic update)
4. PUT /api/services/[id] con { isActive: false }
5. Toast: "Servicio desactivado"
6. Badge cambia de verde a gris
7. El servicio deja de aparecer en landing y catálogo
```

### Flujo alternativo: Error en la petición

```
1. Admin hace clic en el toggle
2. Icono cambia (optimistic)
3. PUT falla
4. Icono revierte al estado anterior
5. Toast: "Error al actualizar"
```

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `app/admin/staff/components/StaffTable.tsx` | Agregar botón toggle en cada tarjeta |
| `app/admin/servicios/components/ServiceTable.tsx` | Agregar botón toggle en cada fila |

## APIs implicadas

| API | Ya soporta `isActive` |
|-----|-----------------------|
| `PUT /api/staff/[id]` | Sí — `updateStaffSchema` incluye `isActive` |
| `PUT /api/services/[id]` | Sí — `updateServiceSchema` incluye `isActive` |

---

## Notas adicionales

- Iconos recomendados de lucide-react: `ToggleLeft` / `ToggleRight` o `Power`
- Se usa optimistic update: el estado visual cambia antes de la respuesta del servidor
- Si la API falla, se revierte al estado anterior
- Se reutilizan los schemas de validación existentes
