const express = require("express");
const router = express.Router();
const { getConnection } = require("../db");

// ENDPOINT 1: GET /api/productos (todos)
router.get("/", async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT
                ID AS "id",
                NOMBRE AS "nombre",
                CATEGORIA AS "categoria",
                DESCRIPCION AS "descripcion",
                PRECIO AS "precio",
                STOCK AS "stock",
                IMAGEN AS "imagen"
            FROM PRODUCTOS
            ORDER BY CATEGORIA, NOMBRE`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error en GET /:", err);
        res.status(500).json({ 
            error: "Error al obtener productos", 
            detalle: err.message 
        });
    } finally {
        if (conn) await conn.close();
    }
});

// ENDPOINT 2: GET /api/productos/buscar?q=termino
router.get("/buscar", async (req, res) => {
    let conn;
    try {
        const termino = req.query.q;
        if (!termino) {
            return res.status(400).json({ 
                error: "Debe proporcionar un término de búsqueda" 
            });
        }
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT
                ID AS "id",
                NOMBRE AS "nombre",
                CATEGORIA AS "categoria",
                DESCRIPCION AS "descripcion",
                PRECIO AS "precio",
                STOCK AS "stock",
                IMAGEN AS "imagen"
            FROM PRODUCTOS
            WHERE UPPER(NOMBRE) LIKE UPPER(:termino)
            ORDER BY NOMBRE`,
            { termino: `%${termino}%` }
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error en GET /buscar:", err);
        res.status(500).json({ 
            error: "Error en la búsqueda", 
            detalle: err.message 
        });
    } finally {
        if (conn) await conn.close();
    }
});

// ENDPOINT 3: GET /api/productos/categoria/:categoria

router.get("/categoria/:categoria", async (req, res) => {
    let conn;
    try {
        const categoria = req.params.categoria;
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT
                ID AS "id",
                NOMBRE AS "nombre",
                CATEGORIA AS "categoria",
                DESCRIPCION AS "descripcion",
                PRECIO AS "precio",
                STOCK AS "stock",
                IMAGEN AS "imagen"
            FROM PRODUCTOS
            WHERE CATEGORIA = :categoria
            ORDER BY NOMBRE`,
            { categoria }
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error en GET /categoria/:categoria:", err);
        res.status(500).json({ 
            error: "Error al filtrar por categoría", 
            detalle: err.message 
        });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;