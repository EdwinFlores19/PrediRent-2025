/**
 * utils.js - Utilidades compartidas para el Frontend de PrediRent
 * Copia este archivo en tu carpeta de scripts (ej. View/scripts/utils.js) 
 * y asegúrate de importarlo en tu HTML antes de los scripts de lógica.
 */

// Inyectar estilos para Toast si no existen
(function injectToastStyles() {
    const styleId = 'toast-notification-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none; /* Permitir clicks debajo */
            }
            .toast {
                min-width: 300px;
                padding: 16px 20px;
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
                color: #1f2937;
                border-left: 6px solid #333;
                pointer-events: auto;
                backdrop-filter: blur(10px);
            }
            .toast.success { border-left-color: #10B981; background: #ECFDF5; }
            .toast.error { border-left-color: #EF4444; background: #FEF2F2; }
            .toast.info { border-left-color: #3B82F6; background: #EFF6FF; }
            .toast.warning { border-left-color: #F59E0B; background: #FFFBEB; }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .toast-icon {
                font-size: 20px;
            }

            .toast-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #9CA3AF;
                margin-left: 15px;
                transition: color 0.2s;
                line-height: 1;
            }
            .toast-close:hover { color: #4B5563; }

            @keyframes slideIn {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(20px); }
            }
        `;
        document.head.appendChild(style);
    }
})();

// Crear contenedor de Toasts si no existe
function getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Muestra una notificación Toast elegante
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duración en ms (default 3000)
 */
function showToastNotification(message, type = 'info', duration = 4000) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '🎉',
        error: '⚠️',
        info: 'ℹ️',
        warning: '🚧'
    };

    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || ''}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" aria-label="Cerrar">&times;</button>
    `;

    // Botón de cerrar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.onclick = () => removeToast(toast);

    container.appendChild(toast);

    // Auto eliminar
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

function removeToast(toast) {
    // Evitar doble eliminación
    if (toast.classList.contains('removing')) return;

    toast.classList.add('removing');
    toast.style.animation = 'fadeOut 0.4s ease-in forwards';
    toast.addEventListener('animationend', () => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
    });
}

// Exportar globalmente
window.showToastNotification = showToastNotification;
