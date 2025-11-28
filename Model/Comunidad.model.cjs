/*
 * Comunidad.model.js - FINAL
 * Corregido para coincidir con schema.sql (dbo.Usuarios, dbo.Intereses)
 */
const { sql, poolPromise } = require('./dbConnection.cjs');

class ComunidadModel {
    /**
     * Obtiene miembros de la comunidad con filtros seguros contra SQL Injection.
     */
    static async getCommunityMembers(filters = {}) {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            // Consulta base segura
            let query = `
                SELECT 
                    u.UsuarioID, 
                    u.NombreCompleto, 
                    u.Distrito, 
                    u.AvatarURL,
                    u.EsVerificado,
                    u.UltimaConexion,
                    (
                        SELECT STRING_AGG(i.Nombre, ', ') 
                        FROM dbo.UsuarioIntereses ui
                        JOIN dbo.Intereses i ON ui.InteresID = i.InteresID
                        WHERE ui.UsuarioID = u.UsuarioID
                    ) AS Intereses
                FROM dbo.Usuarios u
                WHERE 1=1
            `;

            // HARDENING DE SEGURIDAD (SQL INJECTION)
            // Uso estricto de request.input

            if (filters.search) {
                request.input('search', sql.NVarChar, `%${filters.search}%`);
                query += ` AND (u.NombreCompleto LIKE @search OR u.Distrito LIKE @search)`;
            }

            if (filters.distrito) {
                request.input('distrito', sql.NVarChar, filters.distrito);
                query += ` AND u.Distrito = @distrito`;
            }

            if (filters.interes) {
                // Filtramos por ID de interés si viene numérico, o por nombre si es texto
                if (!isNaN(filters.interes)) {
                    request.input('interesID', sql.Int, filters.interes);
                    query += ` AND EXISTS (SELECT 1 FROM dbo.UsuarioIntereses ui WHERE ui.UsuarioID = u.UsuarioID AND ui.InteresID = @interesID)`;
                } else {
                    request.input('interesNombre', sql.NVarChar, filters.interes);
                    query += ` AND EXISTS (SELECT 1 FROM dbo.UsuarioIntereses ui JOIN dbo.Intereses i ON ui.InteresID = i.InteresID WHERE ui.UsuarioID = u.UsuarioID AND i.Nombre = @interesNombre)`;
                }
            }

            // Filtros rápidos
            if (filters.quick === 'verificados') {
                query += ` AND u.EsVerificado = 1`;
            }
            if (filters.quick === 'activos') {
                query += ` AND u.UltimaConexion >= DATEADD(minute, -30, GETDATE())`;
            }

            query += ` ORDER BY u.NombreCompleto ASC`;

            const result = await request.query(query);
            return result.recordset;

        } catch (error) {
            console.error('Error en getCommunityMembers:', error);
            throw error;
        }
    }

    // Método para enviar mensajes (sin cambios, ya estaba correcto)
    static async sendMessage(remitenteID, destinatarioID, contenido) {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            request.input('RemitenteID', sql.Int, remitenteID);
            request.input('DestinatarioID', sql.Int, destinatarioID);
            request.input('Contenido', sql.NVarChar, contenido);
            const result = await request.query(
                `INSERT INTO dbo.MensajesPrivados (RemitenteID, DestinatarioID, Contenido)
                 OUTPUT INSERTED.MensajeID, INSERTED.FechaEnvio
                 VALUES (@RemitenteID, @DestinatarioID, @Contenido)`
            );
            return result.recordset[0];
        } catch (error) {
            console.error('Error en sendMessage:', error);
            throw error;
        }
    }
}

module.exports = ComunidadModel;
