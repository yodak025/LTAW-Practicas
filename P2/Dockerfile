# ============================================
# Stage 1: Builder — Build the client bundle
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first (Docker layer cache)
COPY package.json package-lock.json ./
COPY babel.config.json ./

# Install all dependencies (including devDependencies for esbuild)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the client bundle with esbuild
RUN npm run build

# ============================================
# Stage 2: Runner — Production
# ============================================
FROM node:18-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
COPY babel.config.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Copy the pre-built bundle from the builder stage
COPY --from=builder /app/server/public/bundle.js ./server/public/bundle.js

# Internal service port
EXPOSE 8001

ENV NODE_ENV=production

# Start command
CMD ["npm", "start"]
