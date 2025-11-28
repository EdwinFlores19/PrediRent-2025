import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const PropertiesListView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:3000/api/propiedades/mis-propiedades', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      // Manejo seguro de array vacío
      setProperties(json.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando tus propiedades...</div>;

  // EMPTY STATE ELEGANTE
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow p-8 text-center" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏠</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748', marginBottom: '0.5rem' }}>Aún no tienes propiedades</h2>
        <p style={{ color: '#718096', marginBottom: '1.5rem', maxWidth: '400px' }}>
          Para comenzar a usar el estimador de precios y generar reportes, necesitas registrar tu primer inmueble.
        </p>
        <button
          onClick={() => navigate('/properties/register')}
          style={{ background: '#FF7B54', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          Registrar mi primera propiedad
        </button>
      </div>
    );
  }

  // Renderizado normal de lista (Grid)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {properties.map(prop => (
        <div key={prop.PropiedadID} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem', transition: 'transform 0.2s' }}>
          <div style={{ height: '160px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden' }}>
            <img
              src={prop.ImagenURL || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500"}
              alt="Propiedad"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; }}
            />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{prop.Titulo}</h3>
          <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{prop.Distrito || 'Sin ubicación'}</p>
          <div style={{ color: '#FF7B54', fontWeight: 'bold' }}>
            {prop.Precio ? `S/ ${prop.Precio}` : 'Sin precio'}
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Link to={`/properties/${prop.PropiedadID}`} style={{ color: '#4299E1', textDecoration: 'none', fontSize: '0.875rem' }}>Ver Detalles →</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertiesListView;
