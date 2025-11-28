const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.cjs');

const AuthController = require('../authController.cjs');
const PropiedadController = require('../propiedadController.cjs');
const ReporteController = require('../controllers/reporte.controller.cjs');
const EstimadorController = require('../controllers/estimador.controller.cjs');

// Auth & Perfil
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.put('/auth/profile', verifyToken, AuthController.updateProfile);
router.put('/auth/change-password', verifyToken, AuthController.changePassword);
router.put('/auth/upgrade-plan', verifyToken, AuthController.upgradePlan);

// Propiedades
router.get('/propiedades/mis-propiedades', verifyToken, PropiedadController.getMyProperties);
router.post('/propiedades', verifyToken, PropiedadController.create);

// Estimador
router.post('/estimador/prediccion', EstimadorController.predict);

// Reportes
router.post('/reportes/generar', verifyToken, ReporteController.generarReporte);

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

module.exports = router;
