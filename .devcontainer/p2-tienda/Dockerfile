# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias del proyecto P2
COPY P2/package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el código fuente completo
COPY P2/ ./

# Build del bundle cliente con esbuild
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Copiar package.json para instalar solo dependencias de producción
COPY P2/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente y el bundle construido
COPY P2/ ./
COPY --from=builder /app/server/public/bundle.js ./server/public/bundle.js

# Exponer puerto
EXPOSE 8001

# Variables de entorno
ENV PORT=8001
ENV NODE_ENV=production

# Comando para iniciar el servidor
CMD ["npm", "run", "start"]
