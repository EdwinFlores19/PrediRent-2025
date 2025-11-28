// View/scripts/api.js
const BASE_URL = 'http://localhost:3000/api'; // <--- VERIFICA ESTO

async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // Asegurar que el endpoint empiece con /
        const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Manejo de token expirado
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            // Evitar redirección infinita si ya estamos en login
            if (!window.location.pathname.includes('1-login.html')) {
                window.location.href = '1-login.html';
            }
            throw new Error('Sesión expirada');
        }

        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Esto provoca el "Failed to fetch"
    }
}

/**
 * Verifica si el usuario está autenticado.
 * Si no, redirige al login.
 */
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        if (!window.location.pathname.includes('1-login.html')) {
            window.location.href = '1-login.html';
        }
    }
}

/**
 * Cierra sesión y redirige al login.
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '1-login.html';
}

// Exponer globalmente
window.fetchWithAuth = fetchWithAuth;
window.checkAuth = checkAuth;
window.logout = logout;
