// src/api/authApi.js
// Conexión real al Backend (Puerto 3000)

const BASE_URL = 'http://localhost:3000/api/auth';

export const loginApi = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

export const registerApi = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: userData.name, // Mapeo de campos si es necesario
        email: userData.email,
        password: userData.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrarse');
    }

    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Register API Error:', error);
    throw error;
  }
};

export const logoutApi = async () => {
  // El backend no tiene endpoint de logout (stateless JWT), 
  // así que solo resolvemos para que el frontend limpie el estado.
  return Promise.resolve();
};
