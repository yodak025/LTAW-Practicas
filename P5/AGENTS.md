# AGENTS.md - Infraestructura Dockerizada para Prácticas LTAW

## 📋 Descripción del Proyecto

Creación de una infraestructura dockerizada que integra los proyectos de backend desarrollados durante la asignatura LTAW (Laboratorio de Tecnologías Audiovisuales en la Web), junto con una landing page moderna construida con Astro.

### Proyectos a Integrar

1. **P2 - Tienda Online con SSR**
   - Backend: Node.js con HTTP nativo
   - Frontend: React con Server-Side Rendering
   - Puerto original: 8001
   - Stack: Express, React, Babel, esbuild
   - Características: Sistema de carrito, generación de documentos con IA

2. **P3 - Kill Two Birds with One Stone Game**
   - Backend: Express + Socket.IO
   - Frontend: Vanilla JS con canvas
   - Puerto original: 9000
   - Stack: Express, Socket.IO, WebSockets
   - Características: Juego multiplayer en tiempo real

3. **P5 - Landing Page (Nuevo)**
   - Framework: Astro
   - Propósito: Página de presentación y acceso a los proyectos
   - Puerto: 4321 (por defecto Astro)

---

## 🎯 Objetivos

- [x] Crear estructura de proyecto con Astro para la landing
- [x] Inicializar proyecto Astro con Tailwind CSS
- [x] Crear MVP de landing page
- [x] Dockerfile para landing
- [x] Dockerizar cada aplicación individualmente
- [x] Orquestar servicios con docker-compose
- [x] Implementar networking entre contenedores
- [ ] Configurar desarrollo con devcontainers
- [ ] Configurar reverse proxy (opcional)
- [ ] Documentar setup y deployment

---

## 🏗️ Arquitectura Propuesta

```
LTAW-Practicas/              # Raíz del monorepo
├── .devcontainer/           # Infraestructura Docker
│   ├── docker-compose.yml
│   ├── landing/
│   │   └── Dockerfile
│   ├── p2-tienda/
│   │   └── Dockerfile
│   └── p3-game/
│       └── Dockerfile
├── P2/                      # Tienda Online (proyecto existente)
├── P3/                      # Game (proyecto existente)
├── P5/
│   ├── landing/            # Proyecto Astro
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── AGENTS.md           # Este archivo
│   └── README.md
└── .dockerignore
```

---

## 📝 Plan de Acción

### Fase 1: Inicialización ✅
- [x] Analizar proyectos existentes (P2, P3)
- [x] Crear documento de planificación (AGENTS.md)
- [x] Inicializar proyecto Astro para landing
- [x] Instalar y configurar Tailwind CSS
- [x] Crear MVP de landing page con layout básico
- [x] Crear estructura de directorios `.devcontainer/`
- [x] Dockerfile inicial para landing

### Fase 2: Dockerización Individual ✅
- [x] **Dockerfile para P2 (Tienda)**
  - Base: `node:20-alpine`
  - Instalar dependencias de Babel/React
  - Build del bundle cliente con esbuild
  - Exponer puerto 8001
  - ✅ **Completado** en `.devcontainer/p2-tienda/Dockerfile`
  
- [x] **Dockerfile para P3 (Game)**
  - Base: `node:20-alpine`
  - Instalar dependencias Socket.IO
  - Exponer puertos 9000 (HTTP) y WebSocket
  - ✅ **Completado** en `.devcontainer/p3-game/Dockerfile`
  
- [x] **Dockerfile para Landing**
  - Base: `node:20-alpine`
  - Build estático de Astro
  - Servir con modo preview
  - Exponer puerto 4321
  - ✅ **Completado** en `.devcontainer/landing/Dockerfile`

### Fase 2.5: Integración de Documentación ✅
- [x] Clonar wiki de GitHub del repositorio
- [x] Extraer archivos Markdown y moverlos a `landing/src/pages/wiki/`
- [x] Actualizar enlaces internos para usar rutas de Astro
- [x] Eliminar repositorio wiki clonado
- [x] Agregar enlace a la wiki en la landing principal
- [x] Estilizar páginas de documentación con layout consistente
- [x] Configurar frontmatter en todos los archivos markdown

