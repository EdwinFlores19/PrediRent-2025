const EstimadorController = {
    async predict(req, res) {
        try {
            const payload = req.body;

            // Validar payload básico
            if (!payload.tipoPropiedad || !payload.distrito) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos requeridos para la estimación.'
                });
            }

            // Llamada al microservicio Python
            // Usamos fetch nativo de Node.js (disponible en versiones recientes)
            const pythonServiceUrl = 'http://localhost:8000/predict';

            const response = await fetch(pythonServiceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Error del servicio de IA: ${response.statusText}`);
            }

            const predictionData = await response.json();

            // Enriquecer respuesta con datos simulados para el gráfico si el modelo no los devuelve
            // (El modelo devuelve precio_predicho, dummy, status)
            const precio = predictionData.precio_predicho;

            // Simular datos de mercado para comparación
            const precioPromedioZona = precio * (0.9 + Math.random() * 0.2); // +/- 10%
            const precioMaximo = precio * 1.25; // +25% con mejoras

            res.json({
                success: true,
                data: {
                    precio_predicho: precio,
                    precio_promedio_zona: Math.round(precioPromedioZona),
                    precio_maximo_potencial: Math.round(precioMaximo),
                    moneda: 'PEN', // Asumimos Soles por defecto
                    confianza: predictionData.dummy ? 'Baja (Simulado)' : 'Alta (IA)',
                    mensaje: predictionData.dummy ? 'Estimación basada en reglas (Modelo IA no disponible)' : 'Estimación generada por IA'
                }
            });

        } catch (error) {
            console.error('Error en EstimadorController:', error);
            // Fallback en caso de que Python esté caído
            res.status(200).json({
                success: true,
                data: {
                    precio_predicho: 1500, // Valor seguro
                    precio_promedio_zona: 1400,
                    precio_maximo_potencial: 1800,
                    moneda: 'PEN',
                    confianza: 'Nula',
                    mensaje: 'Servicio de IA no disponible. Mostrando valor referencial.'
                }
            });
        }
    }
};

module.exports = EstimadorController;
