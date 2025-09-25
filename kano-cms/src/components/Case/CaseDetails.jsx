import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useParams } from 'react-router-dom';

function CaseDetails() {
  const { refNo } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchCase = async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('reference_number', refNo)
        .single();
      if (error) alert(error.message);
      else setCaseData(data);

      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', data.id);
      setDocuments(docs || []);
    };
    fetchCase();
  }, [refNo]);

  if (!caseData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-folder"></i> Case: {caseData.reference_number}</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Type:</strong> {caseData.case_type}</p>
        <p><strong>Court:</strong> {caseData.court}</p>
        <p><strong>Status:</strong> {caseData.status}</p>
        <p><strong>Parties:</strong> {JSON.stringify(caseData.parties)}</p>
        <h2 className="text-xl mt-4">Documents</h2>
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <a href={supabase.storage.from('documents').getPublicUrl(doc.file_path).data.publicUrl} target="_blank">
                <i className="fas fa-file"></i> {doc.file_path.split('/').pop()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CaseDetails;