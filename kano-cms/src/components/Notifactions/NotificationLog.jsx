import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

function NotificationLog() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('sent_at', { ascending: false });
      if (error) alert(error.message);
      else setNotifications(data);
    };
    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-bell"></i> Notifications</h1>
      <ul className="bg-white p-4 rounded shadow">
        {notifications.map((notif) => (
          <li key={notif.id} className="border-b py-2">
            <span><strong>{notif.type}</strong>: {notif.content} ({notif.sent_at})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationLog;