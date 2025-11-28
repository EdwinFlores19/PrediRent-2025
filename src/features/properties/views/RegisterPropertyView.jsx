import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import '../styles/RegisterProperty.css';

const RegisterPropertyView = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    direccion: '',
    tipo: '',
    area: '',
    habitaciones: '',
    banos: '',
    precio: '',
    descripcion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      return formData.titulo && formData.direccion && formData.tipo;
    }
    if (currentStep === 2) {
      return formData.area && formData.habitaciones && formData.banos;
    }
    if (currentStep === 3) {
      return formData.precio && formData.descripcion;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      addToast('Por favor complete todos los campos obligatorios.', 'warning');
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      addToast('Por favor complete todos los campos.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        addToast('Sesión expirada. Por favor inicie sesión nuevamente.', 'error');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/propiedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          area: Number(formData.area),
          habitaciones: Number(formData.habitaciones),
          banos: Number(formData.banos),
          precio: Number(formData.precio)
        })
      });

      if (response.ok) {
        addToast('Propiedad registrada con éxito', 'success');
        navigate('/properties');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error:', error);
      addToast(error.message || 'Error al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-property-container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2D3748', marginBottom: '2rem' }}>Registrar Nueva Propiedad</h2>

      {/* Indicador de Pasos */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: step >= s ? '#FF7B54' : '#EDF2F7',
            color: step >= s ? 'white' : '#2D3748',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', margin: '0 10px'
          }}>
            {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Paso 1 */}
        <div style={{ display: step === 1 ? 'block' : 'none' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Título</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }} placeholder="Ej: Apartamento Centro" />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <option value="">Seleccione...</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="local">Local</option>
            </select>
          </div>
        </div>

        {/* Paso 2 */}
        <div style={{ display: step === 2 ? 'block' : 'none' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Área (m²)</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Habitaciones</label>
            <input type="number" name="habitaciones" value={formData.habitaciones} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Baños</label>
            <input type="number" name="banos" value={formData.banos} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
          </div>
        </div>

        {/* Paso 3 */}
        <div style={{ display: step === 3 ? 'block' : 'none' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Precio Estimado (USD)</label>
            <input type="number" name="precio" value={formData.precio} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}></textarea>
          </div>
        </div>

        <div className="form-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} style={{ padding: '0.75rem 1.5rem', background: '#EDF2F7', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Anterior</button>
          ) : <div></div>}

          {step < 3 ? (
            <button type="button" onClick={nextStep} style={{ padding: '0.75rem 1.5rem', background: '#FF7B54', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Siguiente</button>
          ) : (
            <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', background: '#FF7B54', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Registrando...' : 'Registrar Propiedad'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterPropertyView;
