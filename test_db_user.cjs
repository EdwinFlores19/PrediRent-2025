const { poolPromise, sql } = require('./Model/dbConnection.cjs');

async function testUserCreation() {
    try {
        const pool = await poolPromise;
        console.log('Intentando crear usuario de prueba...');

        const nombre = 'Test User ' + Date.now();
        const email = 'test' + Date.now() + '@example.com';
        const password = 'password123';

        const result = await pool.request()
            .input('Nombre', sql.NVarChar, nombre)
            .input('Email', sql.NVarChar, email)
            .input('Password', sql.NVarChar, password)
            .query(`
                INSERT INTO Usuarios (Nombre, Email, Password, FechaRegistro)
                OUTPUT INSERTED.UsuarioID, INSERTED.Nombre, INSERTED.Email
                VALUES (@Nombre, @Email, @Password, GETDATE())
            `);

        console.log('Usuario creado exitosamente:', result.recordset[0]);
    } catch (error) {
        console.error('ERROR DETALLADO:', error);
    } finally {
        process.exit();
    }
}

testUserCreation();
