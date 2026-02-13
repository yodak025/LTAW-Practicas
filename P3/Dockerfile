# ============================================
# Dockerfile for P3 — Node.js Backend
# ============================================
FROM node:18-alpine

WORKDIR /app

# Copy dependency files first (Docker layer cache)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Internal service port
EXPOSE 9000

ENV NODE_ENV=production

# Start command
CMD ["npm", "start"]
