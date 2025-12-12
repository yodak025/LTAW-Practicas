 # P5 - Infraestructura Dockerizada LTAW

Infraestructura dockerizada que integra los proyectos de backend desarrollados durante la asignatura LTAW, con una landing page construida en Astro.

## 🚀 Estado del Proyecto

**Fase Actual:** Dev Containers  
**Progreso:** 80%

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
- **Nginx reverse proxy implementado**
- **Volumen de persistencia para tienda.json**

### 🔨 En Desarrollo
- Dev Containers para VSCode
- Documentación de deployment

## 📁 Estructura

```
P5/
├── .devcontainer/          # Dockerfiles de cada servicio
│   ├── landing/           # Dockerfile para Astro
│   ├── p2-tienda/         # Dockerfile para tienda
│   ├── p3-game/           # Dockerfile para game
│   ├── docker-compose.yml # Compose sin reverse proxy
│   ├── nginx-docker-compose.yml  # Compose con nginx
│   └── nginx.conf         # Configuración de nginx
├── landing/               # Proyecto Astro
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
├── AGENTS.md             # Planificación y seguimiento
└── README.md             # Este archivo
```

## 🎯 Servicios

### Modo Desarrollo
| Servicio | Puerto | Estado | Descripción |
|----------|--------|--------|-------------|
| Landing  | 3000   | ✅ Listo | Página principal Astro |
| Tienda   | 8001   | ✅ Listo | E-commerce con SSR |
| Game     | 9000   | ✅ Listo | Juego multiplayer |

### Modo Producción (con Nginx)
| Servicio | Acceso | Estado | Descripción |
|----------|--------|--------|-------------|
| Nginx    | :80    | ✅ Listo | Reverse proxy |
| Landing  | Subdominio | ✅ Listo | Via nginx |
| Tienda   | Subdominio | ✅ Listo | Via nginx |
| Game     | Subdominio | ✅ Listo | Via nginx |

## 🛠️ Tecnologías

- **Landing:** Astro 4.x + Tailwind CSS 4.x
- **Backend P2:** Node.js + React + Babel + esbuild
- **Backend P3:** Express + Socket.IO
- **DevOps:** Docker + Docker Compose + Nginx

## 💾 Persistencia de Datos

Ambos archivos compose montan el archivo `P2/server/tienda.json` como volumen:
```yaml
volumes:
  - ../P2/server/tienda.json:/app/P2/server/tienda.json
```

Esto permite que los cambios en la base de datos JSON persistan entre reinicios del contenedor.

## 🏃 Desarrollo Local

### Landing (sin Docker)
```bash
cd P5/landing
npm run dev
# Abre http://localhost:4321
```

### Con Docker 🐳

#### Opción 1: Sin Reverse Proxy (desarrollo local)
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

**Acceso a servicios:**
- **Landing:** http://localhost:3000
- **Tienda:** http://localhost:8001
- **Game:** http://localhost:9000

#### Opción 2: Con Nginx Reverse Proxy (producción)

⚠️ **IMPORTANTE:** Antes de ejecutar, edita `.devcontainer/nginx.conf` y reemplaza los placeholders de dominios:
- `landing.example.com` → Tu dominio para landing
- `tienda.example.com` → Tu dominio para tienda
- `game.example.com` → Tu dominio para game

```bash
# Editar configuración de nginx
nano .devcontainer/nginx.conf

# Levantar servicios con nginx
docker compose -f .devcontainer/nginx-docker-compose.yml up --build

# Ver logs
docker compose -f .devcontainer/nginx-docker-compose.yml logs -f

# Detener servicios
docker compose -f .devcontainer/nginx-docker-compose.yml down
```

**Acceso a servicios:**
- Todos los servicios estarán disponibles en el puerto 80
- Se accede mediante los subdominios configurados en `nginx.conf`
- Los puertos internos no están expuestos al host

## 📝 Documentación

Ver `AGENTS.md` para planificación detallada y roadmap del proyecto.

---

**Asignatura:** Laboratorio de Tecnologías Audiovisuales en la Web  
**Fecha:** Diciembre 2025