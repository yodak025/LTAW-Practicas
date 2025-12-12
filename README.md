# LTAW-Practicas

Monorepo de prácticas para la asignatura Laboratorio de Tecnologías Audiovisuales en la Web (LTAW) en la URJC.

## 📁 Estructura del Proyecto

```
LTAW-Practicas/
├── .devcontainer/          # Infraestructura Docker
│   ├── docker-compose.yml
│   ├── landing/Dockerfile
│   ├── p2-tienda/Dockerfile
│   └── p3-game/Dockerfile
├── P2/                     # Tienda Online con SSR
├── P3/                     # Kill Two Birds with One Stone Game
└── P5/                     # Proyecto de integración
    ├── landing/           # Landing page con Astro
    ├── AGENTS.md          # Documentación detallada
    └── README.md
```

## 🐳 Docker - Inicio Rápido

### Levantar todos los servicios

Desde la **raíz del monorepo**:

```bash
docker compose -f .devcontainer/docker-compose.yml up --build
```

### Acceso a servicios

- **Landing:** http://localhost:3000
- **Tienda (P2):** http://localhost:8001
- **Game (P3):** http://localhost:9000

### Comandos útiles

```bash
# Ver logs
docker compose -f .devcontainer/docker-compose.yml logs -f

# Detener servicios
docker compose -f .devcontainer/docker-compose.yml down

# Reconstruir un servicio específico
docker compose -f .devcontainer/docker-compose.yml up --build landing
```

## 📚 Documentación

Para documentación detallada de cada proyecto:

- **P5 (Integración):** Ver [P5/AGENTS.md](P5/AGENTS.md)
- **Wiki completa:** Accesible desde la landing en `/wiki/Home`

## 🛠️ Desarrollo Local (sin Docker)

### P2 - Tienda
```bash
cd P2
npm install
npm run start
# http://localhost:8001
```

### P3 - Game
```bash
cd P3
npm install
npm run start
# http://localhost:9000
```

### P5 - Landing
```bash
cd P5/landing
npm install
npm run dev
# http://localhost:4321
```

## 🎯 Características

- **Infraestructura dockerizada** con Docker Compose
- **Red interna** para comunicación entre servicios
- **Healthchecks** y políticas de restart
- **Multi-stage builds** optimizados
- **Landing page moderna** con Astro y Tailwind CSS
- **Wiki integrada** con toda la documentación del proyecto

---

**Asignatura:** Laboratorio de Tecnologías Audiovisuales en la Web  
**Curso:** 2024-2025
