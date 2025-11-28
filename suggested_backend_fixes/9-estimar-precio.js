/*
 * 9-estimar-precio.js - PARTE DE FUNCIÓN CORREGIDA
 * Reemplaza la función calculateAndShowPrice existente con esta versión.
 */

async function calculateAndShowPrice() {
    // 1. Validar selección
    if (!selectedProperty) {
        if (typeof showToastNotification === 'function') {
            showToastNotification('Por favor, selecciona una propiedad primero.', 'warning');
        } else {
            alert('Por favor, selecciona una propiedad primero.');
        }
        return;
    }

    const analysisSection = document.querySelector('#analysisSection');

    // Mensajes de carga rotativos para mantener el interés
    const loadingMessages = [
        "Analizando mercado inmobiliario...",
        `Consultando tendencias en ${selectedProperty.Distrito || 'tu zona'}...`,
        "Comparando con propiedades similares...",
        "Calculando rentabilidad estimada...",
        "Finalizando predicción con IA..."
    ];

    let msgIndex = 0;

    // Función para actualizar el mensaje
    const updateLoadingMessage = () => {
        const msgEl = analysisSection.querySelector('.loading-text');
        if (msgEl) {
            msgEl.style.opacity = '0';
            setTimeout(() => {
                msgEl.textContent = loadingMessages[msgIndex % loadingMessages.length];
                msgEl.style.opacity = '1';
            }, 300); // Pequeña transición de fade
        }
        msgIndex++;
    };

    // Mostrar loader inicial
    // Asumimos que showLoading acepta HTML o usamos innerHTML directo si showLoading es muy simple
    if (typeof showLoading === 'function') {
        showLoading(true, '#analysisSection', `
            <div class="loading-container" style="text-align:center; padding: 40px;">
                <div class="spinner" style="margin-bottom: 15px;"></div>
                <p class="loading-text" style="font-size: 1.1em; color: #555; transition: opacity 0.3s;">${loadingMessages[0]}</p>
            </div>
        `);
    } else {
        // Fallback si showLoading no existe
        analysisSection.innerHTML = `
            <div class="loading-container" style="text-align:center; padding: 40px;">
                <div class="spinner"></div> <!-- Asegúrate de tener CSS para .spinner -->
                <p class="loading-text">${loadingMessages[0]}</p>
            </div>
        `;
    }

    // Intervalo para rotar mensajes cada 2.5 segundos
    const messageInterval = setInterval(updateLoadingMessage, 2500);

    try {
        // 2. Construir Payload Completo
        const payload = {
            tipoPropiedad: selectedProperty.TipoPropiedad,
            tipoAlojamiento: 'entire',
            distrito: selectedProperty.Distrito,
            provincia: selectedProperty.Provincia || 'Lima',
            huespedes: selectedProperty.NumHuespedes,
            habitaciones: selectedProperty.NumHabitaciones,
            camas: selectedProperty.NumCamas,
            baños: selectedProperty.NumBanos,
            // Nota: Para mejorar la precisión, en el futuro se deberían cargar las comodidades reales con un JOIN
            comodidades: ['Wifi', 'Cocina'] // Placeholder seguro
        };

        console.log('Enviando payload a IA:', payload);

        // 3. Llamada al Endpoint Correcto
        const response = await fetchWithAuth('/estimador/prediccion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();

            if (typeof showToastNotification === 'function') {
                showToastNotification('¡Estimación completada con éxito!', 'success');
            }

            displayResults(result.data);
        } else {
            const err = await response.json();
            throw new Error(err.message || 'Error en el cálculo');
        }
    } catch (error) {
        console.error('Error en calculateAndShowPrice:', error);

        if (typeof showToastNotification === 'function') {
            showToastNotification(`Error: ${error.message}`, 'error');
        } else {
            alert(`Error: ${error.message}`);
        }

        // Mostrar estado de error en la UI
        if (analysisSection) {
            analysisSection.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 30px; color: #EF4444;">
                    <p style="font-size: 1.2em; margin-bottom: 15px;">⚠️ No pudimos realizar la estimación.</p>
                    <p style="font-size: 0.9em; color: #666; margin-bottom: 20px;">${error.message}</p>
                    <button onclick="calculateAndShowPrice()" class="retry-btn" style="padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 6px; cursor: pointer;">Reintentar</button>
                </div>
            `;
        }
    } finally {
        clearInterval(messageInterval);
        // Limpieza final si es necesaria (displayResults suele limpiar el contenedor)
    }
}
