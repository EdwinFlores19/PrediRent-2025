/**
 * agendar-cita.js
 * Lógica para la vista de Asesoría (Calendar).
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado - Iniciando script de agendar cita');

    const btnConfirmar = document.getElementById('btn-confirmar-cita');
    const inputFecha = document.getElementById('fecha-cita');
    const inputHora = document.getElementById('hora-cita');

    if (!btnConfirmar) {
        console.error('Error CRÍTICO: No se encontró el botón #btn-confirmar-cita');
        return;
    }

    btnConfirmar.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Botón confirmar clickeado');

        // 1. Validar campos
        if (!inputFecha || !inputFecha.value) {
            if (window.showToast) window.showToast('Por favor seleccione una fecha para la cita.', 'warning');
            return;
        }

        if (inputHora && !inputHora.value) {
            if (window.showToast) window.showToast('Por favor seleccione una hora.', 'warning');
            return;
        }

        // 2. Validar fecha futura
        const selectedDateStr = `${inputFecha.value}T${inputHora.value}`;
        const selectedDate = new Date(selectedDateStr);
        const now = new Date();

        if (isNaN(selectedDate.getTime())) {
            if (window.showToast) window.showToast('Fecha u hora inválida.', 'error');
            return;
        }

        if (selectedDate < now) {
            if (window.showToast) window.showToast('La fecha de la cita debe ser en el futuro.', 'error');
            return;
        }

        // 3. Envío al backend (Simulado por ahora)
        try {
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = 'Agendando...';

            // Simulación de éxito
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (window.showToast) window.showToast('Cita agendada con éxito. Un asesor le contactará.', 'success');

            // Resetear formulario
            if (inputFecha) inputFecha.value = '';
            if (inputHora) inputHora.value = '';

        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast('Error al agendar la cita.', 'error');
        } finally {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Confirmar Cita';
        }
    });
});
