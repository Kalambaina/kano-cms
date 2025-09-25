import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchHearings = async () => {
      const { data, error } = await supabase
        .from('hearings')
        .select('id, date, time, cases(reference_number, case_type)')
        .eq('date', new Date().toISOString().split('T')[0]); // Example: today
      if (error) alert(error.message);
      else {
        setEvents(data.map((hearing) => ({
          id: hearing.id,
          title: `${hearing.cases.reference_number} - ${hearing.cases.case_type}`,
          date: `${hearing.date}T${hearing.time || '09:00'}`,
        })));
      }
    };
    fetchHearings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-calendar"></i> Court Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </div>
  );
}

export default CalendarView;