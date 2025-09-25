import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabase/client';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CaseForm from './components/Case/CaseForm';
import CaseDetails from './components/Case/CaseDetails';
import CauseListGenerator from './components/CauseList/CauseListGenerator';
import CaseSearch from './components/Search/CaseSearch';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import CalendarView from './components/Calendar/CalendarView';
import NotificationLog from './components/Notifications/NotificationLog';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  if (!session && window.location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <ul className="flex space-x-4">
            <li><a href="/dashboard"><i className="fas fa-home"></i> Dashboard</a></li>
            {session?.user?.user_metadata?.role === 'lawyer' && (
              <li><a href="/case/new"><i className="fas fa-file"></i> File Case</a></li>
            )}
            <li><a href="/search"><i className="fas fa-search"></i> Search</a></li>
            <li><a href="/cause-list"><i className="fas fa-list"></i> Cause List</a></li>
            {['super_admin', 'chief_registry', 'chief_judge'].includes(session?.user?.user_metadata?.role) && (
              <li><a href="/analytics"><i className="fas fa-chart-bar"></i> Analytics</a></li>
            )}
            <li><a href="/calendar"><i className="fas fa-calendar"></i> Calendar</a></li>
            <li><a href="/notifications"><i className="fas fa-bell"></i> Notifications</a></li>
            <li><a href="#" onClick={() => supabase.auth.signOut()}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/case/new" element={<CaseForm />} />
          <Route path="/case/:refNo" element={<CaseDetails />} />
          <Route path="/cause-list" element={<CauseListGenerator />} />
          <Route path="/search" element={<CaseSearch />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/notifications" element={<NotificationLog />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;