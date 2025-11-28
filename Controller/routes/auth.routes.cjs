const express = require('express');
const router = express.Router();
const AuthController = require('../authController.cjs');

const verifyToken = require('../middleware/authMiddleware.cjs');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rutas protegidas
router.put('/profile', verifyToken, AuthController.updateProfile);
router.put('/change-password', verifyToken, AuthController.changePassword);
router.put('/upgrade-plan', verifyToken, AuthController.upgradePlan);

module.exports = router;
