# ✅ QA Checklist: Smoke Test - PrediRent MVP

Este documento detalla los pasos para validar manualmente que la integración Frontend-Backend-AI funciona correctamente.

## 🛠️ Prerrequisitos
1. Backend (Node.js) corriendo en puerto 3000 (`npm start`).
2. Base de Datos (SQL Server) activa y accesible.
3. Microservicio AI (Python) listo (o script `predict.py` funcional en backend).

## 🧪 Casos de Prueba

### 1. Autenticación
- [ ] **Registro Exitoso:** Ir a `2-registro.html`. Crear usuario nuevo. Verificar redirección a Login.
- [ ] **Login Exitoso:** Ir a `1-login.html`. Ingresar credenciales. Verificar acceso a `3-menu-principal.html`.
- [ ] **Persistencia:** Recargar la página del menú. Verificar que la sesión se mantiene (no redirige a login).

### 2. Gestión de Propiedades
- [ ] **Navegación:** Clic en botón "+". Ir a `4-registrar-propiedad.html`.
- [ ] **Creación (Happy Path):** Llenar todos los campos. Clic en "Registrar".
    - *Verificación:* Debe aparecer mensaje de éxito (Toast/Alert) y redirigir al menú.
    - *Verificación DB:* Verificar en SQL que se creó el registro en `dbo.Propiedades`.
- [ ] **Contador:** Volver al menú. Verificar que el badge de "Propiedades Activas" se incrementó.

### 3. Estimador de Precios (CORE)
- [ ] **Carga de Datos:** Ir a `9-estimar-precio.html`. Verificar que la lista muestra la propiedad creada en el paso anterior.
- [ ] **Selección:** Clic en la propiedad. Verificar que se habilita el botón de calcular.
- [ ] **Estimación (UX):** Clic en "Calcular Precio IA".
    - *Verificación:* Debe aparecer el Spinner.
    - *Verificación:* Los mensajes deben rotar ("Analizando...", "Consultando...").
- [ ] **Resultado:**
    - *Verificación:* Se muestra el precio en Soles (S/).
    - *Verificación:* Se muestran los rangos mínimo y máximo.
    - *Verificación:* Si el modelo AI falla, el sistema no se rompe (muestra precio base y advertencia amarilla).

### 4. Reportes
- [ ] **Selección Múltiple:** Ir a `5-generar-reportes.html`. Seleccionar 2 propiedades distintas.
- [ ] **Generación:** Clic en "Generar Reporte PDF".
    - *Verificación:* Mensaje de éxito. (Nota: En MVP descarga un JSON o simulación).

### 5. Sistema de Notificaciones
- [ ] **Prueba Visual:** En cualquier error forzado (ej: intentar login con pass incorrecto), verificar que aparece la notificación flotante (Toast) en la esquina superior derecha en lugar de un `alert()` nativo.
