# 🚀 Despliegue de MarzTone (GitHub + Railway)

Guía paso a paso. El repo ya está listo: monorepo con **Dockerfiles validados** para backend y frontend.

---

## 1) Subir a GitHub

### Opción A — con GitHub CLI (`gh`)
```bash
brew install gh
gh auth login                       # elegí GitHub.com → HTTPS → login por navegador
cd /Users/franco/Desktop/marztone
gh repo create marztone --private --source=. --remote=origin --push
```

### Opción B — repo creado a mano
1. Creá un repo vacío en https://github.com/new (ej: `marztone`, **sin** README).
2. Conectá y subí:
```bash
cd /Users/franco/Desktop/marztone
git remote add origin https://github.com/TU_USUARIO/marztone.git
git branch -M main
git push -u origin main
```

> Los archivos `.env` **no** se suben (están en `.gitignore`). Solo van los `.env.example`.

---

## 2) Desplegar en Railway

Vas a crear **3 servicios** dentro de un mismo proyecto: **PostgreSQL**, **Backend** y **Frontend**.

### 2.1 Crear proyecto + base de datos
1. Entrá a https://railway.app → **New Project** → **Deploy from GitHub repo** → elegí `marztone`.
2. En el proyecto: **+ New** → **Database** → **Add PostgreSQL**.
   - Railway crea la variable `DATABASE_URL` en el servicio de Postgres.

### 2.2 Servicio Backend
1. **+ New** → **GitHub Repo** → `marztone` (o usá el servicio que se creó al importar).
2. **Settings** del servicio:
   - **Build → Builder:** `Dockerfile`
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Root Directory:** `/` (raíz)
   - **Healthcheck Path:** `/api/health`
3. **Variables** (Settings → Variables):
   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}      # referenciá el servicio Postgres
   JWT_ACCESS_SECRET=<poné un string largo y aleatorio>
   JWT_REFRESH_SECRET=<otro string largo y aleatorio>
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   ADMIN_EMAIL=admin@marztone.com
   ADMIN_INITIAL_PASSWORD=<contraseña fuerte>
   FRONTEND_URL=https://<tu-frontend>.up.railway.app   # la completás tras crear el frontend
   # Email (Gmail: usar App Password, no la contraseña normal)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=Manuroblesurquiza@gmail.com
   SMTP_PASSWORD=<app password de Gmail>
   MAIL_FROM=MarzTone Website <Manuroblesurquiza@gmail.com>
   MAIL_TO=Manuroblesurquiza@gmail.com
   # Storage (recomendado en producción: Cloudinary; ver nota abajo)
   STORAGE_PROVIDER=cloudinary
   CLOUDINARY_CLOUD_NAME=<...>
   CLOUDINARY_API_KEY=<...>
   CLOUDINARY_API_SECRET=<...>
   MAX_FILE_SIZE_MB=5
   ```
4. Deploy. Al arrancar corre `prisma migrate deploy` automáticamente.
5. **Settings → Networking → Generate Domain** para obtener la URL pública del backend.

> **Seed en producción:** las migraciones se aplican solas, pero el seed (admin + contenido) no.
> Una vez desplegado, corré una sola vez desde tu compu apuntando a la DB de Railway:
> ```bash
> DATABASE_URL="<DATABASE_URL pública de Railway>" \
> ADMIN_EMAIL="admin@marztone.com" ADMIN_INITIAL_PASSWORD="<tu pass>" \
> npm run prisma:seed -w backend
> ```

### 2.3 Servicio Frontend
1. **+ New** → **GitHub Repo** → `marztone`.
2. **Settings**:
   - **Builder:** `Dockerfile`
   - **Dockerfile Path:** `frontend/Dockerfile`
   - **Root Directory:** `/`
3. **Variables** (se inyectan en el build de Vite):
   ```
   VITE_API_URL=https://<tu-backend>.up.railway.app/api
   VITE_SITE_URL=https://<tu-frontend>.up.railway.app
   ```
4. **Generate Domain** para la URL pública.
5. Volvé al **backend** y poné en `FRONTEND_URL` la URL del frontend (para el CORS). Redeploy del backend.

### 2.4 Orden recomendado
1. Postgres → 2. Backend (deploy, generar dominio) → 3. Frontend (con `VITE_API_URL` del backend) → 4. Actualizar `FRONTEND_URL` en el backend → 5. Correr el seed.

---

## 3) Notas importantes

- **Imágenes subidas:** en Railway el disco es efímero (se borra en cada deploy). Para que las fotos
  que subís desde el panel persistan, usá **Cloudinary** (`STORAGE_PROVIDER=cloudinary`). Ya está
  integrado en el código; solo cargá las 3 variables de Cloudinary. Con `local` funcionan pero se
  pierden al redeployar.
- **Gmail SMTP:** activá verificación en 2 pasos y creá una **App Password** en tu cuenta Google;
  usá esa clave en `SMTP_PASSWORD` (no tu contraseña habitual).
- **Seguridad:** cambiá `ADMIN_INITIAL_PASSWORD` y usá secretos JWT largos y aleatorios.
- **Credenciales admin por defecto (dev):** `admin@marztone.com` / `ChangeMe123!`.

---

## 4) Verificación post-deploy
- `https://<backend>.up.railway.app/api/health` → `{"status":"ok"}`
- `https://<backend>.up.railway.app/api/docs` → Swagger
- `https://<frontend>.up.railway.app` → la web
- `https://<frontend>.up.railway.app/admin` → panel
