/**
 * 2-registro.js
 * Lógica de registro de usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro-form');
    const btnRegistro = document.getElementById('btn-registro');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!nombre || !email || !password) {
                if (window.showToast) window.showToast('Por favor completa todos los campos', 'warning');
                return;
            }

            try {
                btnRegistro.disabled = true;
                btnRegistro.textContent = 'Creando cuenta...';

                const response = await fetchWithAuth('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ nombre, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    if (window.showToast) window.showToast('Cuenta creada con éxito', 'success');

                    // Opcional: Auto-login o redirigir a login
                    setTimeout(() => {
                        window.location.href = '1-login.html';
                    }, 1500);
                } else {
                    throw new Error(data.message || 'Error al registrarse');
                }

            } catch (error) {
                console.error(error);
                if (window.showToast) window.showToast(error.message || 'Error en el registro', 'error');
                btnRegistro.disabled = false;
                btnRegistro.textContent = 'Registrarse';
            }
        });
    }
});
