/*
 * Propiedad.model.js - FINAL
 * Corregido: Transacciones, Nombres de Columnas Reales y Relaciones
 */
const { sql, poolPromise } = require('./dbConnection.cjs');

class PropiedadModel {

    // Obtener propiedades del usuario
    static async getPropertiesByUserId(usuarioID) {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            request.input('UsuarioID', sql.Int, usuarioID);
            const query = `SELECT PropiedadID, Titulo, TipoPropiedad, Distrito, EstadoPropiedad, Metraje, NumHabitaciones, NumBanos, NumHuespedes, NumCamas FROM dbo.Propiedades WHERE UsuarioID = @UsuarioID ORDER BY FechaRegistro DESC`;
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error en getPropertiesByUserId:', error);
            throw error;
        }
    }

    // Contar activas
    static async getActiveCountByUserId(usuarioID) {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            request.input('UsuarioID', sql.Int, usuarioID);
            const query = `SELECT COUNT(*) AS Total FROM dbo.Propiedades WHERE UsuarioID = @UsuarioID AND EstadoPropiedad = 'Activa'`;
            const result = await request.query(query);
            return result.recordset[0].Total;
        } catch (error) {
            console.error('Error en getActiveCountByUserId:', error);
            throw error;
        }
    }

    /**
     * TAREA B: IMPLEMENTACIÓN TRANSACCIONAL (REGISTRO)
     */
    static async create(data, usuarioID) {
        let transaction;
        try {
            const pool = await poolPromise;
            transaction = new sql.Transaction(pool);
            await transaction.begin(); // Inicio de transacción

            const request = new sql.Request(transaction);

            // 1. Mapeo Frontend -> DB Schema
            request.input('UsuarioID', sql.Int, usuarioID);
            request.input('Titulo', sql.NVarChar(255), data.titulo);
            request.input('Descripcion', sql.NVarChar(sql.MAX), data.descripcion);
            request.input('TipoPropiedad', sql.NVarChar(50), data.tipoPropiedad);
            request.input('TipoAlojamiento', sql.NVarChar(50), data.tipoAlojamiento);
            request.input('Distrito', sql.NVarChar(100), data.distrito);
            request.input('Provincia', sql.NVarChar(100), data.provincia || 'Lima');
            request.input('DireccionCompleta', sql.NVarChar(512), data.direccion);
            request.input('CodigoPostal', sql.NVarChar(10), data.codigoPostal);

            // Números (Validación básica para evitar NaN)
            request.input('NumHuespedes', sql.Int, parseInt(data.huespedes) || 1);
            request.input('NumHabitaciones', sql.Int, parseInt(data.habitaciones) || 1);
            request.input('NumCamas', sql.Int, parseInt(data.camas) || 1);
            request.input('NumBanos', sql.Int, parseInt(data.baños) || 1);
            request.input('Metraje', sql.Decimal(8, 2), parseFloat(data.metraje) || null);

            // Precio Sugerido (si viene calculado)
            const precio = data.precio ? parseFloat(data.precio) : null;
            request.input('PrecioSugerido', sql.Decimal(10, 2), precio);

            // 2. Insertar en dbo.Propiedades
            // Nota: Usamos 'Activa' según el check constraint de la BD
            const resultProp = await request.query(`
                INSERT INTO dbo.Propiedades (
                    UsuarioID, Titulo, Descripcion, TipoPropiedad, TipoAlojamiento, 
                    Distrito, Provincia, DireccionCompleta, CodigoPostal, 
                    NumHuespedes, NumHabitaciones, NumCamas, NumBanos, 
                    Metraje, PrecioSugerido, EstadoPropiedad
                )
                OUTPUT INSERTED.PropiedadID
                VALUES (
                    @UsuarioID, @Titulo, @Descripcion, @TipoPropiedad, @TipoAlojamiento, 
                    @Distrito, @Provincia, @DireccionCompleta, @CodigoPostal, 
                    @NumHuespedes, @NumHabitaciones, @NumCamas, @NumBanos, 
                    @Metraje, @PrecioSugerido, 'Activa'
                )
            `);

            const propiedadID = resultProp.recordset[0].PropiedadID;

            // 3. Insertar Relaciones: Comodidades
            // Buscamos el ID de la comodidad por nombre y luego insertamos la relación
            if (data.comodidades && Array.isArray(data.comodidades) && data.comodidades.length > 0) {
                for (const nombre of data.comodidades) {
                    const reqCom = new sql.Request(transaction);
                    reqCom.input('PropID', sql.Int, propiedadID);
                    reqCom.input('Nombre', sql.NVarChar(100), nombre);

                    // Insertamos solo si encontramos la comodidad en la tabla maestra
                    await reqCom.query(`
                        INSERT INTO dbo.PropiedadComodidades (PropiedadID, ComodidadID)
                        SELECT @PropID, ComodidadID FROM dbo.Comodidades WHERE Nombre = @Nombre
                    `);
                }
            }

            // 4. Insertar Relaciones: Seguridad
            // Similar a comodidades, buscamos en SeguridadTipos
            if (data.seguridad && Array.isArray(data.seguridad) && data.seguridad.length > 0) {
                for (const nombre of data.seguridad) {
                    const reqSeg = new sql.Request(transaction);
                    reqSeg.input('PropID', sql.Int, propiedadID);
                    reqSeg.input('Nombre', sql.NVarChar(100), nombre);

                    await reqSeg.query(`
                        INSERT INTO dbo.PropiedadSeguridad (PropiedadID, SeguridadTipoID)
                        SELECT @PropID, SeguridadTipoID FROM dbo.SeguridadTipos WHERE Nombre = @Nombre
                    `);
                }
            }

            // 5. Commit de la transacción
            await transaction.commit();
            return { success: true, propiedadID, message: 'Propiedad registrada exitosamente' };

        } catch (error) {
            // Rollback en caso de cualquier error
            if (transaction) await transaction.rollback();
            console.error('Error en PropiedadModel.create:', error);
            throw new Error('Error al registrar la propiedad en la base de datos.');
        }
    }
}

module.exports = PropiedadModel;
