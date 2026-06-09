# Página de Error General — GlamStudio

> **Feature:** Página de error inesperado (error.tsx)
> **Historia de usuario:** Como usuario, quiero que si ocurre un error inesperado al navegar en la web, vea una pantalla amigable con la opción de volver al inicio o contactar al negocio, para no quedarme en una pantalla blanca o con un mensaje técnico confuso.
> **Prioridad:** Alta

---

## Contexto

Actualmente el proyecto no tiene ningún archivo `error.tsx` en ningún segmento de rutas. Cuando ocurre un error inesperado en un Server Component o durante la renderización, Next.js muestra una pantalla de error genérica con texto técnico que no es amigable para el usuario final.

Además, `auth/auth.ts` tiene configurado `pages: { error: "/error" }`, pero esa ruta no existe, por lo que los errores de autenticación también quedan sin manejo adecuado.

---

## Criterios de aceptación

### CA-1: Existe `app/error.tsx`

- **Given** que soy un usuario navegando en cualquier página de la web
- **When** ocurre un error inesperado durante la renderización
- **Then** se muestra la página de error personalizada

### CA-2: Diseño amigable y coherente con la marca

- **Given** que veo la página de error
- **Then** veo:
  - Un icono o ilustración (`TriangleAlert` de lucide-react)
  - Un título: "Algo salió mal"
  - Un subtítulo: "Ocurrió un error inesperado. Por favor, intenta de nuevo."
  - Botón "Volver al inicio" que redirige a `/`
  - Paleta de colores con tonos cálidos (amber/gris) coherentes con el sitio
  - Tipografía Outfit (como el resto del sitio)

### CA-3: Botón de WhatsApp

- **Given** que veo la página de error
- **Then** veo un enlace "Contáctanos por WhatsApp" que abre `https://wa.me/[número]`

### CA-4: Layout mínimo

- **Given** que veo la página de error
- **Then** la página se renderiza con un layout mínimo (sin header, footer, sidebar) para evitar errores en cascada

### CA-5: Registro del error

- **Given** que ocurre un error
- **When** se renderiza la página de error
- **Then** el error se registra en `console.error` para debugging

### CA-6: Ruta `/error` para NextAuth

- **Given** que la autenticación redirige a `/error`
- **When** llego a esa ruta
- **Then** veo la misma página de error amigable

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | La página de error NO debe depender de datos externos (API, BD, config) para evitar errores en cascada |
| RB02 | El layout debe ser autónomo (sin importar PublicHeader, PublicFooter o componentes que hagan fetch) |
| RB03 | El botón de WhatsApp se muestra con un número por defecto o se omite si no hay config disponible |
| RB04 | El error debe registrarse en consola para debugging |

---

## Flujos

### Flujo principal: Error inesperado durante navegación

```
1. Usuario navega a una página
2. Ocurre un error en el Server Component o durante renderización
3. Next.js detecta error.tsx en el segmento de ruta
4. Se muestra la página de error personalizada
5. El error se registra en console.error
6. Usuario hace clic en "Volver al inicio"
7. Usuario es redirigido a /
```

### Flujo alternativo: Error de autenticación

```
1. Usuario intenta iniciar sesión con credenciales inválidas
2. NextAuth redirige a /error
3. Se muestra la página de error personalizada
4. Usuario hace clic en "Volver al inicio"
5. Usuario es redirigido a /
```

---

## Estructura visual

```
┌─────────────────────────────────────┐
│                                     │
│           ⚠️                         │
│                                     │
│      Algo salió mal                 │
│                                     │
│   Ocurrió un error inesperado.      │
│   Por favor, intenta de nuevo.      │
│                                     │
│   ┌─────────────────────────┐       │
│   │   Volver al inicio      │       │
│   └─────────────────────────┘       │
│                                     │
│   ¿Necesitas ayuda?                 │
│   Contáctanos por WhatsApp  →       │
│                                     │
└─────────────────────────────────────┘
```

---

## Archivos a crear

| Archivo | Propósito |
|---------|-----------|
| `app/error.tsx` | Página de error global (Client Component) |
| `app/error/page.tsx` | Ruta `/error` para redirección de NextAuth |

---

## Notas adicionales

- `error.tsx` DEBE ser un Client Component (tiene `"use client"` al inicio)
- Recibe props: `error: Error & { digest?: string }` y `reset: () => void`
- El botón "Volver al inicio" usa `useRouter().push("/")` de `next/navigation`
- Para el ícono se usa `TriangleAlert` de `lucide-react` (ya instalado)
- El layout es mínimo y no depende de datos externos para evitar errores en cascada
