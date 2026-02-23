require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Productos: http://localhost:${PORT}/api/productos`);
    console.log(`Búsqueda: http://localhost:${PORT}/api/productos/buscar?q=portátil`);
    console.log(`Por categoría: http://localhost:${PORT}/api/productos/categoria/Portátiles`);
});