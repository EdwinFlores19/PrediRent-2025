const express = require('express');
const router = express.Router();
const EstimadorController = require('../controllers/estimador.controller.cjs');

// Ruta para predicción
router.post('/prediccion', EstimadorController.predict);

module.exports = router;
