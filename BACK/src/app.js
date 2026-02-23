const express = require("express");
const cors = require("cors");
const productosRoutes = require("./routes/productos.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir imágenes estáticas
app.use("/img", express.static("public/img"));

// Ruta de salud (health check)
app.get("/api/health", (req, res) => {
    res.json({ 
        ok: true, 
        mensaje: "API funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use("/api/productos", productosRoutes);

// Middleware para rutas no encontradas (404) - CORREGIDO
app.use((req, res) => {
    res.status(404).json({ 
        error: "Ruta no encontrada",
        ruta: req.originalUrl 
    });
});

module.exports = app;