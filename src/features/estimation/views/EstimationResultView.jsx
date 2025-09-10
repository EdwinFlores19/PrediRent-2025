import React from 'react';
import '../styles/EstimationResult.css';

const EstimationResultView = () => {
  return (
    <div className="estimation-container">
      <h2>Estimación de Precio de Alquiler</h2>
      <div className="estimation-main-price">
        <span>Precio Sugerido</span>
        <h3>€1,250 / mes</h3>
      </div>
      <div className="estimation-breakdown">
        <h4>Factores Influyentes</h4>
        {/* Aquí iría un componente de gráficos */}
        <p>Gráfico de barras mostrando la influencia de la ubicación, tamaño, comodidades, etc.</p>
        <div style={{ height: '200px', background: '#f0f0f0', display: 'grid', placeItems: 'center', borderRadius: '8px' }}>
          Chart Placeholder
        </div>
      </div>
    </div>
  );
};

export default EstimationResultView;
