// src/components/RoleAuthForm.tsx
import { useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';

interface RoleAuthFormProps {
  role: string;               // e.g. "super_admin"
  dashboardPath: string;      // e.g. "/admin-dashboard"
  title: string;              // "Admin Login"
}

export function RoleAuthForm({ role, dashboardPath, title }: RoleAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      // ---- SIGN-UP -------------------------------------------------
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } }, // <-- role stored in user_metadata
      });
      if (error) alert(error.message);
      else alert('Check your email for the confirmation link');
    } else {
      // ---- LOGIN ---------------------------------------------------
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message);
      } else {
        // double-check role on the server side
        const storedRole = data.user?.user_metadata?.role;
        if (storedRole === role) {
          navigate(dashboardPath);
        } else {
          alert('You are not authorized for this role.');
          await supabase.auth.signOut();
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-medium transition ${
              isSignup ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-3 text-sm text-gray-600 underline hover:text-gray-800"
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
