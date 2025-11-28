/**
 * 4-registrar-propiedad.js
 * Lógica para el formulario multi-pasos de registro de propiedad.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado - Iniciando script de registro de propiedad');

    let currentStep = 1;
    const totalSteps = 3;
    const form = document.getElementById('form-propiedad');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');

    // Debugging IDs
    if (!form) console.error('Error: No se encontró el formulario #form-propiedad');
    if (!btnNext) console.error('Error: No se encontró el botón #btn-next');
    if (!btnPrev) console.error('Error: No se encontró el botón #btn-prev');

    // Inicializar vista inmediatamente
    showStep(currentStep);

    // Event Listeners
    if (btnNext) {
        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Click en Siguiente');
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Click en Anterior');
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Intentando enviar formulario...');

            if (validateStep(currentStep)) {
                try {
                    // Recopilar datos
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());

                    // Convertir tipos numéricos
                    data.area = Number(data.area);
                    data.habitaciones = Number(data.habitaciones);
                    data.banos = Number(data.banos);
                    data.precio = Number(data.precio);

                    console.log('Datos a enviar:', data);

                    // Mostrar estado de carga
                    const originalBtnText = btnSubmit.textContent;
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'Registrando...';

                    // Llamada a la API
                    // Asegurarse de que fetchWithAuth esté disponible
                    if (typeof fetchWithAuth === 'undefined') {
                        throw new Error('api.js no está cargado correctamente (fetchWithAuth undefined)');
                    }

                    const response = await fetchWithAuth('/propiedades', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        console.log('Registro exitoso');
                        if (window.showToast) window.showToast('Propiedad registrada con éxito', 'success');
                        setTimeout(() => {
                            window.location.href = '3-menu-principal.html';
                        }, 1500);
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Error al registrar');
                    }

                } catch (error) {
                    console.error('Error en registro:', error);
                    if (window.showToast) window.showToast(error.message || 'Error al registrar propiedad', 'error');
                    else alert(error.message); // Fallback

                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Registrar Propiedad';
                }
            }
        });
    }

    function showStep(step) {
        console.log(`Mostrando paso ${step}`);

        // Ocultar todos los fieldsets
        const fieldsets = document.querySelectorAll('fieldset[data-step]');
        fieldsets.forEach(fs => {
            fs.classList.remove('active');
            fs.classList.add('hidden');
            fs.style.display = 'none'; // Forzar estilo inline para asegurar
        });

        // Mostrar el actual
        const currentFs = document.querySelector(`fieldset[data-step="${step}"]`);
        if (currentFs) {
            currentFs.classList.add('active');
            currentFs.classList.remove('hidden');
            currentFs.style.display = 'block'; // Forzar estilo inline
        } else {
            console.error(`No se encontró fieldset para el paso ${step}`);
        }

        // Actualizar botones
        if (btnPrev) btnPrev.style.display = step === 1 ? 'none' : 'inline-block';
        if (btnNext) btnNext.style.display = step === totalSteps ? 'none' : 'inline-block';
        if (btnSubmit) btnSubmit.style.display = step === totalSteps ? 'inline-block' : 'none';

        // Actualizar indicador de pasos
        updateStepIndicator(step);
    }

    function validateStep(step) {
        const currentFs = document.querySelector(`fieldset[data-step="${step}"]`);
        if (!currentFs) return true;

        const inputs = currentFs.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                // Remover error al escribir
                input.addEventListener('input', () => input.classList.remove('error'), { once: true });
            }
        });

        if (!isValid) {
            if (window.showToast) window.showToast('Por favor complete los campos requeridos', 'warning');
            else alert('Por favor complete los campos requeridos');
        }

        return isValid;
    }

    function updateStepIndicator(step) {
        const steps = document.querySelectorAll('.step-indicator .step');
        steps.forEach((s, index) => {
            if (index + 1 === step) {
                s.classList.add('active');
                s.classList.remove('completed');
            } else if (index + 1 < step) {
                s.classList.add('completed');
                s.classList.remove('active');
            } else {
                s.classList.remove('active', 'completed');
            }
        });
    }
});
