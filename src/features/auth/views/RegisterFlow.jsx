import React, { useState } from 'react';
import '../styles/AuthForms.css';

const RegisterFlow = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="auth-form-container">
      <form className="auth-form">
        <h2>Crea tu Cuenta</h2>
        {step === 1 && (
          <>
            <h3>Paso 1: Datos Personales</h3>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" placeholder="Tu nombre" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="tu@email.com" />
            </div>
            <button type="button" onClick={nextStep} className="btn-primary">Siguiente</button>
          </>
        )}
        {step === 2 && (
          <>
            <h3>Paso 2: Confirmación Telefónica</h3>
            <div className="form-group">
              <label>Número de Teléfono</label>
              <input type="tel" placeholder="+34 123 456 789" />
            </div>
            <div className="form-group">
              <label>Código de Verificación</label>
              <input type="text" placeholder="123456" />
            </div>
            <div className="form-buttons">
              <button type="button" onClick={prevStep} className="btn-secondary">Anterior</button>
              <button type="submit" className="btn-primary">Registrar</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterFlow;
