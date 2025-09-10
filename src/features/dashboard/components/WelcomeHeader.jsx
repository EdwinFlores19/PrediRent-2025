import React from 'react';

const WelcomeHeader = ({ name }) => {
  return (
    <div className="welcome-header">
      <h1>¡Hola de nuevo, {name}!</h1>
      <p>Aquí tienes un resumen de tu actividad.</p>
    </div>
  );
};

export default WelcomeHeader;
