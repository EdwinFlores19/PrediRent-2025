const express = require('express');
const router = express.Router();
const PropiedadController = require('../propiedadController.cjs');
const verifyToken = require('../middleware/authMiddleware.cjs'); // Necesitamos crear este middleware

router.post('/', verifyToken, PropiedadController.create);
router.get('/mis-propiedades', verifyToken, PropiedadController.getMyProperties);

module.exports = router;
