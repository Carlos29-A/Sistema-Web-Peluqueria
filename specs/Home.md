# Landing Page — GlamStudio

> **Feature:** Página de inicio pública
> **Historia de usuario:** Como cliente, quiero ver una página de inicio atractiva ("GlamStudio") con la información de la peluquería para conocer la marca.
> **Prioridad:** Alta

---

## Contexto

Actualmente la ruta `/` muestra un placeholder básico con el nombre "GlamStudio" y un enlace al panel admin. No hay información de la marca ni contenido que permita al cliente conocer el salón. La landing es la carta de presentación del negocio y debe transmitir profesionalismo, estilo y calidez.

---

## Criterios de aceptación

1. **Hero principal**: muestra el nombre "GlamStudio", una frase impactante (ej: "Tu estilo, nuestra pasión") y un botón CTA "Reserva tu cita" que enlace a `/reservar`.
2. **Servicios destacados**: cuadrícula con 4-6 servicios desde la API (`/api/services?active=true`), cada uno con nombre, descripción corta, precio y un icono.
3. **Sección "Sobre nosotros"**: párrafo breve sobre la marca, su historia y valores. Puede incluir una foto del local o del equipo.
4. **Staff**: tarjetas con foto, nombre y rol desde la API (`/api/staff?active=true`).
5. **Galería de trabajos**: grid de imágenes destacadas (`isFeatured: true` desde `/api/gallery?featured=true`). Al hacer clic se abre una vista previa en grande.
6. **Testimonios**: cuadrícula con reseñas de clientes (datos estáticos inicialmente).
7. **Footer completo**: dirección, teléfono, email, horarios, enlaces a redes sociales (Instagram, Facebook), botón de WhatsApp.
8. **WhatsApp flotante**: botón fijo en la esquina inferior derecha que abre `https://wa.me/[número]?text=Hola%20GlamStudio...`.
9. **Enlace a reserva online**: botón CTA visible en hero y sección de servicios que lleve a `/reservar`.
10. **Redes sociales**: iconos enlazados a Instagram y Facebook en hero y footer.

---

## Reglas de negocio

| # | Regla |
|---|-------|
| RB01 | La página debe cargar antes de 3 segundos en conexión 4G |
| RB02 | Las imágenes deben tener formato webp y lazy loading |
| RB03 | Los datos de servicios y staff deben consumirse desde la API existente (`/api/services?active=true`, `/api/staff?active=true`) |
| RB04 | Las imágenes destacadas de la galería deben ser las marcadas como `isFeatured: true` en el modelo Gallery |
| RB05 | Los testimonios pueden ser datos estáticos en esta fase (sin modelo en BD) |
| RB06 | El botón de WhatsApp debe abrir `https://wa.me/[número]?text=Hola%20GlamStudio...` |
| RB07 | El layout debe ser responsive (mobile-first) y accesible |

---

## Estructura visual

```
┌─────────────────────────────────────┐
│  Hero                                │
│  Imagen de fondo + título + CTA      │
│  Redes sociales                      │
├─────────────────────────────────────┤
│  Servicios destacados                │
│  Grid de 4-6 cards                   │
├─────────────────────────────────────┤
│  Sobre nosotros                      │
│  Texto + imagen                      │
├─────────────────────────────────────┤
│  Staff                               │
│  Tarjetas con foto + nombre + rol    │
├─────────────────────────────────────┤
│  Galería                             │
│  Grid de imágenes                    │
├─────────────────────────────────────┤
│  Testimonios                         │
│  Reseñas de clientes                 │
├─────────────────────────────────────┤
│  Footer                              │
│  Contacto + horarios + redes + mapa   │
├─────────────────────────────────────┤
│  [WhatsApp flotante]                 │
└─────────────────────────────────────┘
```

---

## Notas adicionales

- **Paleta de colores**: neutros elegantes (blanco, gris, negro) con acento vino/dorado (por definir).
- **Tipografía**: Outfit (ya configurada en layout raíz).
- **Datos dinámicos** desde APIs existentes con estados de carga/error/vacío.
- **Imágenes** del hero pueden ser placeholder mientras no se defina el contenido final.
- **Layout responsive** mobile-first con menú hamburguesa.
