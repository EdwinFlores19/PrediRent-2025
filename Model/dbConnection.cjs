const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

if (process.env.DB_USER && process.env.DB_PASSWORD) {
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
} else {
    config.options.trustedConnection = true;
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('❌ Error de Conexión a Base de Datos:', err.message);
        console.log('⚠️  Sugerencia: Asegúrate de que SQL Server Browser esté corriendo o usa TCP/IP habilitado en 127.0.0.1');
    });

module.exports = {
    sql, poolPromise
};
