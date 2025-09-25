import { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

function CaseForm() {
  const [formData, setFormData] = useState({
    case_type: '',
    parties: { plaintiff: '', defendant: '', lawyers: [] },
    court: '',
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('cases').insert([formData]).select();
    if (error) {
      alert(error.message);
      return;
    }

    if (file) {
      const filePath = `cases/${data[0].id}/${file.name}`;
      await supabase.storage.from('documents').upload(filePath, file);
      await supabase.from('documents').insert([{ case_id: data[0].id, file_path: filePath }]);
    }

    // Trigger notification (Edge Function)
    await fetch(import.meta.env.VITE_EMAIL_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'filing_confirmation',
        caseId: data[0].id,
        recipientEmail: formData.parties.lawyers[0]?.email || 'lawyer@example.com',
        content: `Case ${data[0].reference_number} filed successfully.`,
      }),
    });

    navigate(`/case/${data[0].reference_number}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-file"></i> File New Case</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="block">Case Type</label>
          <input
            type="text"
            value={formData.case_type}
            onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Plaintiff</label>
          <input
            type="text"
            value={formData.parties.plaintiff}
            onChange={(e) => setFormData({ ...formData, parties: { ...formData.parties, plaintiff: e.target.value } })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Defendant</label>
          <input
            type="text"
            value={formData.parties.defendant}
            onChange={(e) => setFormData({ ...formData, parties: { ...formData.parties, defendant: e.target.value } })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Court</label>
          <input
            type="text"
            value={formData.court}
            onChange={(e) => setFormData({ ...formData, court: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Document</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          <i className="fas fa-plus"></i> Submit Case
        </button>
      </form>
    </div>
  );
}

export default CaseForm;