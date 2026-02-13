# Etapa 1: Build y dependencias
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias del proyecto P3
COPY P3/package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código fuente del proyecto P3
COPY P3/ ./

# Exponer puerto
EXPOSE 9000

# Variables de entorno
ENV PORT=9000
ENV NODE_ENV=production

# Comando para iniciar el servidor
CMD ["npm", "run", "start"]
