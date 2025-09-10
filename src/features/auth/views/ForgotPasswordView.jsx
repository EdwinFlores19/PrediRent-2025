import React from 'react';
import '../styles/AuthForms.css';

const ForgotPasswordView = () => {
  return (
    <div className="auth-form-container">
      <form className="auth-form">
        <h2>Recupera tu Contraseña</h2>
        <p>Ingresa tu email y te enviaremos un enlace para restablecerla.</p>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="tu@email.com" required />
        </div>
        <button type="submit" className="btn-primary">Enviar Enlace</button>
      </form>
    </div>
  );
};

export default ForgotPasswordView;
