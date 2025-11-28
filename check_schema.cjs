const { poolPromise, sql } = require('./Model/dbConnection.cjs');

async function checkSchema() {
    try {
        const pool = await poolPromise;
        console.log('Verificando esquema de tabla Usuarios...');

        const result = await pool.request()
            .query(`
                SELECT COLUMN_NAME, DATA_TYPE 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Usuarios'
            `);

        console.log('Columnas encontradas:', result.recordset);
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        process.exit();
    }
}

checkSchema();
