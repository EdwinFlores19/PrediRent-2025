import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';

const PaymentGatewayView = () => {
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const planName = location.state?.plan || 'Pro'; // Plan seleccionado

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulación de proceso (3 segundos)
        setTimeout(async () => {
            try {
                // Llamada al backend real para actualizar DB
                const res = await fetch('http://localhost:3000/api/auth/upgrade-plan', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ nuevoPlan: planName })
                });

                if (res.ok) {
                    addToast(`¡Pago exitoso! Ahora eres miembro ${planName}`, 'success');
                    navigate('/'); // Volver al Dashboard
                } else {
                    addToast('Error procesando el pago', 'error');
                }
            } catch (err) {
                addToast('Error de conexión', 'error');
            } finally {
                setProcessing(false);
            }
        }, 3000);
    };

    return (
        <div style={{ maxWidth: '500px', margin: '2.5rem auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>Finalizar Compra</h2>
                <span style={{ background: '#FFFAF0', color: '#FF7B54', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' }}>Plan {planName}</span>
            </div>

            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.25rem' }}>Titular de la Tarjeta</label>
                    <input required type="text" style={{ width: '100%', border: '1px solid #CBD5E0', padding: '0.75rem', borderRadius: '6px', outline: 'none' }} placeholder="Juan Pérez" />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.25rem' }}>Número de Tarjeta</label>
                    <input required type="text" style={{ width: '100%', border: '1px solid #CBD5E0', padding: '0.75rem', borderRadius: '6px', outline: 'none' }} placeholder="0000 0000 0000 0000" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.25rem' }}>Expiración</label>
                        <input required type="text" style={{ width: '100%', border: '1px solid #CBD5E0', padding: '0.75rem', borderRadius: '6px' }} placeholder="MM/AA" />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.25rem' }}>CVC</label>
                        <input required type="text" style={{ width: '100%', border: '1px solid #CBD5E0', padding: '0.75rem', borderRadius: '6px' }} placeholder="123" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: '1.125rem',
                        marginTop: '1.5rem',
                        transition: 'all 0.2s',
                        background: processing ? '#CBD5E0' : '#FF7B54',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        boxShadow: processing ? 'none' : '0 4px 6px -1px rgba(255, 123, 84, 0.4)'
                    }}
                >
                    {processing ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <span className="spinner" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                            Procesando...
                        </span>
                    ) : (
                        `Pagar S/ 49.00`
                    )}
                </button>
            </form>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default PaymentGatewayView;
