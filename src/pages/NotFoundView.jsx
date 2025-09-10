import React from 'react';
import { Link } from 'react-router-dom';
import './StaticPages.css';

const NotFoundView = () => {
  return (
    <div className="static-page-container text-center">
      <h1>404 - Página No Encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn-back-home">Volver al Inicio</Link>
    </div>
  );
};

export default NotFoundView;
