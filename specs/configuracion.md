# Configuración del Negocio — GlamStudio

> **Feature:** Panel de configuración del negocio
> **Historia de usuario:** Como administrador, quiero poder editar los datos del negocio (nombre, teléfono, WhatsApp, dirección, redes sociales, horarios, moneda) desde el panel de admin, organizados por secciones, para que los clientes vean información actualizada sin necesidad de modificar la base de datos directamente.
> **Prioridad:** Alta

---

## Contexto

La aplicación tiene una tabla `BusinessConfig` (key-value) que almacena datos del negocio: nombre, teléfono, WhatsApp, dirección, redes sociales, horarios, email. La API `GET/PUT /api/business-config` ya existe y funciona. El sidebar del admin ya tiene un link a `/admin/configuracion` pero la página no existe. Actualmente, la única forma de modificar estos datos es editando la base de datos directamente o ejecutando el seed.

El footer público (`PublicFooter`) y el botón de WhatsApp consumen estos datos. El header está hardcodeado con "GlamStudio" y no lee de la config.

---

## Criterios de aceptación

### CA-1: La página `/admin/configuracion` existe y es accesible

- **Given** que soy un administrador autenticado
- **When** hago clic en "Configuración" en el sidebar
- **Then** se carga la página `/admin/configuracion` con el formulario de configuración

### CA-2: El formulario tiene 4 secciones visuales

- **Given** que estoy en la página de configuración
- **Then** veo 4 secciones claramente diferenciadas con encabezado y separación visual:
  1. **Datos del negocio** — `business_name`, `currency`
  2. **Contacto** — `phone`, `whatsapp`, `email`, `address`
  3. **Redes sociales** — `instagram`, `facebook`
  4. **Horarios** — `opening_hours`

### CA-3: Los campos se cargan con los valores actuales

- **Given** que entro a la página de configuración
- **When** la página carga
- **Then** se ejecuta `GET /api/business-config` y cada campo del formulario se rellena con el valor actual de la base de datos

### CA-4: Validación de campos

| Campo | Obligatorio | Validación |
|-------|-------------|------------|
| `business_name` | Sí | Mínimo 2 caracteres, máximo 100 |
| `currency` | Sí | Debe ser uno de: `USD`, `EUR`, `PEN`, `MXN`, `COP`, `CLP`, `ARS` |
| `phone` | No | Si se ingresa, debe tener entre 7 y 20 caracteres, solo números, espacios, paréntesis, guiones y signo `+` |
| `whatsapp` | No | Si se ingresa, mismo formato que teléfono |
| `email` | No | Si se ingresa, debe ser formato email válido |
| `address` | No | Máximo 200 caracteres |
| `instagram` | No | Máximo 50 caracteres, sin `@` al inicio (se agrega automáticamente en el footer) |
| `facebook` | No | Máximo 100 caracteres, sin URL completa (solo el username/handle) |
| `opening_hours` | No | Máximo 300 caracteres |

### CA-5: Guardado exitoso

- **Given** que completé el formulario con datos válidos
- **When** hago clic en "Guardar cambios"
- **Then**:
  - Se ejecuta `PUT /api/business-config` con los campos modificados
  - Se muestra un toast de éxito: "Configuración guardada correctamente"
  - Los campos permanecen con los valores guardados (no se limpia el formulario)

### CA-6: Error en el guardado

- **Given** que ocurrió un error al guardar (ej: API caída, validación fallida)
- **When** el servidor responde con error
- **Then**:
  - Se muestra un toast de error con el mensaje del servidor
  - Los datos del formulario NO se modifican (se mantienen los valores que el usuario ingresó)

### CA-7: El campo moneda se refleja en los precios públicos

- **Given** que el administrador cambió la moneda (ej: de `USD` a `PEN`)
- **When** un cliente visita la página de servicios
- **Then** los precios se muestran con el símbolo de la moneda configurada (ej: `S/ 25.00` en lugar de `$25.00`)

### CA-8: Solo accesible por rol admin

