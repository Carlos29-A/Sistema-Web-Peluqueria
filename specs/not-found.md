# Página 404 — No Encontrada

> **Feature:** Página 404 personalizada (not-found.tsx)
> **Historia de usuario:** Como usuario, quiero que si ingreso a una URL que no existe, vea una página 404 creativa, visualmente impactante y amigable con opciones para volver al inicio o explorar el sitio, para no perderme en la web.
> **Prioridad:** Alta

---

## Contexto

Actualmente el proyecto no tiene ningún archivo `not-found.tsx`. Cuando un usuario ingresa a una URL que no existe (ej: `/pagina-inexistente`, `/admin/ruta-invalida`), Next.js muestra una página 404 genérica sin estilos de la marca, sin navegación de vuelta y sin personalidad, lo que resulta en una experiencia fría y confusa.

---

## Criterios de aceptación

### CA-1: Existe `app/not-found.tsx`

- **Given** que soy un usuario navegando en la web
- **When** ingreso a una URL que no existe
- **Then** se muestra la página 404 personalizada

### CA-2: Diseño creativo y visualmente impactante

- **Given** que veo la página 404
- **Then** veo:
  - Un número "404" grande y estilizado como elemento visual dominante
  - Un icono o ilustración decorativa (ej: espejo, brújula, tijeras)
  - Un título: "¡Ups! Página no encontrada"
  - Un subtítulo: "La página que buscas no existe o fue movida."
  - Paleta amber/gris oscuro coherente con la marca
  - Degradados, blur y sombras para impacto visual

### CA-3: Opciones de navegación

- **Given** que veo la página 404
- **Then** veo:
  - Botón principal "Volver al inicio" → redirige a `/`
  - Botón secundario "Ver servicios" → redirige a `/servicios`
  - Enlace "Contáctanos" → abre WhatsApp

### CA-4: Layout mínimo

- **Given** que veo la página 404
- **Then** la página se renderiza con un layout mínimo (sin header/footer) para evitar errores en cascada

### CA-5: Coherente con el estilo del sitio

- **Given** que veo la página 404
- **Then** colores, tipografía (Outfit) y estilo general son coherentes con el resto de la web

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | La página 404 NO debe depender de datos externos (API, BD, config) para evitar errores en cascada |
| RB02 | El layout debe ser autónomo (sin importar PublicHeader, PublicFooter o componentes que hagan fetch) |
| RB03 | El botón "Volver al inicio" usa `Link` de `next/link` |
| RB04 | La página funciona tanto para rutas públicas como admin al estar en `app/not-found.tsx` |
| RB05 | Next.js reconoce `not-found.tsx` automáticamente, no necesita configuración adicional |

---

## Flujos

### Flujo principal: Usuario ingresa URL inexistente

```
1. Usuario escribe o llega a una URL que no existe (ej: /promociones)
2. Next.js ejecuta not-found.tsx del segmento más cercano
3. Se muestra la página 404 personalizada con diseño creativo
4. Usuario ve las opciones de navegación
5. Usuario hace clic en "Volver al inicio"
6. Usuario es redirigido a /
```

### Flujo alternativo: Usuario elige ver servicios

```
1. Usuario está en la página 404
2. Usuario hace clic en "Ver servicios"
3. Usuario es redirigido a /servicios
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│                                     │
│             4 0 4                    │
│         (estilizado, grande)         │
│                                     │
│          ✂️ (icono decorativo)       │
│                                     │
│      ¡Ups! Página no encontrada     │
│                                     │
│   La página que buscas no existe    │
│   o fue movida.                     │
│                                     │
│   ┌─────────────────────────┐       │
│   │   Volver al inicio      │       │
│   └─────────────────────────┘       │
│                                     │
│   [Ver servicios]  [Contáctanos]    │
│                                     │
│   (efectos: gradientes, blur,       │
│    fondos decorativos)              │
│                                     │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `app/not-found.tsx` | Página 404 global — se aplica a TODAS las rutas del sitio |

---

## Notas adicionales

- En Next.js App Router, `not-found.tsx` puede ser Server Component o Client Component. No necesita `"use client"` a menos que tenga interactividad.
- Es autónomo (sin dependencias externas), no hay riesgo de errores en cascada.
- El diseño debe sorprender gratamente al usuario, convirtiendo un error en una experiencia positiva de marca.
- El número "404" debe ser el elemento visual dominante (tipografía grande, gradiente, efecto glassmorphism).
- Se puede usar un icono de `lucide-react` como elemento decorativo (ej: `Sparkles`, `Compass`, `Scissors`).
- La página se aplica a todas las rutas (públicas y admin) al estar en `app/not-found.tsx`.
