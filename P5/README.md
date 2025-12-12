 # P5 - Infraestructura Dockerizada LTAW

Infraestructura dockerizada que integra los proyectos de backend desarrollados durante la asignatura LTAW, con una landing page construida en Astro.

## 🚀 Estado del Proyecto

**Fase Actual:** Dev Containers  
**Progreso:** 70%

### ✅ Completado
- Proyecto Astro inicializado con Tailwind CSS
- MVP de landing page responsive
- Estructura de directorios `.devcontainer/`
- Wiki integrada (21 páginas de documentación)
- Layout consistente para wiki con navegación
- **Dockerfiles completos para 3 servicios**
- **Docker Compose configurado**
- **Red interna ltaw-network**
- **Redirecciones en landing configuradas**

### 🔨 En Desarrollo
- Dev Containers para VSCode
- Documentación de deployment

## 📁 Estructura

```
P5/
├── .devcontainer/          # Dockerfiles de cada servicio
│   ├── landing/           # Dockerfile para Astro
│   ├── p2-tienda/         # Dockerfile para tienda (por crear)
│   └── p3-game/           # Dockerfile para game (por crear)
├── landing/               # Proyecto Astro
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
├── docker-compose.yml     # (por crear)
├── AGENTS.md             # Planificación y seguimiento
└── README.md             # Este archivo
```

## 🎯 Servicios

| Servicio | Puerto | Estado | Descripción |
|----------|--------|--------|-------------|
| Landing  | 3000   | ✅ MVP | Página principal Astro |
| Tienda   | 8001   | 🔨 Pending | E-commerce con SSR |
| Game     | 9000   | 🔨 Pending | Juego multiplayer |

## 🛠️ Tecnologías

- **Landing:** Astro 4.x + Tailwind CSS 4.x
- **Backend P2:** Node.js + React + Babel + esbuild
- **Backend P3:** Express + Socket.IO
- **DevOps:** Docker + Docker Compose

## 🏃 Desarrollo Local

### Landing (sin Docker)
```bash
cd P5/landing
npm run dev
# Abre http://localhost:4321
```

### Con Docker 🐳
```bash
# Desde la raíz del monorepo
docker compose -f .devcontainer/docker-compose.yml up --build

# Ver logs
docker compose -f .devcontainer/docker-compose.yml logs -f

# Ver logs de un servicio específico
docker compose -f .devcontainer/docker-compose.yml logs -f landing
docker compose -f .devcontainer/docker-compose.yml logs -f tienda
docker compose -f .devcontainer/docker-compose.yml logs -f game

# Detener servicios
docker compose -f .devcontainer/docker-compose.yml down

# Reconstruir servicios
docker compose -f .devcontainer/docker-compose.yml up --build
```

### Acceso a servicios
- **Landing:** http://localhost:3000
- **Tienda:** http://localhost:8001
- **Game:** http://localhost:9000

## 📝 Documentación

Ver `AGENTS.md` para planificación detallada y roadmap del proyecto.

---

**Asignatura:** Laboratorio de Tecnologías Audiovisuales en la Web  
**Fecha:** Diciembre 2025