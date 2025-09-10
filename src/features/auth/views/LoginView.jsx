import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css';

const LoginView = () => {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('password123');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // El error ya se maneja en el contexto, aquí solo evitamos la navegación.
      console.error('Fallo el inicio de sesión:', err);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Bienvenido de Nuevo</h2>
        <p>Inicia sesión para gestionar tus propiedades.</p>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="tu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Tu contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
        <div className="social-login">
          <p>O continúa con</p>
          <button type="button" className="btn-social-google" disabled={isLoading}>Google</button>
          <button type="button" className="btn-social-facebook" disabled={isLoading}>Facebook</button>
        </div>
      </form>
    </div>
  );
};

export default LoginView;