- **Given** que soy un usuario con rol `user` (no admin)
- **When** intento acceder a `/admin/configuracion`
- **Then** el middleware me redirige a `/admin/login`

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | Moneda por defecto: Si no hay moneda configurada, se usa `USD` como fallback |
| RB02 | Instagram sin @: El valor guardado no debe incluir `@`. El footer lo agrega automáticamente al construir la URL |
| RB03 | Facebook sin URL completa: El valor guardado es solo el username (ej: `glamstudiope`). El footer construye la URL completa |
| RB04 | Teléfono formato libre: Se permite formato internacional (`+51 999 888 777`) y local (`999 888 777`) |
| RB05 | Horarios texto libre: El campo `opening_hours` es un campo de texto libre, no un editor estructurado |
| RB06 | Campos opcionales vacíos: Si un campo opcional se deja vacío, se guarda como string vacío `""`. El footer no muestra la sección correspondiente si el campo está vacío |

---

## Flujos

### Flujo principal: Editar configuración

```
1. Admin hace clic en "Configuración" en sidebar
2. Se carga GET /api/business-config
3. Se rellena el formulario con los valores actuales
4. Admin edita los campos que desee
5. Admin hace clic en "Guardar cambios"
6. Se ejecuta PUT /api/business-config
7. Se muestra toast de éxito
```

### Flujo alternativo: Error al guardar

```
1. Admin hace clic en "Guardar cambios"
2. PUT /api/business-config falla
3. Se muestra toast de error
4. Los valores del formulario se mantienen
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│  Configuración del Negocio          │
├─────────────────────────────────────┤
│  Sección 1: Datos del negocio       │
│  ┌─────────────────┐ ┌───────────┐  │
│  │ business_name    │ │ currency  │  │
│  └─────────────────┘ └───────────┘  │
├─────────────────────────────────────┤
│  Sección 2: Contacto                │
│  ┌───────────┐ ┌───────────┐        │
│  │ phone     │ │ whatsapp  │        │
│  └───────────┘ └───────────┘        │
│  ┌─────────────────┐ ┌───────────┐  │
│  │ email           │ │ address   │  │
│  └─────────────────┘ └───────────┘  │
├─────────────────────────────────────┤
│  Sección 3: Redes sociales          │
│  ┌───────────┐ ┌───────────┐        │
│  │ instagram │ │ facebook  │        │
│  └───────────┘ └───────────┘        │
├─────────────────────────────────────┤
│  Sección 4: Horarios                │
│  ┌─────────────────────────────┐    │
│  │ opening_hours               │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  [Guardar cambios]                  │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `app/admin/configuracion/page.tsx` | Página principal de configuración (Server Component) |
| `app/admin/configuracion/components/ConfigForm.tsx` | Formulario con las 4 secciones (Client Component) |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `lib/validations/business-config.ts` | Reemplazar `z.record` por un schema específico con campos tipados y validaciones individuales |
| `app/api/business-config/route.ts` | Adaptar para recibir el nuevo schema tipado en lugar de `Record<string, string>` |
| `prisma/seed.ts` | Agregar `currency: "USD"` a los datos iniciales |
| `components/public/sections/ServiceCard.tsx` | Leer `currency` de config para mostrar el símbolo correcto |
| `components/public/cards/ServiceCatalogCard.tsx` | Leer `currency` de config para mostrar el símbolo correcto |
| `components/public/sections/ServicesSection.tsx` | Pasar `currency` a ServiceCard |
| `components/public/sections/ServicesCatalog.tsx` | Pasar `currency` a ServiceCatalogCard |
| `app/(public)/page.tsx` | Pasar `currency` a las secciones de servicios |
| `app/(public)/servicios/page.tsx` | Pasar `currency` al catálogo |
| `components/public/layout/PublicHeader.tsx` | Leer `business_name` de config en lugar de hardcodear "GlamStudio" |

---

## Notas adicionales

- El admin no necesita hacer refresh manual para ver los cambios reflejados en la parte pública (el layout carga la config en cada request via Server Component).
- La validación de teléfono es flexible pero rechaza caracteres no numéricos excepto `+`, espacios, `()`, y `-`.
- El formulario NO es un modal sino una página completa (consistente con lo que se esperaría para configuración).
- **Tipografía**: Outfit (ya configurada en layout raíz).
- **Layout responsive** mobile-first con secciones colapsables en mobile.
