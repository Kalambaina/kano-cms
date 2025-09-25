import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import jsPDF from 'jspdf';

function CauseListGenerator() {
  const [period, setPeriod] = useState('daily');
  const [court, setCourt] = useState('');
  const [causeList, setCauseList] = useState([]);

  useEffect(() => {
    const fetchCauseList = async () => {
      const { data, error } = await supabase
        .from('hearings')
        .select('*, cases(reference_number, case_type)')
        .eq('date', new Date().toISOString().split('T')[0]); // Example: today
      if (error) alert(error.message);
      else setCauseList(data);
    };
    fetchCauseList();
  }, [period, court]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Cause List', 10, 10);
    causeList.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.cases.reference_number} - ${item.cases.case_type}`, 10, 20 + index * 10);
    });
    doc.save(`cause_list_${period}.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"><i className="fas fa-list"></i> Cause List</h1>
      <div className="mb-4">
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border p-2 rounded">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input
          type="text"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          placeholder="Court Filter"
          className="border p-2 ml-2 rounded"
        />
        <button onClick={generatePDF} className="bg-blue-500 text-white p-2 rounded ml-2">
          <i className="fas fa-download"></i> Download PDF
        </button>
      </div>
      <ul className="bg-white p-4 rounded shadow">
        {causeList.map((item) => (
          <li key={item.id}>{item.cases.reference_number} - {item.cases.case_type} on {item.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default CauseListGenerator;