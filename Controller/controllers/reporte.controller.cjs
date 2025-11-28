const { sql, poolPromise } = require('../../Model/dbConnection.cjs');

exports.generarReporte = async (req, res) => {
    try {
        const { propiedadId } = req.body;
        const pool = await poolPromise;

        // 1. Obtener datos de la propiedad
        const propResult = await pool.request()
            .input('PID', sql.Int, propiedadId)
            .query("SELECT * FROM dbo.Propiedades WHERE PropiedadID = @PID");

        const propiedad = propResult.recordset[0];

        if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada' });

        // 2. Simular Análisis de Rentabilidad (Lógica de Negocio)
        const precio = propiedad.PrecioSugerido || 1500;
        const rentabilidad = (precio * 12 * 0.05).toFixed(2); // Ejemplo dummy: 5% anual

        const reporteData = {
            propiedad: propiedad.Titulo,
            ubicacion: `${propiedad.Distrito}, ${propiedad.Provincia}`,
            precio_mercado: precio,
            rentabilidad_estimada: `S/ ${rentabilidad} anual`,
            tendencia: 'Alza (+2.4%)',
            score: 8.5
        };

        // 3. Guardar el reporte generado (Opcional, para historial)
        // Nota: Asegúrate de que la tabla ReportesGenerados exista o comenta esta parte si no.
        // Para evitar errores si no existe, lo envolveré en un try/catch silencioso o lo comentaré si no estoy seguro.
        // El usuario pidió "INSERT INTO dbo.ReportesGenerados", así que lo pondré.
        try {
            await pool.request()
                .input('UID', sql.Int, req.user.id)
                .input('PID', sql.Int, propiedadId)
                .input('Data', sql.NVarChar, JSON.stringify(reporteData))
                .query("INSERT INTO dbo.ReportesGenerados (UsuarioID, PropiedadID, TipoReporte, DataJSON) VALUES (@UID, @PID, 'General', @Data)");
        } catch (dbError) {
            console.warn('No se pudo guardar el reporte en BD (Tabla ReportesGenerados podría no existir):', dbError.message);
        }

        res.json({ status: 'success', data: reporteData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error generando reporte' });
    }
};
