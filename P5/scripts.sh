#!/bin/bash
# Script de utilidades para el proyecto P5

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    cat << EOF
Utilidades P5 - Infraestructura Dockerizada LTAW

Uso: ./scripts.sh [comando]

Comandos disponibles:
    dev-landing       Iniciar landing en modo desarrollo
    docker-up         Levantar todos los servicios con Docker
    docker-down       Detener todos los servicios Docker
    docker-logs       Ver logs de todos los servicios
    docker-rebuild    Reconstruir y levantar servicios
    build-landing     Build del proyecto Astro
    clean             Limpiar node_modules y builds
    help              Mostrar esta ayuda

Ejemplos:
    ./scripts.sh docker-up
    ./scripts.sh docker-logs
    ./scripts.sh clean
EOF
}

dev_landing() {
    echo "🚀 Iniciando landing en modo desarrollo..."
    cd "$SCRIPT_DIR/landing"
    npm run dev -- --host 0.0.0.0
}

build_landing() {
    echo "📦 Construyendo landing..."
    cd "$SCRIPT_DIR/landing"
    npm run build
}

clean() {
    echo "🧹 Limpiando archivos temporales..."
    read -p "¿Estás seguro? Esto eliminará node_modules y dist (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$SCRIPT_DIR/landing/node_modules"
        rm -rf "$SCRIPT_DIR/landing/dist"
        echo "✅ Limpieza completada"
    else
        echo "❌ Limpieza cancelada"
    fi
}

docker_up() {
    echo "🐳 Levantando servicios con Docker Compose..."
    cd "$SCRIPT_DIR/.."
    docker compose -f .devcontainer/docker-compose.yml up -d
    echo "✅ Servicios iniciados"
    echo "   Landing: http://localhost:3000"
    echo "   Tienda:  http://localhost:8001"
    echo "   Game:    http://localhost:9000"
}

docker_down() {
    echo "🛑 Deteniendo servicios Docker..."
    cd "$SCRIPT_DIR/.."
    docker compose -f .devcontainer/docker-compose.yml down
    echo "✅ Servicios detenidos"
}

docker_logs() {
    echo "📋 Mostrando logs de servicios..."
    cd "$SCRIPT_DIR/.."
    docker compose -f .devcontainer/docker-compose.yml logs -f
}

docker_rebuild() {
    echo "🔨 Reconstruyendo y levantando servicios..."
    cd "$SCRIPT_DIR/.."
    docker compose -f .devcontainer/docker-compose.yml up --build
    echo "✅ Servicios reconstruidos e iniciados"
}

# Main
case "$1" in
    dev-landing)
        dev_landing
        ;;
    build-landing)
        build_landing
        ;;
    docker-up)
        docker_up
        ;;
    docker-down)
        docker_down
        ;;
    docker-logs)
        docker_logs
        ;;
    docker-rebuild)
        docker_rebuild
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Comando no reconocido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
