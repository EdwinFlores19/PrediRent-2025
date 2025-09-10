import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import '../styles/Dashboard.css';

const DashboardView = () => {
  const { user } = useAuth();

  const isPremium = user?.tier === 'Premium';

  return (
    <div className="dashboard-container">
      <h1>Hola, {user?.name || 'Usuario'}!</h1>
      <p>Este es tu panel de control.</p>

      <div className={`dashboard-metrics ${isPremium ? 'premium-metrics' : 'freemium-metrics'}`}>
        <div className="metric-card">
          <h3>Propiedades Activas</h3>
          <p>5</p>
        </div>
        <div className="metric-card">
          <h3>Ingresos Mensuales</h3>
          <p>€ 4,500</p>
        </div>
        <div className="metric-card">
          <h3>Tasa de Ocupación</h3>
          <p>92%</p>
        </div>
      </div>

      {!isPremium && (
        <div className="freemium-upsell">
          <h2>¡Desbloquea todo el potencial!</h2>
          <p>Hazte Premium para acceder a informes detallados y asesoramiento personalizado.</p>
          <button className="btn-upgrade">Hazte Premium</button>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
