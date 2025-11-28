import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetailsView = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular fetch por ahora, luego conectar a API real
        // TODO: Conectar a http://localhost:3000/api/propiedades/:id
        setTimeout(() => {
            setProperty({
                id,
                title: 'Propiedad de Ejemplo',
                address: 'Calle Falsa 123',
                price: 1500,
                description: 'Esta es una descripción detallada de la propiedad.',
                features: {
                    bedrooms: 3,
                    bathrooms: 2,
                    area: 120
                },
                imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop'
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando detalles...</div>;

    if (!property) return <div style={{ padding: '2rem', textAlign: 'center' }}>Propiedad no encontrada</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/properties" style={{ display: 'inline-block', marginBottom: '1rem', color: '#FF7B54', textDecoration: 'none' }}>&larr; Volver a la lista</Link>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <img
                    src={property.imageUrl}
                    alt={property.title}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ margin: 0, color: '#2D3748' }}>{property.title}</h1>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FF7B54' }}>${property.price}/mes</span>
                    </div>

                    <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '1.1rem' }}>📍 {property.address}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: '#F7FAFC', borderRadius: '8px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛏️</span>
                            <strong>{property.features.bedrooms}</strong> Hab
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚿</span>
                            <strong>{property.features.bathrooms}</strong> Baños
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>📏</span>
                            <strong>{property.features.area}</strong> m²
                        </div>
                    </div>

                    <h3 style={{ color: '#2D3748', marginBottom: '1rem' }}>Descripción</h3>
                    <p style={{ lineHeight: '1.6', color: '#4A5568' }}>{property.description}</p>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button style={{ flex: 1, padding: '1rem', background: '#FF7B54', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Editar Propiedad
                        </button>
                        <button style={{ flex: 1, padding: '1rem', background: 'white', color: '#FF7B54', border: '1px solid #FF7B54', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Estimar Precio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsView;
