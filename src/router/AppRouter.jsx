import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layout
import MainLayout from '../layouts/MainLayout';

// Vistas de Autenticación
import LoginView from '../features/auth/views/LoginView';
import RegisterFlow from '../features/auth/views/RegisterFlow';
import ForgotPasswordView from '../features/auth/views/ForgotPasswordView';

// Vistas Principales (Protegidas)
import DashboardView from '../features/dashboard/views/DashboardView';
import PropertiesListView from '../features/properties/views/PropertiesListView';
import RegisterPropertyView from '../features/properties/views/RegisterPropertyView';
import EstimationResultView from '../features/estimation/views/EstimationResultView';
import ProfileView from '../features/profile/views/ProfileView';

// Vistas Premium (Protegidas)
import ScheduleAdvisoryView from '../features/premium/views/ScheduleAdvisoryView';
import GenerateReportView from '../features/premium/views/GenerateReportView';

// Vistas Estáticas
import FAQView from '../pages/FAQView';
import NotFoundView from '../pages/NotFoundView';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterFlow />} />
          <Route path="/forgot-password" element={<ForgotPasswordView />} />
          <Route path="/faq" element={<FAQView />} />
          
          {/* Rutas Protegidas */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardView />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="properties" element={<PropertiesListView />} />
            <Route path="properties/register" element={<RegisterPropertyView />} />
            <Route path="estimation/:id" element={<EstimationResultView />} />
            <Route path="profile" element={<ProfileView />} />
            
            {/* Rutas Premium */}
            <Route path="schedule-advisory" element={<ScheduleAdvisoryView />} />
            <Route path="generate-report" element={<GenerateReportView />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
