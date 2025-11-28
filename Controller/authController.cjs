const UsuarioModel = require('../Model/Usuario.model.cjs');
const { sql, poolPromise } = require('../Model/dbConnection.cjs');
const jwt = require('jsonwebtoken');

// Clave secreta para JWT (Debería estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_predirent_2025';

class AuthController {
    static async register(req, res) {
        try {
            const { nombre, email, password } = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            // Verificar si ya existe
            const existingUser = await UsuarioModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'El correo ya está registrado' });
            }

            // Crear usuario
            const newUser = await UsuarioModel.create({ nombre, email, password });

            // Generar Token
            const token = jwt.sign(
                { id: newUser.UsuarioID, email: newUser.Email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: newUser.UsuarioID,
                    nombre: newUser.NombreCompleto,
                    email: newUser.Email
                }
            });

        } catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña requeridos' });
            }

            const user = await UsuarioModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Validar contraseña (texto plano por ahora, ver Model)
            if (user.PasswordHash !== password) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar Token
            const token = jwt.sign(
                { id: user.UsuarioID, email: user.Email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.UsuarioID,
                    nombre: user.NombreCompleto,
                    email: user.Email,
                    telefono: user.Telefono,
                    plan: user.PlanActual || 'Básico'
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { nombre, telefono } = req.body;
            const pool = await poolPromise;

            await pool.request()
                .input('UID', sql.Int, req.user.id)
                .input('Nombre', sql.NVarChar, nombre)
                .input('Telefono', sql.NVarChar, telefono)
                .query("UPDATE dbo.Usuarios SET NombreCompleto = @Nombre, Telefono = @Telefono WHERE UsuarioID = @UID");

            res.json({ status: 'success', message: 'Perfil actualizado' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            const user = await UsuarioModel.findById(userId);
            if (user.PasswordHash !== currentPassword) {
                return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
            }

            await UsuarioModel.changePassword(userId, newPassword);
            res.json({ message: 'Contraseña actualizada correctamente' });

        } catch (error) {
            console.error('Error en changePassword:', error);
            res.status(500).json({ message: 'Error al cambiar contraseña' });
        }
    }

    static async upgradePlan(req, res) {
        try {
            const { nuevoPlan } = req.body; // 'Pro', 'Enterprise'
            const pool = await poolPromise;

            // Simulación: Calculamos vencimiento a 30 días
            const vencimiento = new Date();
            vencimiento.setDate(vencimiento.getDate() + 30);

            await pool.request()
                .input('UID', sql.Int, req.user.id)
                .input('Plan', sql.NVarChar, nuevoPlan)
                .input('Vence', sql.DateTime2, vencimiento)
                .query("UPDATE dbo.Usuarios SET PlanActual = @Plan, FechaVencimientoPlan = @Vence WHERE UsuarioID = @UID");

            res.json({ status: 'success', message: `¡Bienvenido al plan ${nuevoPlan}!` });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

module.exports = AuthController;
