import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/ScheduleAdvisory.css';

const ScheduleAdvisoryView = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="schedule-container">
      <h2>Agendar Asesoría Premium</h2>
      <p>Selecciona una fecha y hora para tu sesión con un experto.</p>
      <div className="calendar-wrapper">
        <Calendar
          onChange={setDate}
          value={date}
        />
      </div>
      <p>Fecha seleccionada: {date.toLocaleDateString()}</p>
      <button className="btn-confirm-schedule">Confirmar Cita</button>
    </div>
  );
};

export default ScheduleAdvisoryView;
