import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9000;

// Configurar el middleware para servir archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Ruta por defecto - sirve index.html
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, 'public', '404.html'));
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
