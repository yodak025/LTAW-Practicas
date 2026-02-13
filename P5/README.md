# P5 — Dockerized Infrastructure & Landing Page

Integration project that dockerizes the LTAW monorepo and provides a landing page built with Astro.

## 🚀 Project Status

**Current Phase:** Production-ready Docker setup  
**Progress:** 100%

### ✅ Completed
- Astro project initialized with Tailwind CSS
- Responsive landing page
- Integrated wiki (21 documentation pages)
- Consistent wiki layout with navigation
- **Dockerfiles for all 3 services** (multi-stage where needed)
- **docker-compose.yml with full orchestration**
- **Nginx reverse proxy with auto-discovery** (nginx-proxy)
- **Automatic HTTPS via Let's Encrypt** (acme-companion)
- **Custom Nginx config** (gzip, WebSocket, timeouts)
- **Zero port exposure** from application containers

## 📁 Structure

```
P5/
├── landing/               # Astro project (static site)
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   ├── Dockerfile         # Multi-stage: node:18-alpine → nginx:alpine
│   ├── .dockerignore
│   └── package.json
├── nginx/                 # Reverse proxy configuration
│   └── custom.conf        # Gzip, WebSocket, timeouts, upload limits
├── AGENTS.md              # Planning and tracking
└── README.md              # This file
```

## 🏗️ Architecture

```
              INTERNET
          :80    /    :443
               │
      ┌────────▼─────────┐
      │   nginx-proxy    │  ← Auto-discovers via VIRTUAL_HOST
      │   (The Gatekeeper)│     + Let's Encrypt SSL
      └──┬──────┬──────┬──┘
         │      │      │
  ┌──────▼─┐ ┌─▼─────┐ ┌─▼───────┐
  │landing │ │api-   │ │api-auth │
  │(nginx) │ │users  │ │(node)   │
  │  :80   │ │(node) │ │  :9000  │
  └────────┘ │ :8001 │ └─────────┘
             └───────┘

  yourdomain    api-users.    auth.
  .com          yourdomain    yourdomain
                .com          .com
```

## 🎯 Services

### Production (with Reverse Proxy + HTTPS)

| Service | Image | Domain | Port | Description |
|---------|-------|--------|------|-------------|
| `nginx-proxy` | `nginxproxy/nginx-proxy:alpine` | — | 80, 443 | Reverse proxy (only exposed ports) |
| `acme-companion` | `nginxproxy/acme-companion` | — | — | Auto Let's Encrypt certs |
| `landing` | Custom (nginx:alpine) | `yourdomain.com` | 80 | Static landing page |
| `api-users` | Custom (node:18-alpine) | `api-users.yourdomain.com` | 8001 | Online store (P2) |
| `api-auth` | Custom (node:18-alpine) | `auth.yourdomain.com` | 9000 | Multiplayer game (P3) |

## 🛠️ Tech Stack

- **Landing:** Astro 5.x + Tailwind CSS 4.x
- **Backend P2:** Node.js + React + Babel + esbuild
- **Backend P3:** Express + Socket.IO
- **Proxy:** nginxproxy/nginx-proxy (Alpine)
- **SSL:** nginxproxy/acme-companion (Let's Encrypt)
- **Orchestration:** Docker Compose

## 🐳 Deployment

### Prerequisites

- Docker Engine 24+ and Docker Compose v2+
- A VPS with ports 80 and 443 open
- DNS A records pointing your domains to the VPS IP

### Quick Start

```bash
# 1. Edit docker-compose.yml in the monorepo root:
#    - Replace "yourdomain.com" with your real domain
#    - Replace "your-email@yourdomain.com" with your email

# 2. Build and deploy
docker compose up -d --build

# 3. Check that all services are healthy
docker compose ps

# 4. View logs
docker compose logs -f
```

### Nginx Custom Config

The file `P5/nginx/custom.conf` is mounted into the proxy and provides:

| Setting | Value | Purpose |
|---------|-------|---------|
| `client_max_body_size` | 20MB | Increased upload limit |
| `proxy_*_timeout` | 60s | Extended timeouts for SSR |
| WebSocket `map` | upgrade/close | Socket.io compatibility |
| `gzip` | level 6 | Static asset compression |

## 🏃 Local Development (without Docker)

### Landing only
```bash
cd P5/landing
npm install
npm run dev
# http://localhost:4321
```

### Full stack
```bash
# From the monorepo root
docker compose up -d --build

# View logs for a specific service
docker compose logs -f landing
docker compose logs -f api-users
docker compose logs -f api-auth

# Stop everything
docker compose down
```

## 📝 Documentation

See `AGENTS.md` for detailed planning and project roadmap.

---

**Course:** Laboratorio de Tecnologías Audiovisuales en la Web  
**Date:** February 2026