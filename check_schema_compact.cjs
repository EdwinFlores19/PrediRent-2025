const { poolPromise } = require('./Model/dbConnection.cjs');

async function checkSchema() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios'");
        console.log('COLUMNAS:', result.recordset.map(r => r.COLUMN_NAME).join(', '));
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}
checkSchema();
