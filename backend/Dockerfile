# MarzTone backend — build context = repo root (por el monorepo con workspaces)
FROM node:20-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install
COPY backend ./backend
RUN npm run prisma:generate -w backend && npm run build -w backend

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/package.json ./package.json
WORKDIR /app/backend
EXPOSE 3000
# Aplica migraciones y arranca la API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
