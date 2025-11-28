const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporte.controller.cjs');
const verifyToken = require('../middleware/authMiddleware.cjs');

router.post('/generar', verifyToken, ReporteController.generar);

module.exports = router;
