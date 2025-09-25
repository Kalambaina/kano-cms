import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function AnalyticsDashboard() {
  const [caseStats, setCaseStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('status, count:count(*)')
        .group('status');
      if (error) alert(error.message);
      else setCaseStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-chart-bar"></i> Analytics Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-2">Case Status Distribution</h2>
        <BarChart width={600} height={300} data={caseStats}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;