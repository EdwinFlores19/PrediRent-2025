# 🏢 PrediRent - Plataforma de Gestión y Predicción Inmobiliaria

Bienvenido a **PrediRent**, una solución integral SaaS para la gestión de propiedades y estimación de precios de alquiler basada en Inteligencia Artificial.

## 🚀 Arquitectura del Sistema

El proyecto sigue una arquitectura moderna de microservicios y capas:

1.  **Frontend (View)**:
    *   **Tecnología**: HTML5, CSS3 (Diseño Enterprise), JavaScript (Vanilla + Módulos).
    *   **Responsabilidad**: Interfaz de usuario, validaciones visuales y consumo de APIs.
    *   **Ubicación**: `/View`

2.  **Backend (Node.js)**:
    *   **Tecnología**: Node.js (Express), Tedious (MSSQL Driver).
    *   **Responsabilidad**: API REST, lógica de negocio, autenticación y orquestación entre Frontend y Base de Datos.
    *   **Archivo Principal**: `server.cjs` (CommonJS).

3.  **Microservicio de IA (Python)**:
    *   **Tecnología**: FastAPI, XGBoost, Scikit-Learn.
    *   **Responsabilidad**: Procesamiento de datos y predicción de precios de mercado.
    *   **Ubicación**: `/python`

4.  **Base de Datos**:
    *   **Tecnología**: SQL Server Express (Local).
    *   **Responsabilidad**: Persistencia de usuarios, propiedades y configuraciones.

---

## 🛠️ Guía de Instalación

### 1. Prerrequisitos
*   Node.js (v18 o superior)
*   Python (v3.9 o superior)
*   SQL Server Express (2019 o superior)

### 2. Instalación de Dependencias

**Backend & Frontend:**
Abrir terminal en la raíz del proyecto:
```bash
npm install
```

**Microservicio de IA:**
```bash
pip install fastapi uvicorn pandas scikit-learn xgboost joblib pydantic python-dotenv
```
*(Nota: Si `pip` falla, prueba `python -m pip install ...`)*

---

## ⚙️ Configuración Crítica de Base de Datos (SQL Server)

Para que el Backend conecte correctamente con SQL Server Express, es **OBLIGATORIO** realizar esta configuración de red:

1.  Abrir **SQL Server Configuration Manager**.
2.  Ir a **SQL Server Network Configuration** > **Protocols for SQLEXPRESS**.
3.  Asegurar que **TCP/IP** esté en estado **Enabled**.
4.  Doble clic en **TCP/IP** > Pestaña **IP Addresses**.
5.  Bajar hasta la sección **IPAll**:
    *   **TCP Dynamic Ports**: (Borrar contenido, dejar vacío).
    *   **TCP Port**: Escribir `1433`.
6.  Reiniciar el servicio **SQL Server (SQLEXPRESS)**.

### Habilitar Usuario `sa` (Si se usa autenticación SQL)
1.  Abrir **SQL Server Management Studio (SSMS)**.
2.  Conectar con Autenticación de Windows.
3.  Ir a **Security** > **Logins** > **sa**.
4.  Clic derecho > **Properties**.
5.  **General**: Asignar password (ej. `12345`).
6.  **Status**: En "Login", seleccionar **Enabled**.

---

## ▶️ Ejecución del Proyecto

Para iniciar el sistema completo, necesitas dos terminales:

**Terminal 1: Backend + Frontend Server**
```bash
node server.cjs
```
*Deberías ver: `✅ Servidor PrediRent corriendo...` y `✅ Conectado a SQL Server`.*

**Terminal 2: Microservicio de IA**
```bash
python python/app_fastapi.py
```
*Deberías ver: `Uvicorn running on http://127.0.0.1:8000`.*

---

## 🌐 Acceso
Abrir en el navegador:
[http://localhost:3000/1-login.html](http://localhost:3000/1-login.html)

---
*Documentación generada automáticamente por Antigravity Agent.*
