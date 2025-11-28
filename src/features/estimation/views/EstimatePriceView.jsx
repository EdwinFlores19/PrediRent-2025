import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import EstimationResultView from './EstimationResultView'; // Asumimos que podemos reutilizarlo o integrarlo

const EstimatePriceView = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [estimation, setEstimation] = useState(null);
    const [estimating, setEstimating] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
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
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleEstimate = async () => {
        if (!selectedProperty) return addToast('Selecciona una propiedad', 'error');

        setEstimating(true);
        try {
            // Obtener detalles de la propiedad seleccionada para enviar al estimador
            // En un caso real, el backend podría hacer esto solo con el ID, 
            // pero aquí simulamos el flujo completo si es necesario.
            // Por ahora, asumimos que el backend de estimación acepta ID o payload completo.
            // Usaremos el endpoint que creamos en pasos anteriores: /api/estimador/prediccion

            // Primero necesitamos los datos de la propiedad (si no los tenemos completos en la lista)
            const property = properties.find(p => p.PropiedadID == selectedProperty);

            const payload = {
                tipoPropiedad: property.TipoPropiedad || 'Departamento',
                tipoAlojamiento: 'Entire home/apt',
                distrito: property.Distrito || 'Lima',
                provincia: property.Provincia || 'Lima',
                huespedes: property.NumHuespedes || 2,
                habitaciones: property.NumHabitaciones || 1,
                camas: property.NumCamas || 1,
                baños: property.NumBanos || 1,
                comodidades: ['Wifi'] // Simulado
            };

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/estimador/prediccion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Error en la estimación');

            const result = await response.json();
            setEstimation(result.data);
            addToast('Estimación completada', 'success');

        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setEstimating(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;

    // Lógica de Bloqueo de 0 Propiedades
    if (properties.length === 0) {
        return (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📉</div>
                <h2 style={{ color: '#2D3748', marginBottom: '1rem' }}>¡Vaya! No tienes propiedades para analizar</h2>
                <p style={{ color: '#718096', marginBottom: '2rem' }}>Registra una propiedad ahora para calcular su rentabilidad y obtener el mejor precio de mercado.</p>
                <Link to="/properties/register" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', background: '#FF7B54', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                    Registrar Propiedad
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', color: '#2D3748', marginBottom: '2rem' }}>Estimador de Precios IA</h1>

            {!estimation ? (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', color: '#4A5568' }}>¿Qué propiedad quieres analizar?</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                        >
                            <option value="">-- Seleccionar Propiedad --</option>
                            {properties.map(p => (
                                <option key={p.PropiedadID} value={p.PropiedadID}>{p.Titulo}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleEstimate}
                            disabled={estimating || !selectedProperty}
                            style={{ background: '#FF7B54', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', cursor: estimating ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                            {estimating ? 'Analizando...' : 'Estimar Precio'}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <button onClick={() => setEstimation(null)} style={{ background: 'transparent', border: 'none', color: '#718096', cursor: 'pointer' }}>← Volver</button>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ color: '#718096', marginBottom: '0.5rem' }}>Precio Sugerido de Alquiler</h3>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: '#FF7B54', marginBottom: '0.5rem' }}>
                            S/ {estimation.precio_predicho}
                        </div>
                        <p style={{ color: '#A0AEC0', fontSize: '0.9rem', marginBottom: '2rem' }}>{estimation.confianza}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F7FAFC', padding: '1.5rem', borderRadius: '8px' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Promedio Zona</div>
                                <div style={{ fontWeight: 'bold', color: '#2D3748' }}>S/ {estimation.precio_promedio_zona}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: '#718096' }}>Máximo Potencial</div>
                                <div style={{ fontWeight: 'bold', color: '#48BB78' }}>S/ {estimation.precio_maximo_potencial}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                            <p><strong>Análisis IA:</strong> {estimation.mensaje}</p>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default EstimatePriceView;
