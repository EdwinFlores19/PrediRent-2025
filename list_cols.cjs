const { poolPromise } = require('./Model/dbConnection.cjs');

async function listCols() {
    const pool = await poolPromise;
    const res = await pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios'");
    res.recordset.forEach(r => console.log(r.COLUMN_NAME));
    process.exit();
}
listCols();