### Fase 3: Orquestación ✅
- [x] Crear `docker-compose.yml`
  - Definir servicios: landing, tienda, game
  - Configurar red interna (ltaw-network)
  - Mapear puertos al host (3000, 8001, 9000)
  - Variables de entorno
  - Healthchecks para cada servicio
  - Política de restart
- [x] Configurar redirecciones en landing
  - Enlaces a tienda (localhost:8001)
  - Enlaces a game (localhost:9000)

### Fase 4: Dev Containers (ACTUAL)
- [ ] Configurar `.devcontainer/devcontainer.json`
- [ ] Configurar VSCode settings
- [ ] Extensiones recomendadas

### Fase 5: Landing Page
- [ ] Diseñar interfaz con enlaces a P2 y P3
- [ ] Crear cards descriptivas de cada proyecto
- [ ] Añadir información técnica (stack, características)
- [ ] Responsive design

### Fase 6: Documentación y Pulido
- [ ] README.md principal
- [ ] Instrucciones de uso de Docker
- [ ] Troubleshooting común
- [ ] Scripts de utilidad (start, stop, rebuild)

---

## 🔧 Configuración de Puertos

| Servicio | Puerto Interno | Puerto Host | Descripción |
|----------|---------------|-------------|-------------|
| Landing  | 4321          | 3000        | Página principal Astro |
| Tienda   | 8001          | 8001        | E-commerce SSR |
| Game     | 9000          | 9000        | Juego multiplayer |

---

## 🚀 Comandos Planificados

```bash
# Desarrollo (desde la raíz del monorepo)
docker compose -f .devcontainer/docker-compose.yml up --build
docker compose -f .devcontainer/docker-compose.yml logs -f [servicio]
docker compose -f .devcontainer/docker-compose.yml restart [servicio]

# O usando el script desde P5
cd P5
./scripts.sh docker-up
./scripts.sh docker-logs
./scripts.sh docker-down

# Limpieza
docker compose -f .devcontainer/docker-compose.yml down
docker compose -f .devcontainer/docker-compose.yml down -v
```

---

## 📦 Stack Tecnológico

### Landing (P5)
- **Astro** 4.x - Framework web moderno
- **Node.js** 20+ - Runtime
- **TailwindCSS** - Estilos (opcional)

### Tienda (P2)
- Node.js + HTTP nativo
- Express 5.x
- React 19.x
- Babel + esbuild
- Server-Side Rendering personalizado

### Game (P3)
- Express 4.x
- Socket.IO 4.x
- Canvas API
- WebSockets

### DevOps
- Docker + Docker Compose
- Dev Containers
- Alpine Linux (imágenes base)

---

## 🎓 Notas de Aprendizaje

Este proyecto sirve como práctica de:
- Containerización de aplicaciones Node.js
- Orquestación multi-servicio
- Networking entre contenedores
- Dev Containers para desarrollo consistente
- Deployment de aplicaciones fullstack

---

## 📅 Estado Actual

**Fecha:** 12 de diciembre de 2025
**Fase:** Dev Containers
**Progreso:** 75%

**Completado:**
- ✅ Proyecto Astro inicializado con Tailwind CSS
- ✅ MVP de landing page con diseño responsive
- ✅ Wiki de GitHub integrada en Astro (21 páginas de documentación)
- ✅ Layout consistente para páginas wiki con navegación
- ✅ Dockerfiles completos para los 3 servicios
- ✅ Docker Compose configurado con red interna
- ✅ Redirecciones configuradas en landing
- ✅ Healthchecks y políticas de restart
- ✅ **Infraestructura refactorizada a nivel monorepo**
- ✅ **Contexto de build optimizado desde la raíz**

---

## 🔄 Próximos Pasos Inmediatos

1. ✅ ~~Inicializar proyecto Astro en subdirectorio `landing/`~~
2. ✅ ~~Crear estructura básica de `.devcontainer/`~~
3. ✅ ~~Integrar wiki de GitHub en páginas de Astro~~
4. ✅ ~~Crear Dockerfile de P3 (Express + Socket.IO)~~
5. ✅ ~~Crear Dockerfile de P2 con build de React~~
6. ✅ ~~Crear docker-compose.yml para orquestar servicios~~
7. Probar la infraestructura completa con `docker-compose up`
8. Configurar devcontainer.json para desarrollo en contenedores
9. Documentar proceso de deployment
