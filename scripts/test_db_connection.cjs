const { sql, poolPromise } = require('../Model/dbConnection.cjs');

async function testConnectionAndFlow() {
    console.log('🔄 Iniciando prueba de conexión y flujo de datos...');

    try {
        // 1. Esperar conexión
        const pool = await poolPromise;
        if (!pool) {
            throw new Error('No se pudo obtener el pool de conexión.');
        }
        console.log('✅ Conexión establecida con SQL Server.');

        // 2. Simular consulta de usuario nuevo (ID que no existe o sin propiedades)
        // Usamos un ID negativo para asegurar que no tenga propiedades
        const ID_Usuario_Nuevo = -1;
        console.log(`🔍 Ejecutando consulta para UsuarioID simulado: ${ID_Usuario_Nuevo}`);

        const result = await pool.request()
            .input('UsuarioID', sql.Int, ID_Usuario_Nuevo)
            .query('SELECT * FROM dbo.Propiedades WHERE UsuarioID = @UsuarioID');

        // 3. Validar resultados
        console.log('📊 Resultados obtenidos de la BD:');

        if (result.recordset) {
            if (result.recordset.length === 0) {
                console.log('✅ CORRECTO: La consulta devolvió un array vacío [] para un usuario nuevo.');
            } else {
                console.log('⚠️  AVISO: La consulta devolvió datos (inesperado para ID -1, pero válido si el ID existe).');
                console.log('Registros encontrados:', result.recordset.length);
            }
        } else {
            console.error('❌ ERROR: La consulta no devolvió un recordset válido (null o undefined).');
        }

    } catch (error) {
        console.error('❌ ERROR CRÍTICO en la prueba de flujo:', error);
    } finally {
        // Cerrar conexión si es necesario (aunque en un pool global no suele cerrarse, para el script sí)
        // sql.close(); 
        // Dejamos el proceso abierto un momento para ver logs y luego salir
        setTimeout(() => {
            console.log('🏁 Prueba finalizada.');
            process.exit(0);
        }, 1000);
    }
}

testConnectionAndFlow();
