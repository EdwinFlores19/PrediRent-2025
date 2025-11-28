const PropiedadModel = require('../Model/Propiedad.model.cjs');

class PropiedadController {
    static async create(req, res) {
        try {
            // El middleware de auth debe inyectar req.user
            const userId = req.user.id;
            const data = req.body;

            // Validaciones básicas
            if (!data.titulo || !data.precio) {
                return res.status(400).json({ message: 'Datos incompletos' });
            }

            const newPropiedad = await PropiedadModel.create({
                ...data,
                usuarioID: userId
            });

            res.status(201).json({
                message: 'Propiedad creada exitosamente',
                data: newPropiedad
            });

        } catch (error) {
            console.error('Error en createPropiedad:', error);
            res.status(500).json({ message: 'Error al crear propiedad' });
        }
    }

    static async getMyProperties(req, res) {
        try {
            const userId = req.user.id;
            const propiedades = await PropiedadModel.getPropertiesByUserId(userId);

            // BLINDAJE: Si es null o undefined, devolvemos array vacío
            const data = propiedades || [];

            res.status(200).json({
                status: 'success',
                data: data
            });
        } catch (error) {
            console.error('Error en getMyProperties:', error);
            // En producción, no enviamos el error raw, pero sí un status válido
            res.status(500).json({
                status: 'error',
                message: 'Error al consultar propiedades.',
                data: [] // Fallback seguro
            });
        }
    }
}

module.exports = PropiedadController;
