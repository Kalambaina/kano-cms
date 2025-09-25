import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [userRole, setUserRole] = useState('');
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndCases = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserRole(user?.user_metadata?.role || 'public');

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .limit(10); // Role-based filtering handled by RLS
      if (error) alert(error.message);
      else setCases(data);
    };
    fetchUserAndCases();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-tachometer-alt"></i> {userRole} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl mb-2">Recent Cases</h2>
          <ul className="space-y-2">
            {cases.map((caseItem) => (
              <li key={caseItem.id} className="flex justify-between">
                <span>{caseItem.reference_number} - {caseItem.case_type}</span>
                <button
                  onClick={() => navigate(`/case/${caseItem.reference_number}`)}
                  className="text-blue-500"
                >
                  <i className="fas fa-eye"></i> View
                </button>
              </li>
            ))}
          </ul>
        </div>
        {['super_admin', 'chief_registry'].includes(userRole) && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl mb-2">Quick Actions</h2>
            <button
              onClick={() => navigate('/case/new')}
              className="bg-blue-500 text-white p-2 rounded"
            >
              <i className="fas fa-file"></i> File New Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;