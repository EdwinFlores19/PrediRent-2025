/**
 * 1-login.js
 * Lógica de inicio de sesión.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                if (window.showToast) window.showToast('Por favor completa todos los campos', 'warning');
                return;
            }

            try {
                btnLogin.disabled = true;
                btnLogin.textContent = 'Iniciando sesión...';

                // Usar fetchWithAuth para mantener consistencia, aunque login suele ser público
                // Pero fetchWithAuth añade headers base.
                // NOTA: fetchWithAuth añade token si existe, pero aquí no importa.
                // Ajustamos para usar fetch directo o api.js si tiene endpoint específico.
                // Asumimos endpoint /auth/login o similar.

                // Si api.js expone BASE_URL, mejor. Si no, construimos.
                // api.js tiene fetchWithAuth. Usémoslo.

                const response = await fetchWithAuth('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar token
                    localStorage.setItem('token', data.token);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }

                    if (window.showToast) window.showToast('¡Bienvenido!', 'success');

                    setTimeout(() => {
                        window.location.href = '3-menu-principal.html';
                    }, 1000);
                } else {
                    throw new Error(data.message || 'Credenciales inválidas');
                }

            } catch (error) {
                console.error(error);
                if (window.showToast) window.showToast(error.message || 'Error al iniciar sesión', 'error');
                btnLogin.disabled = false;
                btnLogin.textContent = 'Iniciar Sesión';
            }
        });
    }
});
