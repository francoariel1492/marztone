# MarzTone

### *by Manuel Robles Urquiza*

Aplicación web profesional para **MarzTone**, un taller de luthería artesanal especializado en la
fabricación, reparación, restauración, calibración y personalización de instrumentos musicales.

> **Slogan:** «Instrumentos con identidad propia» / «Instruments with a voice of their own»

Incluye una **landing page pública** bilingüe (ES/EN) con light/dark mode y un **panel de
administración privado** para gestionar todo el contenido sin editar código.

---

## 🎸 Tecnologías

| Capa         | Stack                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| **Frontend** | React · Vite · TypeScript · React Router · Tailwind CSS · Framer Motion · TanStack Query · react-i18next · React Hook Form · Zod · Axios · Lucide |
| **Backend**  | NestJS · TypeScript · PostgreSQL · Prisma · Passport + JWT · Argon2 · class-validator · Nodemailer · Swagger · Throttler · Helmet |
| **Infra**    | Docker Compose (PostgreSQL) · npm workspaces (monorepo) · ESLint · Prettier            |

---

## 📁 Estructura del monorepo

```
marztone/
├── docker-compose.yml        # PostgreSQL
├── package.json              # workspaces + scripts raíz
├── backend/                  # API NestJS + Prisma
│   ├── prisma/               # schema.prisma + seed.ts
│   └── src/                  # módulos (auth, instruments, artists, ...)
└── frontend/                 # React + Vite
    └── src/                  # sections, pages (public/admin), features, ...
```

---

## ✅ Requisitos

- **Node.js** ≥ 20
- **Docker** (para PostgreSQL) o una instancia de PostgreSQL 16
- **npm** ≥ 10

---

## 🚀 Instalación y puesta en marcha

```bash
# 1. Instalar dependencias (raíz + workspaces)
npm install

# 2. Variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Levantar PostgreSQL
npm run db:up

# 4. Migraciones + generación del cliente Prisma
npm run prisma:migrate -w backend      # crea la migración inicial
#   (o en un entorno ya migrado: npm run prisma:deploy -w backend)

# 5. Seed inicial (admin + contenido MarzTone de ejemplo)
npm run prisma:seed

# 6. Desarrollo (frontend + backend en paralelo)
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/api/docs
- **Panel admin:** http://localhost:5173/admin

---

## 🔐 Credenciales iniciales (desarrollo)

Definidas en `backend/.env` (`ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`):

```
Email:    admin@marztone.com
Password: ChangeMe123!
```

> **⚠️ Cambiá estas credenciales antes de producción.** El refresh token se guarda en una cookie
> HttpOnly; el access token vive solo en memoria (no en localStorage).

---

## 📧 Configuración SMTP (email de contacto)

En `backend/.env`:

```
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario
SMTP_PASSWORD=secreto
MAIL_FROM="MarzTone Website <no-reply@marztone.com>"
MAIL_TO=contacto@marztone.com
```

El formulario de contacto: valida (frontend + backend), guarda el mensaje en PostgreSQL, envía la
notificación por email y aplica rate limiting. Si el email falla, el mensaje **igual se conserva**.

---

## ☁️ Configuración de imágenes (Cloudinary en producción)

Por defecto se usa **almacenamiento local** (`STORAGE_PROVIDER=local`, carpeta `backend/uploads`).
Para producción, configurá Cloudinary:

```
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

La abstracción `StorageService` deja preparada la migración a **S3 / Cloudflare R2**.

---

## 🧪 Tests, lint y build

```bash
npm run test        # tests backend + frontend
npm run lint        # eslint en ambos
npm run typecheck   # verificación de TypeScript
npm run build       # build de producción (backend + frontend)
```

---

## 🌐 API principal

| Área    | Endpoints                                                                    |
| ------- | ---------------------------------------------------------------------------- |
| Salud   | `GET /api/health`                                                            |
| Público | `GET /api/public/{settings,sections,workshop,instrument-categories,instruments,artists,services,testimonials}` · `POST /api/contact` |
| Auth    | `POST /api/auth/login` · `POST /api/auth/refresh` · `POST /api/auth/logout` · `GET /api/auth/me` |
| Admin   | `GET /api/admin/dashboard` · CRUD en `settings, sections, workshop, instrument-categories, instruments, artists, services, testimonials, messages, media` |

---

## 🛡️ Recomendaciones de seguridad

- Cambiá `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` y las credenciales del admin.
- Serví todo por HTTPS en producción (cookies `Secure` + `SameSite=None`).
- No hay registro público: el admin se crea vía seed.
- Rate limiting global (Throttler) + bloqueo temporal tras intentos fallidos de login.
- Helmet, CORS restringido a `FRONTEND_URL`, validación estricta de DTOs.
- No se exponen secretos ni stack traces; errores manejados de forma centralizada.

---

## ✍️ Información que debe reemplazar el propietario

Buscá los comentarios `REEMPLAZAR` en `backend/prisma/seed.ts`. Todo esto también es editable desde
el **panel de administración**:

- Logo y favicon definitivos (placeholder tipográfico mientras tanto)
- Fotografías reales (hero, taller, instrumentos, artistas, testimonios)
- Biografía real de Manuel Robles Urquiza
- Email, teléfono, WhatsApp, dirección y horarios
- Instagram, YouTube, Spotify
- Instrumentos, artistas y testimonios reales

---

## 🎨 Identidad de marca

- **Nombre principal:** MarzTone
- **Firma:** by Manuel Robles Urquiza
- **Paleta:** maderas naturales, crema/beige, marrón oscuro, cobre y dorado tenue (nunca blanco/negro puros)

Hecho con pasión por la música. **Instrumentos hechos a mano.**
