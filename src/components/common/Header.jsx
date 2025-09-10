import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header-container">
      <Link to="/" className="header-logo">PrediRent</Link>
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/properties">Propiedades</NavLink>
            <NavLink to="/profile">Perfil</NavLink>
            <button onClick={logout} className="header-logout-btn">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar Sesión</NavLink>
            <NavLink to="/register" className="header-register-btn">Registrarse</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
