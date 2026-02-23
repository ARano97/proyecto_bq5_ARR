const oracledb = require("oracledb");

// Configurar para que las filas se devuelvan como objetos
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
    try {
        const conn = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });
        return conn;
    } catch (error) {
        console.error("Error conectando a Oracle:", error.message);
        throw error;
    }
}

module.exports = { getConnection };