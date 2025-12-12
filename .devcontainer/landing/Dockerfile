# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY P5/landing/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY P5/landing/ ./

# Build del proyecto Astro
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción si es necesario
# Astro genera archivos estáticos, así que podríamos usar nginx,
# pero mantenemos node para flexibilidad futura
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo para preview (o usar servidor estático)
RUN npm ci --only=production

# Exponer puerto
EXPOSE 4321

# Comando para servir la aplicación
# Usamos el preview de Astro o podemos configurar un adaptador
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
