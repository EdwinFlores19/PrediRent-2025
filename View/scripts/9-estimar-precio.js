/**
 * 9-estimar-precio.js
 * Lógica para la estimación de precios con IA y visualización de gráficos.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay ID en la URL para auto-iniciar
    const urlParams = new URLSearchParams(window.location.search);
    const propiedadId = urlParams.get('id');

    if (propiedadId) {
        iniciarEstimacion(propiedadId);
    }
});

async function iniciarEstimacion(propiedadId) {
    const container = document.getElementById('analysisSection');

    // 1. Mostrar Spinner
    container.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: #666;">Analizando mercado inmobiliario...</p>
            <p style="font-size: 0.9rem; color: #999;">Consultando IA...</p>
        </div>
    `;

    try {
        // 2. Obtener datos de la propiedad (Necesitamos los detalles para enviar a la IA)
        // Como no tenemos un endpoint directo de "getOne" público en este contexto, 
        // simularemos que obtenemos los datos o usamos un endpoint si existiera.
        // En un flujo real: const prop = await fetchWithAuth(`/propiedades/${propiedadId}`);

        // Simulamos datos para el payload (en producción, esto vendría de la BD)
        const payload = {
            tipoPropiedad: 'Departamento',
            tipoAlojamiento: 'Entire home/apt',
            distrito: 'Miraflores',
            provincia: 'Lima',
            huespedes: 4,
            habitaciones: 2,
            camas: 2,
            baños: 2,
            comodidades: ['Wifi', 'TV', 'Kitchen']
        };

        // 3. Llamar al endpoint de predicción (Node -> Python)
        const response = await fetchWithAuth('/estimador/prediccion', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Error en la estimación');

        const result = await response.json();
        const data = result.data;

        // 4. Renderizar Resultados y Gráfico
        renderResults(container, data);

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                <h3>❌ Error en la estimación</h3>
                <p>No pudimos conectar con el servicio de inteligencia artificial.</p>
                <button onclick="location.reload()" class="btn-primary" style="margin-top: 1rem;">Reintentar</button>
            </div>
        `;
    }
}

function renderResults(container, data) {
    // Limpiar contenedor
    container.innerHTML = `
        <div style="width: 100%; max-width: 800px;">
            <h2 style="text-align: center; margin-bottom: 2rem; color: #2D3748;">Resultados de la Estimación</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
                <div style="background: #F7FAFC; padding: 1.5rem; border-radius: 12px; text-align: center;">
                    <p style="color: #718096; margin-bottom: 0.5rem;">Precio Sugerido</p>
                    <div style="font-size: 2.5rem; font-weight: 800; color: #FF7B54;">
                        S/ ${data.precio_predicho}
                    </div>
                    <p style="font-size: 0.875rem; color: #A0AEC0; margin-top: 0.5rem;">${data.confianza}</p>
                </div>
                
                <div style="display: flex; flex-direction: column; justify-content: center;">
                    <p style="margin-bottom: 1rem;"><strong>Análisis:</strong> ${data.mensaje}</p>
                    <ul style="color: #4A5568; font-size: 0.9rem;">
                        <li style="margin-bottom: 0.5rem;">✓ Basado en características similares</li>
                        <li style="margin-bottom: 0.5rem;">✓ Ajustado por distrito</li>
                        <li>✓ Tendencia de mercado actual</li>
                    </ul>
                </div>
            </div>

            <div style="background: white; padding: 1rem; border-radius: 12px; height: 300px;">
                <canvas id="priceChart"></canvas>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <a href="3-menu-principal.html" class="btn-primary" style="text-decoration: none; padding: 0.75rem 1.5rem; background: #2D3748; color: white; border-radius: 6px;">Volver al Dashboard</a>
            </div>
        </div>
    `;

    // Renderizar Gráfico con Chart.js
    const ctx = document.getElementById('priceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Promedio Zona', 'Tu Propiedad', 'Potencial Máximo'],
            datasets: [{
                label: 'Precio Estimado (PEN)',
                data: [data.precio_promedio_zona, data.precio_predicho, data.precio_maximo_potencial],
                backgroundColor: [
                    'rgba(203, 213, 224, 0.7)', // Gris
                    'rgba(255, 123, 84, 0.8)',  // Orange (Marca)
                    'rgba(72, 187, 120, 0.7)'   // Verde
                ],
                borderColor: [
                    'rgba(203, 213, 224, 1)',
                    'rgba(255, 123, 84, 1)',
                    'rgba(72, 187, 120, 1)'
                ],
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Comparativa de Mercado',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: '#f3f3f3' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}
