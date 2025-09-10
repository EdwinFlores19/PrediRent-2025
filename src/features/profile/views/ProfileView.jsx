import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import '../styles/Profile.css';

const ProfileView = () => {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      <div className="profile-card">
        <h3>Datos Personales</h3>
        <p><strong>Nombre:</strong> {user?.name}</p>
        <p><strong>Email:</strong> usuario@test.com</p>
      </div>
      <div className="profile-card">
        <h3>Mi Suscripción</h3>
        <p><strong>Plan Actual:</strong> {user?.tier}</p>
        {user?.tier !== 'Premium' && <button>Mejorar a Premium</button>}
      </div>
    </div>
  );
};

export default ProfileView;
