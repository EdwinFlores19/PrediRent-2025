const { poolPromise, sql } = require('./dbConnection.cjs');

class ReporteModel {
    static async generar(usuarioID, propiedadID) {
        try {
            const pool = await poolPromise;

            // Obtener datos de la propiedad
            const propResult = await pool.request()
                .input('PropiedadID', sql.Int, propiedadID)
                .input('UsuarioID', sql.Int, usuarioID)
                .query(`
                    SELECT * FROM Propiedades 
                    WHERE PropiedadID = @PropiedadID AND UsuarioID = @UsuarioID
                `);

            const propiedad = propResult.recordset[0];
            if (!propiedad) throw new Error('Propiedad no encontrada');

            // Simular cálculo de estadísticas (en un caso real, consultaríamos tablas de historial, mercado, etc.)
            // Aquí generamos un JSON con datos "reales" basados en la propiedad
            const precio = propiedad.PrecioSugerido || 0;
            const rentabilidad = (precio * 12) * 0.95; // Simulación simple

            const reporteData = {
                propiedad: {
                    titulo: propiedad.Titulo,
                    ubicacion: `${propiedad.Distrito}, ${propiedad.Provincia}`,
                    precio: precio
                },
                estadisticas: {
                    rentabilidadAnual: rentabilidad,
                    roi: '5.2%',
                    ocupacionEstimada: '85%',
                    demandaZona: 'Alta'
                },
                fechaGeneracion: new Date()
            };

            // Opcional: Guardar el reporte en una tabla Reportes si existiera
            // await pool.request()... INSERT INTO Reportes ...

            return reporteData;

        } catch (error) {
            console.error('Error en ReporteModel.generar:', error);
            throw error;
        }
    }
}

module.exports = ReporteModel;
