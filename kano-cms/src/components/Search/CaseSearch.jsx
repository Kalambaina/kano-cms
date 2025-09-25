import { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

function CaseSearch() {
  const [searchParams, setSearchParams] = useState({
    reference_number: '',
    party_name: '',
    status: '',
  });
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    let query = supabase.from('cases').select('*');
    if (searchParams.reference_number) query = query.eq('reference_number', searchParams.reference_number);
    if (searchParams.party_name) query = query.ilike('parties', `%${searchParams.party_name}%`);
    if (searchParams.status) query = query.eq('status', searchParams.status);

    const { data, error } = await query;
    if (error) alert(error.message);
    else setResults(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-search"></i> Case Search</h1>
      <form onSubmit={handleSearch} className="mb-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          value={searchParams.reference_number}
          onChange={(e) => setSearchParams({ ...searchParams, reference_number: e.target.value })}
          placeholder="Reference Number"
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          value={searchParams.party_name}
          onChange={(e) => setSearchParams({ ...searchParams, party_name: e.target.value })}
          placeholder="Party Name"
          className="border p-2 mr-2 rounded"
        />
        <select
          value={searchParams.status}
          onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
          className="border p-2 mr-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          <i className="fas fa-search"></i> Search
        </button>
      </form>
      <ul className="bg-white p-4 rounded shadow">
        {results.map((caseItem) => (
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
  );
}

export default CaseSearch;