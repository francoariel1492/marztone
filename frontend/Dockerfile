# MarzTone frontend — build context = repo root
FROM node:20-slim AS build
WORKDIR /app
# VITE_* se inyecta en build (Railway pasa las variables del servicio como build args)
ARG VITE_API_URL
ARG VITE_SITE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install
COPY frontend ./frontend
RUN npm run build -w frontend

FROM node:20-slim AS runtime
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/frontend/dist ./dist
ENV PORT=8080
EXPOSE 8080
# SPA con fallback a index.html (rutas /admin/*)
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
