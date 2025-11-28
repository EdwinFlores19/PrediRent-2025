/**
 * REPORTE DE AUDITORÍA DE NAVEGACIÓN Y CORRECCIONES SUGERIDAS
 * 
 * Este archivo contiene los snippets de código JavaScript necesarios para 
 * corregir los flujos de navegación rotos detectados en la auditoría.
 * 
 * Copie y pegue estas funciones en los archivos JS correspondientes.
 */

/* -------------------------------------------------------------------------- */
/* ARCHIVO: View/scripts/1-login.js                                         */
/* OBJETIVO: Redirigir al Dashboard (3-menu-principal.html) tras login exitoso */
/* -------------------------------------------------------------------------- */

async function handleLogin(event) {
    event.preventDefault();
    // ... lógica de fetch login ...

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // CORRECCIÓN DE FLUJO:
        // Antes: window.location.href = 'dashboard.html'; (Ruta incorrecta)
        // Ahora: Redirección explícita al archivo numerado correcto
        window.location.href = '3-menu-principal.html';
    }
}

/* -------------------------------------------------------------------------- */
/* ARCHIVO: View/scripts/3-menu-principal.js                                */
/* OBJETIVO: Enlazar botones del Dashboard a las Vistas correctas             */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar Auth al cargar
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '1-login.html';
        return;
    }

    // Configurar Listeners de Navegación

    // Botón: Registrar Propiedad
    const btnRegistrar = document.getElementById('btnRegistrarPropiedad');
    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', () => {
            window.location.href = '4-registrar-propiedad.html';
        });
    }

    // Botón: Estimar Precio
    const btnEstimar = document.getElementById('btnEstimarPrecio');
    if (btnEstimar) {
        btnEstimar.addEventListener('click', () => {
            window.location.href = '9-estimar-precio.html';
        });
    }

    // Botón: Comunidad
    const btnComunidad = document.getElementById('btnComunidad');
    if (btnComunidad) {
        btnComunidad.addEventListener('click', () => {
            window.location.href = '8-comunidad.html';
        });
    }

    // Botón: Cerrar Sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '1-login.html';
        });
    }
});
