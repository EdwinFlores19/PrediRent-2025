import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PlansView = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        navigate('/plans/payment', { state: { plan } });
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#2D3748', marginBottom: '1rem' }}>Mejora tu Plan</h1>
                <p style={{ color: '#718096', fontSize: '1.1rem' }}>Elige el plan perfecto para potenciar tus inversiones inmobiliarias</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Basic Plan */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2D3748', marginBottom: '0.5rem' }}>Básico</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1A202C', marginBottom: '2rem' }}>S/ 0 <span style={{ fontSize: '1rem', color: '#718096', fontWeight: '500' }}>/mes</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flexGrow: 1 }}>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ Hasta 2 Propiedades</li>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ Estimaciones Básicas</li>
                    </ul>
                    <button disabled style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'transparent', border: '2px solid #CBD5E0', color: '#A0AEC0', cursor: 'not-allowed' }}>Plan Actual</button>
                </div>

                {/* Pro Plan */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '2px solid #FF7B54', position: 'relative', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#FF7B54', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Más Popular</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2D3748', marginBottom: '0.5rem' }}>Profesional</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1A202C', marginBottom: '2rem' }}>S/ 49 <span style={{ fontSize: '1rem', color: '#718096', fontWeight: '500' }}>/mes</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flexGrow: 1 }}>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ Hasta 10 Propiedades</li>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ Estimaciones con IA Avanzada</li>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ 5 Reportes PDF / mes</li>
                    </ul>
                    <button onClick={() => handleSelectPlan('Pro')} style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: '#FF7B54', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Elegir Profesional</button>
                </div>

                {/* Enterprise Plan */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2D3748', marginBottom: '0.5rem' }}>Enterprise</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1A202C', marginBottom: '2rem' }}>S/ 199 <span style={{ fontSize: '1rem', color: '#718096', fontWeight: '500' }}>/mes</span></div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flexGrow: 1 }}>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ Propiedades Ilimitadas</li>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ API de Estimaciones</li>
                        <li style={{ marginBottom: '1rem', color: '#4A5568' }}>✓ Reportes Ilimitados</li>
                    </ul>
                    <button onClick={() => handleSelectPlan('Enterprise')} style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'transparent', border: '2px solid #CBD5E0', color: '#4A5568', fontWeight: 'bold', cursor: 'pointer' }}>Contactar Ventas</button>
                </div>
            </div>
        </div>
    );
};

export default PlansView;
