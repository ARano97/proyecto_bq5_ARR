const oracledb = require("oracledb");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
    try {
        // CREDENCIALES HARCODEADAS PARA PRUEBA
        const conn = await oracledb.getConnection({
            user: "PROYECTOBQ5ARANO",
            password: "system123",
            connectString: "localhost:1521/xepdb1"
        });

        // Forzar el contenedor correcto
        await conn.execute(`ALTER SESSION SET CONTAINER = XEPDB1`);
        console.log("Conexión exitosa y contenedor cambiado a XEPDB1");

        return conn;
    } catch (error) {
        console.error("Error conectando a Oracle:", error.message);
        throw error;
    }
}

module.exports = { getConnection };