const sql = require('mssql');
const PropiedadModel = require('./Propiedad.model');
const { poolPromise } = require('./dbConnection'); // Assumes this exists

async function testRollback() {
    console.log('--- Iniciando Prueba de Rollback ---');

    try {
        // 1. Datos Inválidos para provocar error SQL
        // CodigoPostal es varchar(10), enviamos uno más largo
        const invalidData = {
            usuarioID: 1, // Asumimos que existe usuario 1
            titulo: 'Propiedad de Prueba Rollback',
            descripcion: 'Esta propiedad no debería existir',
            tipoPropiedad: 'Departamento',
            tipoAlojamiento: 'Entero',
            distrito: 'Miraflores',
            provincia: 'Lima',
            direccion: 'Av. Test 123',
            codigoPostal: '123456789012345', // <--- ERROR: String or binary data would be truncated
            huespedes: 2,
            habitaciones: 1,
            camas: 1,
            baños: 1,
            metraje: 50,
            precio: 1000,
            comodidades: ['Wifi', 'Cocina'], // Esto requeriría inserciones adicionales
            seguridad: ['Portero']
        };

        console.log('Intentando crear propiedad con datos inválidos...');
        await PropiedadModel.create(invalidData, 1);

        console.error('❌ FALLO: La creación debería haber fallado pero tuvo éxito.');

    } catch (error) {
        console.log('✅ ÉXITO: Se capturó el error esperado:', error.message);
        console.log('Verificando integridad de la base de datos...');

        // Verificar que NO se insertó nada relacionado a "Propiedad de Prueba Rollback"
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Titulo', sql.NVarChar, 'Propiedad de Prueba Rollback')
                .query("SELECT COUNT(*) as count FROM dbo.Propiedades WHERE Titulo = @Titulo");

            if (result.recordset[0].count === 0) {
                console.log('✅ ROLLBACK CONFIRMADO: No se encontraron registros basura.');
            } else {
                console.error('❌ FALLO DE ROLLBACK: Se encontraron registros parciales en la BD.');
            }

        } catch (dbError) {
            console.error('Error al verificar la BD:', dbError);
        }
    } finally {
        // Cerrar conexión si es necesario
        // sql.close(); 
        console.log('--- Fin de la Prueba ---');
        process.exit(0);
    }
}

testRollback();
