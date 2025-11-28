import React, { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';

const ReportsView = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        // Cargar propiedades para el selector
        const fetchProperties = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/propiedades/mis-propiedades', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const result = await response.json();
                    setProperties(result.data || []);
                }
            } catch (error) {
                console.error('Error cargando propiedades:', error);
            }
        };
        fetchProperties();
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedProperty) return addToast('Selecciona una propiedad', 'error');

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/reportes/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ propiedadID: selectedProperty })
            });

            if (!response.ok) throw new Error('Error al generar reporte');

            const result = await response.json();
            setReportData(result.data);
            addToast('Reporte generado exitosamente', 'success');
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', color: '#2D3748', marginBottom: '2rem' }}>Generador de Reportes</h1>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A5568' }}>Selecciona una Propiedad</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                        style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                    >
                        <option value="">-- Seleccionar --</option>
                        {properties.map(p => (
                            <option key={p.PropiedadID} value={p.PropiedadID}>{p.Titulo}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading || !selectedProperty}
                        style={{ background: '#FF7B54', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? 'Generando...' : 'Generar Reporte'}
                    </button>
                </div>
            </div>

            {reportData && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#2D3748', marginBottom: '1rem' }}>Reporte de Rentabilidad</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', borderTop: '4px solid #FF7B54' }}>
                            <div style={{ color: '#718096', fontSize: '0.9rem' }}>Precio Estimado</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>S/ {reportData.propiedad.precio}</div>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', borderTop: '4px solid #48BB78' }}>
                            <div style={{ color: '#718096', fontSize: '0.9rem' }}>Rentabilidad Anual</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>S/ {reportData.estadisticas.rentabilidadAnual}</div>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', borderTop: '4px solid #4299E1' }}>
                            <div style={{ color: '#718096', fontSize: '0.9rem' }}>ROI Estimado</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>{reportData.estadisticas.roi}</div>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', borderTop: '4px solid #ECC94B' }}>
                            <div style={{ color: '#718096', fontSize: '0.9rem' }}>Ocupación</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>{reportData.estadisticas.ocupacionEstimada}</div>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1rem', color: '#4A5568' }}>Detalles de la Propiedad</h3>
                        <p><strong>Propiedad:</strong> {reportData.propiedad.titulo}</p>
                        <p><strong>Ubicación:</strong> {reportData.propiedad.ubicacion}</p>
                        <p><strong>Demanda en la Zona:</strong> {reportData.estadisticas.demandaZona}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#A0AEC0' }}>Generado el: {new Date(reportData.fechaGeneracion).toLocaleString()}</p>
                    </div>
                </div>
            )}
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default ReportsView;
