import { useState } from 'react';
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'lawyer' } } // Default role; Super Admin must update
    });
    if (error) alert(error.message);
    else alert('Check your email for confirmation link');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4"><i className="fas fa-lock"></i> Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
            placeholder="Password"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </form>
        <button
          onClick={handleSignUp}
          className="bg-green-500 text-white p-2 rounded w-full mt-2"
        >
          <i className="fas fa-user-plus"></i> Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;