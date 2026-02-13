# LTAW-Practicas

Monorepo for the Web Audiovisual Technologies Lab (LTAW) coursework at URJC.

## 📁 Project Structure

```
LTAW-Practicas/
├── docker-compose.yml         # Production orchestrator (proxy + SSL + apps)
├── P2/                        # Online Store with SSR (Node.js + Babel + React)
│   └── Dockerfile
├── P3/                        # Kill Two Birds with One Stone Game (Express + Socket.io)
│   └── Dockerfile
└── P5/                        # Integration project
    ├── landing/               # Landing page (Astro + Tailwind CSS)
    │   └── Dockerfile         # Multi-stage: Node → Nginx
    ├── nginx/                 # Reverse proxy custom configuration
    │   └── custom.conf
    ├── AGENTS.md              # Detailed documentation
    └── README.md
```

## 🐳 Docker — Production Deployment

### Architecture

```
          INTERNET (:80 / :443)
                │
        ┌───────▼────────┐
        │  nginx-proxy   │  Auto-discovers containers via VIRTUAL_HOST
        └──┬─────┬─────┬─┘
           │     │     │
    ┌──────▼┐ ┌──▼────┐ ┌▼───────┐
    │landing│ │api-   │ │api-auth│
    │(nginx)│ │users  │ │(node)  │
    │ :80   │ │(node) │ │ :9000  │
    └───────┘ │ :8001 │ └────────┘
              └───────┘
        ┌────────────────┐
        │acme-companion  │  Auto-generates Let's Encrypt SSL certs
        └────────────────┘
```

### Quick Start

```bash
# 1. Edit docker-compose.yml — replace "yourdomain.com" with your actual domain
#    and "your-email@yourdomain.com" with your email for Let's Encrypt

# 2. Build and start all services
docker compose up -d --build

# 3. View logs
docker compose logs -f

# 4. Stop all services
docker compose down
```

### Services

| Service | Domain | Internal Port | Description |
|---------|--------|---------------|-------------|
| `landing` | `yourdomain.com` | 80 | Astro static site served by Nginx |
| `api-users` | `api-users.yourdomain.com` | 8001 | Online store backend (P2) |
| `api-auth` | `auth.yourdomain.com` | 9000 | Multiplayer game backend (P3) |

### Useful Commands

```bash
# Rebuild a specific service
docker compose up -d --build landing

# View logs for a specific service
docker compose logs -f api-users

# Restart a single service
docker compose restart api-auth

# Remove everything (containers + volumes)
docker compose down -v
```

## 🛠️ Local Development (without Docker)

### P2 — Online Store
```bash
cd P2
npm install
npm run dev+build
# http://localhost:8001
```

### P3 — Multiplayer Game
```bash
cd P3
npm install
npm run start
# http://localhost:9000
```

### P5 — Landing Page
```bash
cd P5/landing
npm install
npm run dev
# http://localhost:4321
```

## 🎯 Features

- **Fully dockerized infrastructure** with Docker Compose
- **Automatic HTTPS** via Let's Encrypt (acme-companion)
- **Nginx reverse proxy** with auto-discovery (nginx-proxy)
- **Zero port exposure** — only the proxy exposes 80/443
- **Internal network** for inter-service communication
- **Multi-stage builds** for optimized images
- **Modern landing page** with Astro and Tailwind CSS
- **Integrated wiki** with full project documentation

## 📚 Documentation

- **P5 (Integration & DevOps):** See [P5/README.md](P5/README.md) and [P5/AGENTS.md](P5/AGENTS.md)

---

**Course:** Laboratorio de Tecnologías Audiovisuales en la Web  
**Academic Year:** 2024-2025
