/**
 * 3-menu-principal.js
 * Lógica para el Dashboard Principal y Listado de Propiedades.
 * Maneja la carga de propiedades, estadísticas y navegación.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar autenticación
    if (window.checkAuth) window.checkAuth();

    // 2. Limpiar datos falsos inmediatamente
    resetDashboardMetrics();

    // 3. Cargar datos del usuario y propiedades
    loadDashboardData();

    // 4. Configurar eventos globales (Logout, etc.)
    setupGlobalEvents();
});

/**
 * Limpia los contadores y métricas hardcodeadas para evitar mostrar datos falsos
 * mientras se cargan los datos reales.
 */
function resetDashboardMetrics() {
    // Card 1: Mis Propiedades
    const totalPropiedades = document.getElementById('total-propiedades');
    if (totalPropiedades) totalPropiedades.textContent = '...';

    // Card 2: Estimaciones
    const totalEstimaciones = document.getElementById('total-estimaciones');
    if (totalEstimaciones) totalEstimaciones.textContent = '0';

    // Card 3: Reportes
    const totalReportes = document.getElementById('total-reportes');
    if (totalReportes) totalReportes.textContent = '0';

    // Card 4: Plan
    const planActual = document.getElementById('plan-actual');
    if (planActual) {
        planActual.textContent = 'Básico';
        // Encontrar el padre <a> y actualizar href si es necesario, aunque ya está en el HTML
        const parentLink = planActual.closest('a');
        if (parentLink) parentLink.href = '10-planes.html';
    }
}

/**
 * Carga centralizada de datos del dashboard
 */
async function loadDashboardData() {
    const propertyContainer = document.getElementById('propiedades-container');
    const propertyList = document.getElementById('propiedades-list'); // El contenedor real en el HTML es #propiedades-list

    // Usar el contenedor correcto. En el HTML es #propiedades-list, pero el JS anterior usaba #propiedades-container.
    const propertiesListTarget = propertyList || propertyContainer;

    // Mostrar estado de carga
    if (propertiesListTarget) {
        propertiesListTarget.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div class="spinner" style="border: 4px solid rgba(0,0,0,0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #FF7B54; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color: #666;">Cargando tus propiedades...</p>
            </div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        `;
    }

    try {
        // Petición al endpoint de propiedades del usuario
        const response = await fetchWithAuth('/propiedades/mis-propiedades');

        if (response.ok) {
            const result = await response.json();
            // Asegurar que sea un array, incluso si viene null
            const properties = Array.isArray(result.data) ? result.data : [];

            // Renderizar lista
            renderProperties(properties, propertiesListTarget);

            // Actualizar métricas
            updateDashboardMetrics(properties);
        } else {
            throw new Error('Error al cargar propiedades');
        }
    } catch (error) {
        console.error('Error:', error);
        if (propertiesListTarget) {
            propertiesListTarget.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #e74c3c; background: #fff; border-radius: 8px; border: 1px solid #ffccc7;">
                    <p>⚠️ No se pudieron cargar tus datos.</p>
                    <button onclick="loadDashboardData()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #FF7B54; color: white; border: none; border-radius: 4px; cursor: pointer;">Reintentar</button>
                </div>
            `;
        }
        // Asegurar que el contador no se quede en "..."
        const totalEl = document.getElementById('total-propiedades');
        if (totalEl) totalEl.textContent = '0';

        if (window.showToast) showToast('Error de conexión con el servidor', 'error');
    }
}

/**
 * Renderiza la lista de propiedades con el nuevo diseño Enterprise
 * @param {Array} properties - Lista de objetos de propiedad
 * @param {HTMLElement} container - Elemento del DOM donde renderizar
 */
function renderProperties(properties, container) {
    if (!container) return;

    // Limpiar contenedor
    container.innerHTML = '';

    if (properties.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; border: 1px dashed #cbd5e0;">
                <p style="color: #2D3748; margin-bottom: 0.5rem; font-weight: 500; font-size: 1.1rem;">Aún no tienes propiedades registradas.</p>
                <p style="color: #718096; margin-bottom: 1.5rem;">Comienza registrando tu primera propiedad para gestionarla.</p>
                <a href="4-registrar-propiedad.html" class="btn-primary" style="display: inline-block; padding: 0.75rem 1.5rem; text-decoration: none; background-color: #FF7B54; color: white; border-radius: 6px; font-weight: 500;">¡Registra la primera!</a>
            </div>
        `;
        return;
    }

    properties.forEach(p => {
        // Fallback de imagen solicitado
        const placeholderImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500&auto=format&fit=crop';

        // Priorizar imagen del backend, luego fallback
        const imageUrl = (p.ImagenURL && p.ImagenURL.trim() !== '') ? p.ImagenURL : placeholderImg;

        // Formatear precio
        const precio = p.Precio ?
            new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(p.Precio) :
            'Precio no definido';

        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="property-image-container">
                <img 
                    src="${imageUrl}" 
                    alt="${p.Titulo}" 
                    onerror="this.onerror=null; this.src='${placeholderImg}';"
                >
                <span class="property-status">Disponible</span>
            </div>
            
            <div class="property-content">
                <div class="property-price">${precio}</div>
                <h3 class="property-title" title="${p.Titulo}">${p.Titulo}</h3>
                
                <div class="property-details">
                    <div class="property-detail-item">
                        <span>🛏️</span> ${p.NumHabitaciones || 0} Hab
                    </div>
                    <div class="property-detail-item">
                        <span>🚿</span> ${p.NumBanos || 0} Baños
                    </div>
                    <div class="property-detail-item">
                        <span>📏</span> ${p.Area || 0} m²
                    </div>
                </div>
                
                <div class="property-actions">
                    <a href="5-editar-propiedad.html?id=${p.PropiedadID}" class="btn-outline">Editar</a>
                    <a href="9-estimar-precio.html?id=${p.PropiedadID}" class="btn-primary-sm">Estimar</a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Actualiza los contadores del dashboard
 */
function updateDashboardMetrics(properties) {
    const totalEl = document.getElementById('total-propiedades');
    // Asegurar que muestre 0 si no hay propiedades, nunca "-"
    if (totalEl) totalEl.textContent = properties.length.toString();
}

function setupGlobalEvents() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.logout) window.logout();
        });
    }
}
