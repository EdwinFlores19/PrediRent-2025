/**
 * utils.js
 * Sistema de utilidades compartidas para el Frontend de PrediRent.
 * Incluye: Sistema de Notificaciones (Toasts) y inyección de estilos dinámicos.
 */

// 1. Inyección de Estilos para Toasts (CSS-in-JS)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    #toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .toast {
        min-width: 250px;
        background-color: #fff;
        border-left: 5px solid;
        border-radius: 4px;
        padding: 15px 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideIn 0.3s ease-out forwards;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        color: #333;
    }
    .toast.success { border-color: #2ecc71; }
    .toast.error { border-color: #e74c3c; }
    .toast.info { border-color: #3498db; }
    .toast.warning { border-color: #f1c40f; }
    
    .toast.hide {
        animation: fadeOut 0.3s ease-in forwards;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// Crear contenedor en el DOM si no existe
let toastContainer = document.getElementById('toast-container');
if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
}

/**
 * Muestra una notificación flotante (Toast).
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - 'success', 'error', 'info', 'warning'.
 * @param {number} duration - Duración en ms (default 4000).
 */
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Iconos simples
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    toast.innerHTML = `
        <span style="margin-right: 10px; font-size: 1.2em;">${icons[type] || ''}</span>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto-eliminar
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}

// Exportar globalmente
window.showToast = showToast;
