import React from 'react';
import { Link } from 'react-router-dom';

const UpgradePremium = () => {
  return (
    <div className="upgrade-premium-banner">
      <h2>Desbloquea todo el potencial de PrediRent</h2>
      <p>Accede a métricas avanzadas, informes detallados y asesoramiento personalizado.</p>
      <Link to="/profile" className="btn-upgrade">Hazte Premium</Link>
    </div>
  );
};

export default UpgradePremium;
