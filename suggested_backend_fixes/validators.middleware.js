/*
 * validators.middleware.js - SECCIÓN CORREGIDA
 * Reemplaza exports.validateReportGeneration con esto.
 */
const { body } = require('express-validator');

// Validación para POST /api/reportes/generar
exports.validateReportGeneration = [
    // TAREA D: Aceptar Array de IDs
    body('propiedadID')
        .custom((value) => {
            // Caso 1: Es un array (selección múltiple)
            if (Array.isArray(value)) {
                if (value.length === 0) throw new Error('Debe seleccionar al menos una propiedad.');
                // Validar que cada elemento sea un número
                const allIntegers = value.every(item => Number.isInteger(parseInt(item)));
                if (!allIntegers) throw new Error('IDs de propiedad inválidos en la lista.');
                return true;
            }
            // Caso 2: Es un solo valor (selección única)
            if (Number.isInteger(parseInt(value))) return true;

            throw new Error('Formato de propiedadID inválido (debe ser entero o lista).');
        }),

    body('mes', 'El mes es obligatorio (1-12).').isInt({ min: 1, max: 12 }),
    body('anio', 'El año es obligatorio (ej. 2025).').isInt({ min: 2020, max: 2030 }),
    body('tiposContenido', 'Debe ser un array de tipos de contenido.').isArray({ min: 1 })
];
