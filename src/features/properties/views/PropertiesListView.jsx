import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PropertiesList.css';

const PropertyCard = ({ property }) => (
  <div className="property-card">
    <img src={property.imageUrl} alt={property.title} className="property-card-img" />
    <div className="property-card-body">
      <h3>{property.title}</h3>
      <p>{property.address}</p>
      <div className="property-card-footer">
        <span>{property.price}</span>
        <Link to={`/properties/${property.id}`}>Ver Detalles</Link>
      </div>
    </div>
  </div>
);

const PropertiesListView = () => {
  const properties = [
    { id: 1, title: 'Piso Moderno en el Centro', address: 'Calle Falsa 123, Madrid', price: '€1200/mes', imageUrl: 'https://via.placeholder.com/300' },
    { id: 2, title: 'Ático con Vistas', address: 'Avenida Siempreviva 742, Barcelona', price: '€1800/mes', imageUrl: 'https://via.placeholder.com/300' },
  ];

  return (
    <div className="properties-list-container">
      <div className="properties-list-header">
        <h2>Tus Propiedades</h2>
        <Link to="/properties/register" className="btn-add-property">Añadir Propiedad</Link>
      </div>
      <div className="properties-grid">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
      </div>
    </div>
  );
};

export default PropertiesListView;
