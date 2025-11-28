/* server.cjs - Servidor Principal PrediRent */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// Asegúrate de que dbConnection exista en Model/
const { poolPromise } = require('./Model/dbConnection.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Servir Archivos Estáticos (Tu Frontend)
app.use(express.static(path.join(__dirname, 'View')));

// 2. Rutas API (Tu Backend)
// Asegúrate de tener Controller/routes/index.js o ajusta esto
try {
    const mainRouter = require('./Controller/routes/index.cjs');
    const estimadorRoutes = require('./Controller/routes/estimador.routes.cjs');

    app.use('/api', mainRouter);
    app.use('/api/estimador', estimadorRoutes);
} catch (error) {
    console.warn("⚠️ Advertencia: Algunas rutas no se cargaron. Verifica la carpeta Controller.", error.message);
}

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor PrediRent corriendo en http://localhost:${PORT}`);
    console.log(`📄 Abre el Login aquí: http://localhost:${PORT}/1-login.html`);
});
