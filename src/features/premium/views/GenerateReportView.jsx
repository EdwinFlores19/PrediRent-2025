import React from 'react';
import '../styles/GenerateReport.css';

const GenerateReportView = () => {
  return (
    <div className="report-container">
      <h2>Generar Informe Avanzado</h2>
      <p>Selecciona las estimaciones que quieres incluir en tu informe PDF.</p>
      <div className="estimations-selection">
        {/* Aquí iría una lista de estimaciones seleccionables */}
        <label><input type="checkbox" /> Estimación: Piso Moderno (ID: 123)</label>
        <label><input type="checkbox" /> Estimación: Ático con Vistas (ID: 456)</label>
      </div>
      <button className="btn-generate-report">Exportar a PDF</button>
    </div>
  );
};

export default GenerateReportView;
