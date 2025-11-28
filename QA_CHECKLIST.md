# QA Checklist - PrediRent MVP

## 1. Registro de Usuario (Smoke Test)
- [ ] **Navegar a /registro.html**
- [ ] **Caso Feliz:**
    - [ ] Ingresar Nombre Completo válido.
    - [ ] Ingresar Email único (ej: `test_qa_01@predirent.com`).
    - [ ] Ingresar Password seguro (>6 caracteres).
    - [ ] Seleccionar un Distrito válido.
    - [ ] Click en "Registrarse".
    - [ ] **Resultado Esperado:** Redirección a Login o Dashboard, Toast de éxito.
- [ ] **Casos Borde:**
    - [ ] Intentar registrar un email ya existente. -> **Esperado:** Toast de error "Usuario ya existe".
    - [ ] Dejar campos vacíos. -> **Esperado:** Validación HTML5 o JS impide envío.

## 2. Login (Autenticación)
- [ ] **Navegar a /login.html**
- [ ] **Caso Feliz:**
    - [ ] Ingresar credenciales creadas en paso 1.
    - [ ] Click en "Ingresar".
    - [ ] **Resultado Esperado:** Redirección a Dashboard, Token JWT guardado en localStorage/Cookie.
- [ ] **Caso Error:**
    - [ ] Ingresar password incorrecto. -> **Esperado:** Toast de error "Credenciales inválidas".

## 3. Gestión de Propiedades (CRUD)
- [ ] **Navegar a "Mis Propiedades"**
- [ ] **Crear Propiedad:**
    - [ ] Llenar formulario (Tipo: Departamento, Metraje: 85, Habitaciones: 2, etc.).
    - [ ] Click en "Guardar".
    - [ ] **Esperado:** La propiedad aparece en la lista inmediatamente.
- [ ] **Validación de Datos:**
    - [ ] Verificar que los datos guardados coinciden con los ingresados (especialmente Metraje y Distrito).

## 4. Estimador de Precios (Core Feature)
- [ ] **Seleccionar Propiedad:**
    - [ ] Click en una propiedad de la lista.
    - [ ] Verificar que los datos se cargan en el panel de "Detalle".
- [ ] **Ejecutar Estimación:**
    - [ ] Click en botón "Estimar Precio".
    - [ ] **UX Check:**
        - [ ] Aparece loader con mensaje "Analizando mercado...".
        - [ ] Si tarda > 2s, el mensaje cambia (ej: "Consultando tendencias...").
    - [ ] **Resultado Exitoso:**
        - [ ] Se muestra el precio sugerido (ej: "S/ 2,450").
        - [ ] Se muestra gráfico o detalle de confianza (si aplica).
        - [ ] Toast de éxito "Estimación completada".
- [ ] **Manejo de Errores:**
    - [ ] Simular fallo de red (Offline mode en DevTools) y click en Estimar.
    - [ ] **Esperado:** Toast de error elegante, botón "Reintentar" visible en el panel.

## 5. Generación de Reporte
- [ ] **Post-Estimación:**
    - [ ] Click en "Generar Reporte PDF" (o similar).
    - [ ] **Esperado:** Se descarga un archivo o se abre nueva pestaña con el reporte.
    - [ ] Verificar que el reporte incluye: Nombre de Propiedad, Precio Estimado, Fecha.

## 6. Logout
- [ ] Click en "Cerrar Sesión".
- [ ] **Esperado:** Redirección a Login, no se puede volver atrás con botón "Back" del navegador (protección de rutas).
