import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useToast } from '../../../contexts/ToastContext';
import '../styles/ScheduleAdvisory.css';

const ScheduleAdvisoryView = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleConfirm = async () => {
    if (!date) {
      addToast('Por favor selecciona una fecha.', 'warning');
      return;
    }
    if (!time) {
      addToast('Por favor selecciona una hora.', 'warning');
      return;
    }

    // Validar fecha futura
    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    selectedDateTime.setHours(hours, minutes);

    if (selectedDateTime < new Date()) {
      addToast('La fecha y hora deben ser en el futuro.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Simulación de llamada al backend
      // TODO: Conectar a endpoint real cuando exista
      await new Promise(resolve => setTimeout(resolve, 1500));

      addToast(`¡Cita confirmada para el ${date.toLocaleDateString()} a las ${time}!`, 'success');
      // Resetear
      setTime('');
      setDate(new Date());

    } catch (error) {
      console.error(error);
      addToast('Hubo un error al agendar la cita.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <h2 style={{ color: '#2D3748', marginBottom: '1rem' }}>Agendar Asesoría Premium</h2>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>Selecciona una fecha y hora para tu sesión con un experto.</p>

      <div className="calendar-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <Calendar
          onChange={setDate}
          value={date}
          minDate={new Date()}
          className="react-calendar-custom"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#4A5568' }}>Selecciona una Hora:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}
        />
      </div>

      <p style={{ marginBottom: '1.5rem', fontWeight: '500' }}>
        Fecha seleccionada: <span style={{ color: '#FF7B54' }}>{date.toLocaleDateString()}</span>
      </p>

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="btn-confirm-schedule"
        style={{
          padding: '1rem 2rem',
          background: '#FF7B54',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background 0.3s'
        }}
      >
        {loading ? 'Confirmando...' : 'Confirmar Cita'}
      </button>

      <style>{`
        .react-calendar-custom {
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          font-family: 'Inter', sans-serif;
        }
        .react-calendar__tile--active {
          background: #FF7B54 !important;
          color: white;
        }
        .react-calendar__tile--now {
          background: #FFF5F2;
        }
      `}</style>
    </div>
  );
};

export default ScheduleAdvisoryView;
