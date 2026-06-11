# GlamStudio — Sistema de Gestión para Peluquería

Aplicación web para la gestión integral de una peluquería: reserva de citas online, administración de servicios, staff, horarios, galería de trabajos y configuración del negocio.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Framer Motion, Lucide Icons, Sonner |
| Formularios | react-hook-form + Zod |
| Backend | Next.js API Routes (REST) |
| Base de datos | PostgreSQL 16 + Prisma 7 ORM |
| Autenticación | NextAuth.js v5 (Credentials + JWT) |
| Imágenes | Cloudinary (upload widget) |
| Monitoreo | Sentry |
| Testing | Vitest + jsdom |

## Requisitos

- Node.js 20+
- Docker (para PostgreSQL local)
- Cuenta gratuita en [Cloudinary](https://cloudinary.com) (para subir imágenes)

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd peluqueria-web

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 3. Iniciar PostgreSQL con Docker
docker compose up -d

# 4. Instalar dependencias
npm install

# 5. Ejecutar migraciones y seed
npx prisma migrate dev
npx prisma db seed

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Acceso al panel admin

| Email | Contraseña |
|-------|-----------|
| admin@peluqueria.com | admin123 |

La ruta `/admin` redirige al login automáticamente.

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí | Conexión a PostgreSQL |
| `AUTH_SECRET` | Sí | Secreto JWT (mín. 32 caracteres) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Sí | Cloud name de Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Sí | Upload preset público en Cloudinary |
| `NEXT_PUBLIC_SITE_URL` | No | URL base para SEO |
| `SENTRY_DSN` | No | DSN de Sentry para error tracking |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | ESLint |
| `npm test` | Tests en modo watch |
| `npm run test:run` | Tests (única ejecución) |
| `npm run test:coverage` | Tests con cobertura |

## Estructura del proyecto

```
app/
├── (public)/          # Páginas públicas (landing, servicios, equipo, reservar)
├── admin/             # Panel de administración (protegido)
│   ├── citas/
│   ├── servicios/
│   ├── staff/
│   ├── horarios/
│   ├── galeria/
│   └── configuracion/
└── api/               # API REST
    ├── appointments/
    ├── services/
    ├── staff/
    ├── gallery/
    └── business-config/
components/
├── public/            # Componentes públicos (layout, secciones, cards)
└── admin/             # Componentes compartidos del admin
lib/
├── validations/       # Schemas Zod
├── dto/               # Serializadores de datos
├── utils/             # Utilidades (disponibilidad, fechas)
└── api-client.ts      # Cliente HTTP para el API
prisma/
├── schema.prisma      # Modelos de base de datos
├── seed.ts            # Datos iniciales
└── migrations/
```

## API

Todas las rutas siguen el patrón REST con respuestas consistentes:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "ERROR", "message": "...", "issues": [] } }
{ "success": true, "data": [...], "meta": { "page": 1, "limit": 20, "total": 0 } }
```

Los endpoints de escritura requieren autenticación (sesión activa de admin) y tienen rate limiting.

## Licencia

Uso interno.
