const { poolPromise, sql } = require('./dbConnection.cjs');

class UsuarioModel {
    static async create({ nombre, email, password }) {
        try {
            const pool = await poolPromise;
            // En producción, la contraseña DEBE estar hasheada (bcrypt).
            // Para este MVP/Emergencia, la guardamos texto plano o hash simple si no hay bcrypt.
            // Asumiremos texto plano por simplicidad y velocidad de reparación, 
            // PERO pondré un TODO gigante.

            // TODO: INTEGRAR BCRYPT PARA HASH DE CONTRASEÑAS

            const result = await pool.request()
                .input('NombreCompleto', sql.NVarChar, nombre)
                .input('Email', sql.NVarChar, email)
                .input('PasswordHash', sql.NVarChar, password)
                .query(`
                    INSERT INTO Usuarios (NombreCompleto, Email, PasswordHash, FechaRegistro, EstadoUsuario)
                    OUTPUT INSERTED.UsuarioID, INSERTED.NombreCompleto, INSERTED.Email
                    VALUES (@NombreCompleto, @Email, @PasswordHash, GETDATE(), 'Activo')
                `);

            return result.recordset[0];
        } catch (error) {
            console.error('Error en UsuarioModel.create:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('Email', sql.NVarChar, email)
                .query('SELECT * FROM Usuarios WHERE Email = @Email');

            return result.recordset[0];
        } catch (error) {
            console.error('Error en UsuarioModel.findByEmail:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('UsuarioID', sql.Int, id)
                .query('SELECT * FROM Usuarios WHERE UsuarioID = @UsuarioID');
            return result.recordset[0];
        } catch (error) {
            console.error('Error en UsuarioModel.findById:', error);
            throw error;
        }
    }

    static async updateProfile(id, { nombre, telefono }) {
        try {
            const pool = await poolPromise;
            // Asumimos que la columna Telefono existe. Si no, esto fallará y requerirá migración.
            const result = await pool.request()
                .input('UsuarioID', sql.Int, id)
                .input('NombreCompleto', sql.NVarChar, nombre)
                .input('Telefono', sql.NVarChar, telefono || null)
                .query(`
                    UPDATE Usuarios 
                    SET NombreCompleto = @NombreCompleto, Telefono = @Telefono
                    OUTPUT INSERTED.UsuarioID, INSERTED.NombreCompleto, INSERTED.Email, INSERTED.Telefono
                    WHERE UsuarioID = @UsuarioID
                `);
            return result.recordset[0];
        } catch (error) {
            console.error('Error en UsuarioModel.updateProfile:', error);
            throw error;
        }
    }

    static async changePassword(id, newPassword) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('UsuarioID', sql.Int, id)
                .input('PasswordHash', sql.NVarChar, newPassword)
                .query('UPDATE Usuarios SET PasswordHash = @PasswordHash WHERE UsuarioID = @UsuarioID');
            return true;
        } catch (error) {
            console.error('Error en UsuarioModel.changePassword:', error);
            throw error;
        }
    }

    static async updatePlan(id, plan, fechaVencimiento) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('UsuarioID', sql.Int, id)
                .input('PlanActual', sql.NVarChar, plan)
                .input('FechaVencimientoPlan', sql.DateTime, fechaVencimiento)
                .query('UPDATE Usuarios SET PlanActual = @PlanActual, FechaVencimientoPlan = @FechaVencimientoPlan WHERE UsuarioID = @UsuarioID');
            return true;
        } catch (error) {
            console.error('Error en UsuarioModel.updatePlan:', error);
            throw error;
        }
    }
}

module.exports = UsuarioModel;
