import React, { useState } from 'react';
import '../styles/RegisterProperty.css';

const RegisterPropertyView = () => {
  const [step, setStep] = useState(1);

  // Lógica para un formulario multi-paso
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="register-property-container">
      <h2>Registrar Nueva Propiedad</h2>
      <div className="form-steps">
        {step === 1 && <div>Paso 1: Detalles Básicos (Tipo, Habitaciones, etc.)</div>}
        {step === 2 && <div>Paso 2: Comodidades (WiFi, AC, etc.)</div>}
        {step === 3 && <div>Paso 3: Ubicación y Fotos</div>}
      </div>
      <div className="form-navigation">
        {step > 1 && <button onClick={prevStep}>Anterior</button>}
        {step < 3 && <button onClick={nextStep}>Siguiente</button>}
        {step === 3 && <button type="submit">Finalizar y Estimar</button>}
      </div>
    </div>
  );
};

export default RegisterPropertyView;
