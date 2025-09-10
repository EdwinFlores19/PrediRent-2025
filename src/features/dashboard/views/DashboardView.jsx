import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getDashboardData } from '../../../api/dashboardApi';
import WelcomeHeader from '../components/WelcomeHeader';
import StatsCard from '../components/StatsCard';
import UpgradePremium from '../components/UpgradePremium';
import ActionCard from '../components/ActionCard';
import '../styles/Dashboard.css';

const DashboardView = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await getDashboardData(user?.tier);
        setData(dashboardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.tier) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return <div className="dashboard-loader">Cargando datos del dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  const isPremium = user?.tier === 'Premium';

  return (
    <div className="dashboard-container">
      <WelcomeHeader name={user?.name || 'Usuario'} />

      <div className="dashboard-grid">
        <div className="main-content">
          <h3>Métricas Principales</h3>
          <div className="stats-grid">
            <StatsCard title="Propiedades Activas" value={data?.propiedadesActivas} isPremium={isPremium} />
            <StatsCard title="Ingresos Mensuales" value={`€ ${data?.ingresosMes}`} isPremium={isPremium} />
            <StatsCard title="Tasa de Ocupación" value={`${data?.ocupacionPromedio}%`} isPremium={isPremium} />
            {isPremium && (
              <>
                <StatsCard title="Nuevos Leads" value={data?.nuevosLeads} isPremium />
                <StatsCard title="Precio Mercado" value={`€ ${data?.precioPromedioMercado}`} isPremium />
                <StatsCard title="Satisfacción Inquilinos" value={`${data?.satisfaccionInquilinos}%`} isPremium />
              </>
            )}
          </div>

          {!isPremium && <UpgradePremium />}
        </div>

        <aside className="sidebar-content">
          <h3>Acciones Rápidas</h3>
          <div className="actions-grid">
            <ActionCard 
              title="Gestionar Propiedades"
              description="Edita, visualiza o elimina tus propiedades existentes."
              linkTo="/properties"
              linkText="Ver mis propiedades"
            />
            <ActionCard 
              title="Añadir Nueva Propiedad"
              description="Inicia el proceso para obtener una nueva estimación de alquiler."
              linkTo="/properties/register"
              linkText="Añadir propiedad"
            />
             {isPremium && (
                <ActionCard 
                title="Agendar Asesoría"
                description="Habla con uno de nuestros expertos para optimizar tus alquileres."
                linkTo="/schedule-advisory"
                linkText="Agendar ahora"
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardView;