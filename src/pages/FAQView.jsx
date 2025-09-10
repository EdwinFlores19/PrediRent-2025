import React from 'react';
import './StaticPages.css';

const FAQView = () => {
  return (
    <div className="static-page-container">
      <h1>Preguntas Frecuentes (FAQ)</h1>
      <div className="faq-item">
        <h4>¿Cómo funciona la estimación de precios?</h4>
        <p>Utilizamos un algoritmo de machine learning que analiza miles de propiedades similares en tu zona para darte la estimación más precisa posible.</p>
      </div>
      <div className="faq-item">
        <h4>¿Qué beneficios tengo con la cuenta Premium?</h4>
        <p>Acceso a informes detallados, asesoría personalizada y análisis de mercado avanzado.</p>
      </div>
    </div>
  );
};

export default FAQView;
